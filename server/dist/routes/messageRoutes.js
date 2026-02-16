"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = require("../controllers/messageController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/send', auth_1.protect, messageController_1.sendMessage);
router.get('/conversations', auth_1.protect, messageController_1.getConversations);
router.get('/:conversationId', auth_1.protect, messageController_1.getMessages);
router.put('/:conversationId/read', auth_1.protect, messageController_1.markAsRead);
exports.default = router;
