import express from 'express';
import { generateStartupSummary, summarizeProfile, summarizePitchDeck, aiChat, matchExperts, matchCofounders, matchClients, aiQuickAction, deriveDeckInsights } from '../controllers/aiController';
import { protect, maybeAuth } from '../middleware/auth';
import { uploadDocs } from '../middleware/upload';

const router = express.Router();

router.post('/summary', protect, generateStartupSummary);
router.post('/profile', protect, summarizeProfile);
router.post('/pitch-deck', maybeAuth, uploadDocs.single('pitchDeck'), summarizePitchDeck);
router.post('/chat', protect, aiChat);
router.post('/quick-action', protect, aiQuickAction);
router.post('/match-cofounders', protect, matchCofounders);
router.post('/match-clients', protect, matchClients);
router.post('/match-experts', protect, matchExperts);
router.post('/deck-insights', protect, deriveDeckInsights);

export default router;
