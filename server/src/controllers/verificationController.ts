import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

export const completeVerification = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isVerified = true;
        await user.save();

        return res.json({ isVerified: true });
    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to complete verification', error: error?.message });
    }
};

export const setVerificationBannerState = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { dismissedUntil } = req.body as { dismissedUntil?: string | null };

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (dismissedUntil === null) {
            (user as any).verificationBannerDismissedUntil = undefined;
        } else if (dismissedUntil) {
            const d = new Date(dismissedUntil);
            if (Number.isNaN(d.getTime())) {
                return res.status(400).json({ message: 'Invalid dismissedUntil' });
            }
            (user as any).verificationBannerDismissedUntil = d;
        } else {
            // If not provided, default to dismiss for this session/day
            (user as any).verificationBannerDismissedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }

        await user.save();

        return res.json({ verificationBannerDismissedUntil: (user as any).verificationBannerDismissedUntil || null });
    } catch (error: any) {
        return res.status(500).json({ message: 'Failed to update banner state', error: error?.message });
    }
};
