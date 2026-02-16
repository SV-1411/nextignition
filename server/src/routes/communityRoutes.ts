import express from 'express';
import { protect } from '../middleware/auth';
import {
  getCommunities,
  getChannels,
  getMessages,
  sendMessage,
  getMembers,
} from '../controllers/communityController';

const router = express.Router();

router.get('/', protect, getCommunities);
router.get('/:communityId/channels', protect, getChannels);
router.get('/:communityId/members', protect, getMembers);
router.get('/channels/:channelId/messages', protect, getMessages);
router.post('/channels/:channelId/messages', protect, sendMessage);

export default router;
