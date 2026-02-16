import express from 'express';
import { protect } from '../middleware/auth';
import {
    submitFundingApplication,
    listFundingStartups,
    bookmarkStartup,
    expressInterest,
    listMyBookmarks,
} from '../controllers/fundingController';

const router = express.Router();

router.get('/startups', listFundingStartups);
router.post('/applications', protect, submitFundingApplication);

router.get('/bookmarks', protect, listMyBookmarks);
router.post('/startups/:startupId/bookmark', protect, bookmarkStartup);
router.post('/startups/:startupId/interest', protect, expressInterest);

export default router;
