import express from 'express';
import { protect } from '../middleware/auth';
import { completeVerification, setVerificationBannerState } from '../controllers/verificationController';

const router = express.Router();

router.post('/complete', protect, completeVerification);
router.post('/banner', protect, setVerificationBannerState);

export default router;
