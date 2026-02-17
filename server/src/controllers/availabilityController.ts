import { Request, Response } from 'express';
import Availability from '../models/Availability';
import { AuthRequest } from '../middleware/auth';

export const getMyAvailability = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const availability = await Availability.find({ expert: String(req.user.id) as any }).sort({ dayOfWeek: 1 });
        res.json(availability);
    } catch (error: any) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};

export const setAvailability = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { dayOfWeek, slots, unavailableDates } = req.body;

        if (dayOfWeek === undefined || !Array.isArray(slots)) {
            return res.status(400).json({ message: 'dayOfWeek and slots are required' });
        }

        const availability = await Availability.findOneAndUpdate(
            { expert: String(req.user.id) as any, dayOfWeek },
            { expert: String(req.user.id), dayOfWeek, slots, unavailableDates: unavailableDates || [] },
            { new: true, upsert: true }
        );

        res.json(availability);
    } catch (error: any) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};

export const deleteAvailability = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { dayOfWeek } = req.params;

        await Availability.findOneAndDelete({
            expert: String(req.user.id) as any,
            dayOfWeek: Number(dayOfWeek)
        });

        res.json({ message: 'Availability deleted' });
    } catch (error: any) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};

export const getExpertAvailability = async (req: Request, res: Response) => {
    try {
        const { expertId } = req.params;
        const availability = await Availability.find({ expert: expertId as any }).sort({ dayOfWeek: 1 });
        res.json(availability);
    } catch (error: any) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};
