"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getMessages = exports.getConversations = exports.sendMessage = void 0;
const Message_1 = __importDefault(require("../models/Message"));
const Conversation_1 = __importDefault(require("../models/Conversation"));
const mongoose_1 = __importDefault(require("mongoose"));
// Send a message
const sendMessage = async (req, res) => {
    try {
        const { receiverId, content, type, fileUrl } = req.body;
        const senderId = req.user.id;
        // Check if conversation already exists between these two users
        let conversation = await Conversation_1.default.findOne({
            participants: { $all: [senderId, receiverId] },
            type: 'direct',
        });
        // If not, create a new conversation
        if (!conversation) {
            conversation = await Conversation_1.default.create({
                participants: [senderId, receiverId],
                type: 'direct',
            });
        }
        // Create the message
        const message = await Message_1.default.create({
            conversationId: conversation._id,
            sender: senderId,
            receiver: receiverId,
            content,
            type: type || 'text',
            fileUrl,
        });
        // Update conversation with last message and unread count
        const unreadKey = `unreadCount.${receiverId}`;
        await Conversation_1.default.findByIdAndUpdate(conversation._id, {
            lastMessage: {
                content: type === 'image' ? 'Sent an image' : type === 'file' ? 'Sent a file' : content,
                sender: senderId,
                timestamp: new Date(),
            },
            $inc: { [unreadKey]: 1 },
        });
        // TODO: Emit socket event for real-time update
        const populatedMessage = await Message_1.default.findById(message._id).populate('sender', 'name avatar');
        res.status(201).json(populatedMessage);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Message sending failed' });
    }
};
exports.sendMessage = sendMessage;
// Get all conversations for the current user
const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await Conversation_1.default.find({
            participants: userId,
        })
            .populate('participants', 'name avatar role isVerified')
            .sort({ updatedAt: -1 });
        res.json(conversations);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch conversations' });
    }
};
exports.getConversations = getConversations;
// Get messages for a specific conversation
const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const convObjectId = new mongoose_1.default.Types.ObjectId(conversationId);
        const messages = await Message_1.default.find({ conversationId: convObjectId })
            .populate('sender', 'name avatar')
            .sort({ createdAt: 1 });
        res.json(messages);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
};
exports.getMessages = getMessages;
// Mark conversation as read
const markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;
        // Reset unread count for this user in the conversation
        const unreadKey = `unreadCount.${userId}`;
        await Conversation_1.default.findByIdAndUpdate(conversationId, {
            $set: { [unreadKey]: 0 },
        });
        // Mark all messages in this conversation received by this user as read
        const convObjectId = new mongoose_1.default.Types.ObjectId(conversationId);
        await Message_1.default.updateMany({ conversationId: convObjectId, receiver: userId, isRead: false }, { $set: { isRead: true } });
        res.json({ message: 'Marked as read' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to mark as read' });
    }
};
exports.markAsRead = markAsRead;
