import { Response } from 'express';
import Booking from '../models/Booking';
import Availability from '../models/Availability';
import { AuthRequest } from '../middleware/auth';

const addMinutesToTime = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
};

export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        const { expert, date, startTime, duration, topic, notes } = req.body;

        // Validate required fields
        if (!expert || !date || !startTime || !duration) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Parse date and time
        const bookingDate = new Date(date);
        const dayOfWeek = bookingDate.getDay();
        const requestedStartTime = startTime; // HH:mm format
        const requestedEndTime = addMinutesToTime(startTime, duration);

        // Check expert availability
        const availability = await Availability.findOne({ expert, dayOfWeek });
        if (!availability) {
            return res.status(400).json({ message: 'Expert is not available on this day' });
        }

        // Check if the requested time slot is available
        const availableSlot = availability.slots.find(slot =>
            slot.startTime <= requestedStartTime && slot.endTime >= requestedEndTime
        );
        if (!availableSlot) {
            return res.status(400).json({ message: 'Requested time slot is not available' });
        }

        // Check for unavailable dates
        if (availability.unavailableDates.some((unavailableDate: Date) =>
            new Date(unavailableDate).toDateString() === bookingDate.toDateString()
        )) {
            return res.status(400).json({ message: 'Expert is unavailable on this date' });
        }

        // Check for conflicting bookings
        const conflictingBooking = await Booking.findOne({
            expert,
            date: bookingDate,
            status: { $in: ['pending', 'confirmed'] },
            $or: [
                {
                    startTime: { $lt: requestedEndTime },
                    $expr: { $gt: [{ $add: ['$startTime', '$duration'] }, requestedStartTime] }
                }
            ]
        });
        if (conflictingBooking) {
            return res.status(400).json({ message: 'Time slot is already booked' });
        }

        const booking = await Booking.create({
            founder: req.user.id,
            expert,
            date: bookingDate,
            startTime: requestedStartTime,
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
