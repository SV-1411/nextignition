import express from 'express';
import { createPost, getFeed, likePost, addComment } from '../controllers/feedController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createPost);
router.get('/', getFeed);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);

export default router;
