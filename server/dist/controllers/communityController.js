"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCommunities = exports.getMembers = exports.sendMessage = exports.getMessages = exports.getChannels = exports.getCommunities = void 0;
const Community_1 = __importDefault(require("../models/Community"));
const Channel_1 = __importDefault(require("../models/Channel"));
const CommunityMessage_1 = __importDefault(require("../models/CommunityMessage"));
const User_1 = __importDefault(require("../models/User"));
// Get communities for current user's role
const getCommunities = async (req, res) => {
    try {
        const userRole = req.user?.role || 'founder';
        // Find communities that allow this role
        const communities = await Community_1.default.find({
            allowedRoles: { $in: [userRole] }
        }).sort({ memberCount: -1 });
        res.json(communities);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch communities' });
    }
};
exports.getCommunities = getCommunities;
// Get channels for a community
const getChannels = async (req, res) => {
    try {
        const { communityId } = req.params;
        const channels = await Channel_1.default.find({ communityId }).sort({ createdAt: 1 });
        res.json(channels);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch channels' });
    }
};
exports.getChannels = getChannels;
// Get messages for a channel
const getMessages = async (req, res) => {
    try {
        const { channelId } = req.params;
        const messages = await CommunityMessage_1.default.find({ channelId })
            .populate('userId', 'name role avatar')
            .sort({ createdAt: 1 })
            .limit(50);
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
};
exports.getMessages = getMessages;
// Send message to channel
const sendMessage = async (req, res) => {
    try {
        const { channelId } = req.params;
        const { content, type = 'text' } = req.body;
        const userId = req.user?.id;
        const message = await CommunityMessage_1.default.create({
            channelId,
            userId,
            content,
            type,
            reactions: [],
        });
        await message.populate('userId', 'name role avatar');
        res.status(201).json(message);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to send message' });
    }
};
exports.sendMessage = sendMessage;
// Get community members
const getMembers = async (req, res) => {
    try {
        const { communityId } = req.params;
        // Get users who have posted in this community's channels
        const channelIds = await Channel_1.default.find({ communityId }).distinct('_id');
        const userIds = await CommunityMessage_1.default.find({
            channelId: { $in: channelIds }
        }).distinct('userId');
        const members = await User_1.default.find({
            _id: { $in: userIds }
        }).select('name role avatar isVerified');
        res.json(members);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch members' });
    }
};
exports.getMembers = getMembers;
// Seed default communities (run once)
const seedCommunities = async () => {
    const count = await Community_1.default.countDocuments();
    if (count === 0) {
        await Community_1.default.insertMany([
            {
                name: 'Founder Community',
                icon: '🚀',
                description: 'Exclusive space for verified founders',
                roleExclusive: 'Founders Only',
                memberCount: 587,
                allowedRoles: ['founder'],
            },
            {
                name: 'Expert Community',
                icon: '🎓',
                description: 'Expert advisors and consultants',
                roleExclusive: 'Verified Experts',
                memberCount: 234,
                allowedRoles: ['expert'],
            },
            {
                name: 'Investor Community',
                icon: '💼',
                description: 'Exclusive investor network',
                roleExclusive: 'Verified Investors',
                memberCount: 145,
                allowedRoles: ['investor'],
            },
            {
                name: 'Announcements',
                icon: '📢',
                description: 'Platform-wide announcements and updates',
                memberCount: 1247,
                allowedRoles: ['founder', 'expert', 'investor'],
            },
            {
                name: 'Intros & Networking',
                icon: '🤝',
                description: 'Introduce yourself and network',
                memberCount: 892,
                allowedRoles: ['founder', 'expert', 'investor'],
            },
            {
                name: 'SaaS Founders',
                icon: '💡',
                description: 'Community for SaaS startup founders',
                memberCount: 456,
                allowedRoles: ['founder', 'expert'],
            },
            {
                name: 'HealthTech Founders',
                icon: '🏥',
                description: 'Healthcare technology innovators',
                memberCount: 234,
                allowedRoles: ['founder'],
            },
        ]);
        console.log('Default communities seeded');
    }
};
exports.seedCommunities = seedCommunities;
