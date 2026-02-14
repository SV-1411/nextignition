import { Response } from 'express';
import Booking from '../models/Booking';
import { AuthRequest } from '../middleware/auth';

export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        const { expert, date, startTime, duration, topic, notes } = req.body;

        const booking = await Booking.create({
            founder: req.user.id,
            expert,
            date,
            startTime,
            duration,
            topic,
            notes,
        });

        res.status(201).json(booking);
    } catch (error) {
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
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
