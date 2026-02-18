"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const messagingController_1 = require("../controllers/messagingController");
const router = (0, express_1.Router)();
// Conversation routes
router.post('/conversations', auth_1.protect, messagingController_1.getOrCreateConversation);
router.get('/conversations', auth_1.protect, messagingController_1.getMyConversations);
router.post('/conversations/invite-community', auth_1.protect, messagingController_1.inviteToCommunityViaMessage);
// Message routes
router.get('/conversations/:conversationId/messages', auth_1.protect, messagingController_1.getMessages);
router.post('/conversations/:conversationId/messages', auth_1.protect, messagingController_1.sendMessage);
router.post('/conversations/:conversationId/attachments', auth_1.protect, upload_1.uploadAny.array('files', 10), messagingController_1.sendAttachment);
// User search routes
router.get('/users/search', auth_1.protect, messagingController_1.searchUsers);
router.get('/users/messaging', auth_1.protect, messagingController_1.getMessagingUsers);
exports.default = router;
