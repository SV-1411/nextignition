import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import Follow from '../models/Follow';
import User from '../models/User';

export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    const me = req.user?.id;
    const otherId = req.params.userId as string;

    if (!me) return res.status(401).json({ message: 'Unauthorized' });
    if (!otherId) return res.status(400).json({ message: 'userId is required' });
    if (!mongoose.Types.ObjectId.isValid(otherId)) return res.status(400).json({ message: 'Invalid userId' });
    if (String(me) === String(otherId)) return res.status(400).json({ message: 'Cannot follow yourself' });

    const other = await User.findById(otherId).select('_id');
    if (!other) return res.status(404).json({ message: 'User not found' });

    await Follow.updateOne(
      { follower: me as any, following: otherId as any },
      { $setOnInsert: { follower: me as any, following: otherId as any } },
      { upsert: true }
    );

    return res.json({ ok: true });
  } catch (error: any) {
    if (error?.code === 11000) return res.json({ ok: true });
    return res.status(500).json({ message: 'Failed to follow user', error: error?.message });
  }
};

export const unfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    const me = req.user?.id;
    const otherId = req.params.userId as string;

    if (!me) return res.status(401).json({ message: 'Unauthorized' });
    if (!otherId) return res.status(400).json({ message: 'userId is required' });
    if (!mongoose.Types.ObjectId.isValid(otherId)) return res.status(400).json({ message: 'Invalid userId' });

    await Follow.deleteOne({ follower: me as any, following: otherId as any });
    return res.json({ ok: true });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to unfollow user', error: error?.message });
  }
};

export const getMyFollowing = async (req: AuthRequest, res: Response) => {
  try {
    const me = req.user?.id;
    if (!me) return res.status(401).json({ message: 'Unauthorized' });

    const rows = await Follow.find({ follower: me as any }).select('following');
    const ids = rows.map((r) => String(r.following));

    return res.json({ followingUserIds: ids });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to fetch following', error: error?.message });
  }
};
