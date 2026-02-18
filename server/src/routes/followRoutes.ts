import { Router } from 'express';
import { protect } from '../middleware/auth';
import { followUser, getMyFollowing, unfollowUser } from '../controllers/followController';

const router = Router();

router.get('/following', protect, getMyFollowing);
router.post('/:userId', protect, followUser);
router.delete('/:userId', protect, unfollowUser);

export default router;
