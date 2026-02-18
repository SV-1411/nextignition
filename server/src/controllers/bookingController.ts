import { Response } from 'express';
import Booking from '../models/Booking';
import Availability from '../models/Availability';
import { AuthRequest } from '../middleware/auth';
import { createNotification } from './notificationController';
import mongoose from 'mongoose';

const addMinutesToTime = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
};

const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

export const createBooking = async (req: AuthRequest, res: Response) => {
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
        const availability = await Availability.findOne({
            expert: mongoose.Types.ObjectId.isValid(expertId) ? (expertId as any) : (expert as any),
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
        if (availability.unavailableDates.some((unavailableDate: Date) =>
            new Date(unavailableDate).toDateString() === bookingDate.toDateString()
        )) {
            return res.status(400).json({ message: 'Expert is unavailable on this date' });
        }

        // Best-effort conflict check (the DB unique index is the final guarantee)
        const dayStart = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const existingBookings = await Booking.find({
            expert: mongoose.Types.ObjectId.isValid(expertId) ? (expertId as any) : (expert as any),
            date: { $gte: dayStart, $lt: dayEnd },
            status: { $in: ['pending', 'confirmed'] },
        }).select('startTime duration');

        const reqStartMin = timeToMinutes(requestedStartTime);
        const reqEndMin = timeToMinutes(requestedEndTime);
        const overlaps = existingBookings.some((b: any) => {
            const bStartMin = timeToMinutes(String(b.startTime));
            const bEndMin = bStartMin + Number(b.duration || 0);
            return reqStartMin < bEndMin && bStartMin < reqEndMin;
        });
        if (overlaps) {
            return res.status(400).json({ message: 'Time slot is already booked' });
        }

        // Enforce only one active booking per founder per expert
        const existingActiveForFounder = await Booking.findOne({
            founder: req.user.id as any,
            expert: mongoose.Types.ObjectId.isValid(expertId) ? (expertId as any) : (expert as any),
            status: { $in: ['pending', 'confirmed'] },
        }).select('_id date startTime status');
        if (existingActiveForFounder?._id) {
            const d = new Date(existingActiveForFounder.date);
            return res.status(400).json({
                message: `You already have an active booking with this expert on ${d.toDateString()} at ${existingActiveForFounder.startTime}.`,
            });
        }

        const booking = await Booking.create({
            founder: req.user.id,
            expert: mongoose.Types.ObjectId.isValid(expertId) ? (expertId as any) : (expert as any),
            date: bookingDate,
            bookingDate: normalizedBookingDate,
            startTime: requestedStartTime,
            duration,
            topic,
            notes,
        });

        // Notifications
        await createNotification(
            String(req.user.id),
            'booking',
            'Session booked',
            `Your session with the expert is booked for ${bookingDate.toDateString()} at ${requestedStartTime}.`,
            '/dashboard?tab=sessions',
            expertId
        );
        await createNotification(
            expertId,
            'booking',
            'New session booking',
            `You have a new session booking for ${bookingDate.toDateString()} at ${requestedStartTime}.`,
            '/dashboard?tab=sessions',
            String(req.user.id)
        );

        res.status(201).json(booking);
    } catch (error: any) {
        if (error?.code === 11000) {
            return res.status(400).json({ message: 'Time slot is already booked' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
    try {
        let query = {};
        if (req.user.role === 'founder') {
            query = { founder: req.user.id };
        } else if (req.user.role === 'expert') {
            query = { expert: req.user.id };
        }

        const bookings = await Booking.find(query)
            .populate('founder', 'name avatar')
            .populate('expert', 'name avatar')
            .sort({ date: 1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

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
        await createNotification(
            founderId,
            'booking',
            'Booking updated',
            `Your booking for ${bookingDate.toDateString()} at ${time} is now ${statusLabel}.`,
            '/dashboard?tab=sessions',
            expertId
        );
        await createNotification(
            expertId,
            'booking',
            'Booking updated',
            `A booking for ${bookingDate.toDateString()} at ${time} is now ${statusLabel}.`,
            '/dashboard?tab=sessions',
            founderId
        );

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
