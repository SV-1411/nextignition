"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatus = exports.getMyBookings = exports.createBooking = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const Availability_1 = __importDefault(require("../models/Availability"));
const notificationController_1 = require("./notificationController");
const mongoose_1 = __importDefault(require("mongoose"));
const addMinutesToTime = (time, minutes) => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
};
const timeToMinutes = (time) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};
const createBooking = async (req, res) => {
    try {
        const { expert, date, startTime, duration, topic, notes } = req.body;
        const expertId = String(expert);
        // Validate required fields
        if (!expert || !date || !startTime || !duration) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // Parse date and time
        const bookingDate = new Date(date);
        if (Number.isNaN(bookingDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date' });
        }
        const dayOfWeek = bookingDate.getDay();
        const normalizedBookingDate = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
        const requestedStartTime = startTime; // HH:mm format
        const requestedEndTime = addMinutesToTime(startTime, duration);
        // Check expert availability
        const availability = await Availability_1.default.findOne({
            expert: mongoose_1.default.Types.ObjectId.isValid(expertId) ? expertId : expert,
            dayOfWeek,
        });
        if (!availability) {
            return res.status(400).json({ message: 'Expert is not available on this day' });
        }
        // Check if the requested time slot is available
        const availableSlot = availability.slots.find(slot => slot.startTime === requestedStartTime);
        if (!availableSlot) {
            return res.status(400).json({ message: 'Requested time slot is not available' });
        }
        // Ensure the requested duration fits inside the chosen slot
        const slotEndMinutes = timeToMinutes(String(availableSlot.endTime));
        if (timeToMinutes(requestedEndTime) > slotEndMinutes) {
            return res.status(400).json({ message: 'Requested time slot is not available' });
        }
        // Check for unavailable dates
        if (availability.unavailableDates.some((unavailableDate) => new Date(unavailableDate).toDateString() === bookingDate.toDateString())) {
            return res.status(400).json({ message: 'Expert is unavailable on this date' });
        }
        // Best-effort conflict check (the DB unique index is the final guarantee)
        const dayStart = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
        const existingBookings = await Booking_1.default.find({
            expert: mongoose_1.default.Types.ObjectId.isValid(expertId) ? expertId : expert,
            date: { $gte: dayStart, $lt: dayEnd },
            status: { $in: ['pending', 'confirmed'] },
        }).select('startTime duration');
        const reqStartMin = timeToMinutes(requestedStartTime);
        const reqEndMin = timeToMinutes(requestedEndTime);
        const overlaps = existingBookings.some((b) => {
            const bStartMin = timeToMinutes(String(b.startTime));
            const bEndMin = bStartMin + Number(b.duration || 0);
            return reqStartMin < bEndMin && bStartMin < reqEndMin;
        });
        if (overlaps) {
            return res.status(400).json({ message: 'Time slot is already booked' });
        }
        // Enforce only one active booking per founder per expert
        const existingActiveForFounder = await Booking_1.default.findOne({
            founder: req.user.id,
            expert: mongoose_1.default.Types.ObjectId.isValid(expertId) ? expertId : expert,
            status: { $in: ['pending', 'confirmed'] },
        }).select('_id date startTime status');
        if (existingActiveForFounder?._id) {
            const d = new Date(existingActiveForFounder.date);
            return res.status(400).json({
                message: `You already have an active booking with this expert on ${d.toDateString()} at ${existingActiveForFounder.startTime}.`,
            });
        }
        const booking = await Booking_1.default.create({
            founder: req.user.id,
            expert: mongoose_1.default.Types.ObjectId.isValid(expertId) ? expertId : expert,
            date: bookingDate,
            bookingDate: normalizedBookingDate,
            startTime: requestedStartTime,
            duration,
            topic,
            notes,
        });
        // Notifications
        await (0, notificationController_1.createNotification)(String(req.user.id), 'booking', 'Session booked', `Your session with the expert is booked for ${bookingDate.toDateString()} at ${requestedStartTime}.`, '/dashboard?tab=sessions', expertId);
        await (0, notificationController_1.createNotification)(expertId, 'booking', 'New session booking', `You have a new session booking for ${bookingDate.toDateString()} at ${requestedStartTime}.`, '/dashboard?tab=sessions', String(req.user.id));
        res.status(201).json(booking);
    }
    catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({ message: 'Time slot is already booked' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createBooking = createBooking;
const getMyBookings = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'founder') {
            query = { founder: req.user.id };
        }
        else if (req.user.role === 'expert') {
            query = { expert: req.user.id };
        }
        const bookings = await Booking_1.default.find(query)
            .populate('founder', 'name avatar')
            .populate('expert', 'name avatar')
            .sort({ date: 1 });
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getMyBookings = getMyBookings;
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking_1.default.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        // Only the expert or admin can confirm/cancel from their side (simplified)
        booking.status = status;
        await booking.save();
        const bookingDate = new Date(booking.date);
        const time = booking.startTime;
        const founderId = String(booking.founder);
        const expertId = String(booking.expert);
        const statusLabel = String(status || '').toLowerCase();
        await (0, notificationController_1.createNotification)(founderId, 'booking', 'Booking updated', `Your booking for ${bookingDate.toDateString()} at ${time} is now ${statusLabel}.`, '/dashboard?tab=sessions', expertId);
        await (0, notificationController_1.createNotification)(expertId, 'booking', 'Booking updated', `A booking for ${bookingDate.toDateString()} at ${time} is now ${statusLabel}.`, '/dashboard?tab=sessions', founderId);
        res.json(booking);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateBookingStatus = updateBookingStatus;
