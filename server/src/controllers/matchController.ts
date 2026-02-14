import { Response } from 'express';
import User from '../models/User';
import Startup from '../models/Startup';
import { AuthRequest } from '../middleware/auth';

export const matchExperts = async (req: AuthRequest, res: Response) => {
    try {
        const startupId = req.params.startupId;
        const startup = await Startup.findById(startupId);

        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        // Basic matching logic based on industry and skills
        const experts = await User.find({
            role: 'expert',
            $or: [
                { 'profile.expertise': startup.industry },
                { 'profile.skills': { $in: [startup.industry] } }
            ]
        }).limit(10);

        res.json(experts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
