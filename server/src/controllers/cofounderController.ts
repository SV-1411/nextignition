import { Request, Response } from 'express';
import User from '../models/User';
import CofounderProfile from '../models/CofounderProfile';
import CofounderSave from '../models/CofounderSave';
import { AuthRequest } from '../middleware/auth';

export const listCofounders = async (req: Request, res: Response) => {
    try {
        const skill = (req.query.skill as string | undefined)?.trim();
        const location = (req.query.location as string | undefined)?.trim();
        const commitment = (req.query.commitment as string | undefined)?.trim();
        const startupStatus = (req.query.startupStatus as string | undefined)?.trim();

        const filter: any = { isActive: true };
        if (commitment) filter.commitment = commitment;
        if (startupStatus && startupStatus !== 'all') filter.startupStatus = startupStatus;
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (skill) filter.skills = { $in: [skill] };

        const profiles = await CofounderProfile.find(filter)
            .populate('user', 'name avatar role profile')
            .sort({ updatedAt: -1 })
            .limit(50);

        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const saveCofounder = async (req: AuthRequest, res: Response) => {
    try {
        const cofounderUserId = String(req.params.userId);
        const userId = String(req.user.id);
        const existing = await CofounderSave.findOne({ user: userId as any, cofounderUser: cofounderUserId as any });
        if (existing) {
            await CofounderSave.deleteOne({ _id: existing._id });
            return res.json({ saved: false });
        }
        await CofounderSave.create({ user: userId as any, cofounderUser: cofounderUserId as any });
        res.json({ saved: true });
    } catch (error: any) {
        if (error?.code === 11000) {
            return res.json({ saved: true });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

export const listSavedCofounders = async (req: AuthRequest, res: Response) => {
    try {
        const saved = await CofounderSave.find({ user: req.user.id }).select('cofounderUser');
        res.json(saved.map(s => String(s.cofounderUser)));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const upsertMyCofounderProfile = async (req: AuthRequest, res: Response) => {
    try {
        const {
            currentRole,
            lookingFor,
            commitment,
            equityExpectation,
            yearsExperience,
            previousStartups,
            availability,
            vision,
            strengths,
            interests,
            skills,
            location,
            startupStatus,
            isActive,
        } = req.body;

        const updated = await CofounderProfile.findOneAndUpdate(
            { user: req.user.id },
            {
                user: req.user.id,
                currentRole,
                lookingFor,
                commitment,
                equityExpectation,
                yearsExperience,
                previousStartups,
                availability,
                vision,
                strengths: Array.isArray(strengths) ? strengths : [],
                interests: Array.isArray(interests) ? interests : [],
                skills: Array.isArray(skills) ? skills : [],
                location,
                startupStatus,
                isActive: typeof isActive === 'boolean' ? isActive : true,
            },
            { new: true, upsert: true }
        ).populate('user', 'name avatar role profile');

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserPublic = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.userId).select('name avatar role profile');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
