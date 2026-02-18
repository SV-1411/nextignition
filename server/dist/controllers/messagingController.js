"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAttachment = exports.getMessagingUsers = exports.searchUsers = exports.sendMessage = exports.getMessages = exports.getMyConversations = exports.getOrCreateConversation = exports.inviteToCommunityViaMessage = void 0;
const Conversation_1 = __importDefault(require("../models/Conversation"));
const DirectMessage_1 = __importDefault(require("../models/DirectMessage"));
const User_1 = __importDefault(require("../models/User"));
const Follow_1 = __importDefault(require("../models/Follow"));
const Community_1 = __importDefault(require("../models/Community"));
const CommunityInvite_1 = __importDefault(require("../models/CommunityInvite"));
const index_1 = require("../index");
const notificationController_1 = require("./notificationController");
// Check if user can message
const canMessageUser = async (fromUserId, toUserId) => {
    if (!fromUserId || !toUserId)
        return false;
    if (String(fromUserId) === String(toUserId))
        return true;
    const row = await Follow_1.default.findOne({ follower: fromUserId, following: toUserId }).select('_id');
    return !!row;
};
const inviteToCommunityViaMessage = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { otherUserId, communityId } = req.body;
        if (!otherUserId || !communityId) {
            return res.status(400).json({ message: 'otherUserId and communityId are required' });
        }
        const otherUser = await User_1.default.findById(otherUserId).select('_id name role roles');
        if (!otherUser?._id) {
            return res.status(404).json({ message: 'User not found' });
        }
        const allowed = await canMessageUser(String(userId), String(otherUserId));
        if (!allowed) {
            return res.status(403).json({ message: 'Follow this user to message them' });
        }
        const community = await Community_1.default.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        const isMember = (community.members || []).some((m) => String(m) === String(userId));
        if (!isMember) {
            return res.status(403).json({ message: 'You must be a member to invite others' });
        }
        const alreadyMember = (community.members || []).some((m) => String(m) === String(otherUserId));
        if (alreadyMember) {
            return res.status(400).json({ message: 'User is already a member' });
        }
        const inviteeRoles = otherUser.roles?.length ? otherUser.roles : [otherUser.role];
        const canJoin = (inviteeRoles || []).some((r) => community.allowedRoles.includes(r));
        if (!canJoin) {
            return res.status(400).json({ message: 'Invitee role is not allowed in this community' });
        }
        const invite = await CommunityInvite_1.default.findOneAndUpdate({ community: communityId, invitee: otherUserId, inviter: userId }, { community: communityId, invitee: otherUserId, inviter: userId, status: 'pending' }, { new: true, upsert: true });
        await (0, notificationController_1.createNotification)(String(otherUserId), 'community', 'Community invite', `You were invited to join ${community.name}.`, '/dashboard?tab=communities', String(userId), { action: 'community_invite', inviteId: String(invite._id), communityId: String(community._id) });
        let conversation = await Conversation_1.default.findOne({
            participants: { $all: [userId, otherUserId] },
            type: 'direct',
        });
        if (!conversation) {
            conversation = await Conversation_1.default.create({ participants: [userId, otherUserId], type: 'direct' });
        }
        const dmText = `I invited you to join ${community.name}. Check your notifications to accept.`;
        const message = await DirectMessage_1.default.create({
            conversationId: conversation._id,
            sender: userId,
            content: dmText,
            readBy: [userId],
        });
        await message.populate('sender', 'name avatar role');
        await Conversation_1.default.findByIdAndUpdate(conversation._id, {
            lastMessage: { content: dmText, sender: userId, timestamp: new Date() },
            lastMessageAt: new Date(),
        });
        index_1.io.to(`user_${otherUserId}`).emit('new_direct_message', {
            message,
            conversationId: String(conversation._id),
        });
        await conversation.populate('participants', 'name role roles avatar isVerified');
        res.status(201).json({ invite, conversation, message });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to invite user', error: error?.message });
    }
};
exports.inviteToCommunityViaMessage = inviteToCommunityViaMessage;
// Get or create conversation between two users
const getOrCreateConversation = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { otherUserId } = req.body;
        if (!otherUserId) {
            return res.status(400).json({ message: 'otherUserId is required' });
        }
        // Check if other user exists
        const otherUser = await User_1.default.findById(otherUserId);
        if (!otherUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const allowed = await canMessageUser(String(userId), String(otherUserId));
        if (!allowed) {
            return res.status(403).json({ message: 'Follow this user to message them' });
        }
        // Find existing conversation
        let conversation = await Conversation_1.default.findOne({
            participants: { $all: [userId, otherUserId] },
            type: 'direct',
        });
        // Create new conversation if not exists
        if (!conversation) {
            conversation = await Conversation_1.default.create({
                participants: [userId, otherUserId],
                type: 'direct',
            });
        }
        await conversation.populate('participants', 'name role roles avatar isVerified');
        res.json(conversation);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get/create conversation', error: error?.message });
    }
};
exports.getOrCreateConversation = getOrCreateConversation;
// Get user's conversations
const getMyConversations = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const conversations = await Conversation_1.default.find({
            participants: userId,
        })
            .populate('participants', 'name role roles avatar isVerified')
            .populate('lastMessage.sender', 'name avatar')
            .sort({ lastMessageAt: -1, updatedAt: -1 });
        res.json(conversations);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch conversations', error: error?.message });
    }
};
exports.getMyConversations = getMyConversations;
// Get messages in a conversation
const getMessages = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { conversationId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        // Verify user is in conversation
        const conversation = await Conversation_1.default.findOne({
            _id: conversationId,
            participants: userId,
        });
        if (!conversation) {
            return res.status(403).json({ message: 'You are not part of this conversation' });
        }
        if (conversation.type === 'direct') {
            const otherParticipant = conversation.participants.find((p) => String(p) !== String(userId));
            if (otherParticipant) {
                const allowed = await canMessageUser(String(userId), String(otherParticipant));
                if (!allowed) {
                    return res.status(403).json({ message: 'Follow this user to message them' });
                }
            }
        }
        const messages = await DirectMessage_1.default.find({ conversationId: conversationId })
            .populate('sender', 'name avatar role')
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        // Mark messages as read
        await DirectMessage_1.default.updateMany({
            conversationId: conversationId,
            sender: { $ne: userId },
            readBy: { $nin: [userId] },
        }, { $addToSet: { readBy: userId } });
        res.json(messages.reverse());
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch messages', error: error?.message });
    }
};
exports.getMessages = getMessages;
// Send a message
const sendMessage = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { conversationId } = req.params;
        const { content } = req.body;
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: 'Message content is required' });
        }
        // Verify user is in conversation
        const conversation = await Conversation_1.default.findOne({
            _id: conversationId,
            participants: userId,
        });
        if (!conversation) {
            return res.status(403).json({ message: 'You are not part of this conversation' });
        }
        const message = await DirectMessage_1.default.create({
            conversationId: conversationId,
            sender: userId,
            content: content.trim(),
            readBy: [userId],
        });
        await message.populate('sender', 'name avatar role');
        // Update conversation last message
        await Conversation_1.default.findByIdAndUpdate(conversationId, {
            lastMessage: {
                content: content.trim(),
                sender: userId,
                timestamp: new Date(),
            },
            lastMessageAt: new Date(),
        });
        // Emit to other participants
        const otherParticipants = conversation.participants.filter((p) => String(p) !== String(userId));
        otherParticipants.forEach((participantId) => {
            index_1.io.to(`user_${participantId}`).emit('new_direct_message', {
                message,
                conversationId,
            });
        });
        res.status(201).json(message);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to send message', error: error?.message });
    }
};
exports.sendMessage = sendMessage;
// Search users to message (all authenticated users)
const searchUsers = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { query } = req.query;
        // Build search criteria
        const searchCriteria = {
            _id: { $ne: userId },
        };
        // If query provided, add name search
        if (query && typeof query === 'string' && query.trim()) {
            searchCriteria.name = { $regex: query.trim(), $options: 'i' };
        }
        // Search for users, excluding self
        const users = await User_1.default.find(searchCriteria)
            .select('name role roles avatar isVerified')
            .limit(50);
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to search users', error: error?.message });
    }
};
exports.searchUsers = searchUsers;
// Get all messaging-eligible users
const getMessagingUsers = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Return all users (excluding self). UI can decide what to show.
        const users = await User_1.default.find({
            _id: { $ne: userId },
        })
            .select('name role roles avatar isVerified')
            .sort({ name: 1 })
            .limit(100);
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error?.message });
    }
};
exports.getMessagingUsers = getMessagingUsers;
// Send attachment message
const sendAttachment = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { conversationId } = req.params;
        // Verify user is in conversation
        const conversation = await Conversation_1.default.findOne({
            _id: conversationId,
            participants: userId,
        });
        if (!conversation) {
            return res.status(403).json({ message: 'You are not part of this conversation' });
        }
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }
        const attachments = files.map((f) => ({
            url: `/uploads/${f.filename}`,
            originalName: f.originalname,
            mimeType: f.mimetype,
            size: f.size,
        }));
        const message = await DirectMessage_1.default.create({
            conversationId: conversationId,
            sender: userId,
            content: (req.body?.content || '').trim() || 'Sent attachments',
            attachments,
            readBy: [userId],
        });
        await message.populate('sender', 'name avatar role');
        // Update conversation
        await Conversation_1.default.findByIdAndUpdate(conversationId, {
            lastMessage: {
                content: 'Sent attachments',
                sender: userId,
                timestamp: new Date(),
            },
            lastMessageAt: new Date(),
        });
        // Emit to other participants
        const otherParticipants = conversation.participants.filter((p) => String(p) !== String(userId));
        otherParticipants.forEach((participantId) => {
            index_1.io.to(`user_${participantId}`).emit('new_direct_message', {
                message,
                conversationId,
            });
        });
        res.status(201).json(message);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to send attachment', error: error?.message });
    }
};
exports.sendAttachment = sendAttachment;
