import express from 'express';
import { createPost, getFeed, likePost, addComment, sharePost } from '../controllers/feedController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createPost);
router.get('/', getFeed);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);
router.post('/:id/share', protect, sharePost);

export default router;
