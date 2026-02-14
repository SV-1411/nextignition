import express from 'express';
import { generateStartupSummary, summarizeProfile, summarizePitchDeck, aiChat, matchExperts } from '../controllers/aiController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/summary', protect, generateStartupSummary);
router.post('/profile', protect, summarizeProfile);
router.post('/pitch-deck', protect, summarizePitchDeck);
router.post('/chat', protect, aiChat);
router.post('/match-experts', protect, matchExperts);

export default router;
