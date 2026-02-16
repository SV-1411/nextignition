"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatus = exports.getMyBookings = exports.createBooking = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const createBooking = async (req, res) => {
    try {
        const { expert, date, startTime, duration, topic, notes } = req.body;
        const booking = await Booking_1.default.create({
            founder: req.user.id,
            expert,
            date,
            startTime,
            duration,
            topic,
            notes,
        });
        res.status(201).json(booking);
    }
    catch (error) {
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
        res.json(booking);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateBookingStatus = updateBookingStatus;
