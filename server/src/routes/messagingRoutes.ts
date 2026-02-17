import { Router } from 'express';
import { protect } from '../middleware/auth';
import { uploadAny } from '../middleware/upload';
import {
  getOrCreateConversation,
  getMyConversations,
  getMessages,
  sendMessage,
  searchUsers,
  getMessagingUsers,
  sendAttachment,
} from '../controllers/messagingController';

const router = Router();

// Conversation routes
router.post('/conversations', protect, getOrCreateConversation);
router.get('/conversations', protect, getMyConversations);

// Message routes
router.get('/conversations/:conversationId/messages', protect, getMessages);
router.post('/conversations/:conversationId/messages', protect, sendMessage);
router.post('/conversations/:conversationId/attachments', protect, uploadAny.array('files', 10), sendAttachment);

// User search routes
router.get('/users/search', protect, searchUsers);
router.get('/users/messaging', protect, getMessagingUsers);

export default router;
