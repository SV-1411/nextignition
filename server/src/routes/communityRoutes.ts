import express from 'express';
import { protect } from '../middleware/auth';
import { uploadAny } from '../middleware/upload';
import {
  getCommunities,
  createCommunity,
  sendCommunityInvite,
  respondToCommunityInvite,
  joinCommunity,
  leaveCommunity,
  getChannels,
  getMessages,
  sendMessage,
  sendAttachmentMessage,
  sharePostToChannel,
  getMembers,
} from '../controllers/communityController';

const router = express.Router();

router.get('/', protect, getCommunities);
router.post('/', protect, createCommunity);
router.post('/:communityId/invite', protect, sendCommunityInvite);
router.post('/invites/:inviteId/respond', protect, respondToCommunityInvite);
router.post('/:communityId/join', protect, joinCommunity);
router.post('/:communityId/leave', protect, leaveCommunity);
router.get('/:communityId/channels', protect, getChannels);
router.get('/:communityId/members', protect, getMembers);
router.get('/channels/:channelId/messages', protect, getMessages);
router.post('/channels/:channelId/messages', protect, sendMessage);
router.post('/channels/:channelId/attachments', protect, uploadAny.array('files', 10), sendAttachmentMessage);
router.post('/channels/:channelId/share-post', protect, sharePostToChannel);

export default router;
