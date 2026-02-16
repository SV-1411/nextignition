import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const uploadAvatar = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const file = (req as any).file as Express.Multer.File | undefined;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const baseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
        const avatarUrl = `${baseUrl}/uploads/${file.filename}`;

        user.avatar = avatarUrl;
        await user.save();

        return res.json({ avatar: user.avatar });
    } catch (error: any) {
        return res.status(500).json({ message: 'Avatar upload failed', error: error?.message });
    }
};
