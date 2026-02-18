"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCommunities = exports.getMembers = exports.sharePostToChannel = exports.sendAttachmentMessage = exports.sendMessage = exports.getMessages = exports.getChannels = exports.leaveCommunity = exports.joinCommunity = exports.createCommunity = exports.respondToCommunityInvite = exports.sendCommunityInvite = exports.getCommunities = void 0;
const Community_1 = __importDefault(require("../models/Community"));
const Channel_1 = __importDefault(require("../models/Channel"));
const CommunityMessage_1 = __importDefault(require("../models/CommunityMessage"));
const CommunityInvite_1 = __importDefault(require("../models/CommunityInvite"));
const User_1 = __importDefault(require("../models/User"));
const notificationController_1 = require("./notificationController");
// Get communities for current user's role
const getCommunities = async (req, res) => {
    try {
        const userRoles = (req.user?.roles && req.user.roles.length > 0)
            ? req.user.roles
            : [req.user?.role || 'founder'];
        // Find communities that allow this role
        const communities = await Community_1.default.find({
            allowedRoles: { $in: userRoles }
        }).sort({ memberCount: -1 });
        res.json(communities);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch communities' });
    }
};
exports.getCommunities = getCommunities;
const sendCommunityInvite = async (req, res) => {
    try {
        const inviterId = req.user?.id;
        if (!inviterId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { communityId } = req.params;
        const { inviteeUserId } = req.body;
        if (!inviteeUserId) {
            return res.status(400).json({ message: 'inviteeUserId is required' });
        }
        const community = await Community_1.default.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        const isMember = (community.members || []).some((m) => String(m) === String(inviterId));
        if (!isMember) {
            return res.status(403).json({ message: 'You must be a member to invite others' });
        }
        const inviteeUser = await User_1.default.findById(inviteeUserId).select('_id name role roles');
        if (!inviteeUser?._id) {
            return res.status(404).json({ message: 'Invitee user not found' });
        }
        const inviteeRoles = inviteeUser.roles?.length ? inviteeUser.roles : [inviteeUser.role];
        const canJoin = (inviteeRoles || []).some((r) => community.allowedRoles.includes(r));
        if (!canJoin) {
            return res.status(400).json({ message: 'Invitee role is not allowed in this community' });
        }
        const alreadyMember2 = (community.members || []).some((m) => String(m) === String(inviteeUserId));
        if (alreadyMember2) {
            return res.status(400).json({ message: 'User is already a member' });
        }
        const invite = await CommunityInvite_1.default.findOneAndUpdate({ community: communityId, invitee: inviteeUserId, inviter: inviterId }, { community: communityId, invitee: inviteeUserId, inviter: inviterId, status: 'pending' }, { new: true, upsert: true });
        await (0, notificationController_1.createNotification)(String(inviteeUserId), 'community', 'Community invite', `You were invited to join ${community.name}.`, '/dashboard?tab=communities', String(inviterId), { action: 'community_invite', inviteId: String(invite._id), communityId: String(community._id) });
        res.status(201).json({ invite });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to send invite', error: error?.message });
    }
};
exports.sendCommunityInvite = sendCommunityInvite;
const respondToCommunityInvite = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { inviteId } = req.params;
        const { action } = req.body;
        if (action !== 'accept' && action !== 'decline') {
            return res.status(400).json({ message: 'action must be accept or decline' });
        }
        const invite = await CommunityInvite_1.default.findById(inviteId);
        if (!invite) {
            return res.status(404).json({ message: 'Invite not found' });
        }
        if (String(invite.invitee) !== String(userId)) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (invite.status !== 'pending') {
            return res.status(400).json({ message: 'Invite already responded' });
        }
        const community = await Community_1.default.findById(invite.community);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        if (action === 'decline') {
            invite.status = 'declined';
            await invite.save();
            return res.json({ invite });
        }
        const userRoles = (req.user?.roles && req.user.roles.length > 0)
            ? req.user.roles
            : [req.user?.role || 'founder'];
        const canJoin = userRoles.some((r) => community.allowedRoles.includes(r));
        if (!canJoin) {
            return res.status(403).json({ message: 'You are not allowed to join this community' });
        }
        const alreadyMember = (community.members || []).some((m) => String(m) === String(userId));
        if (!alreadyMember) {
            community.members = [...(community.members || []), userId];
            community.memberCount = (community.memberCount || 0) + 1;
            await community.save();
        }
        invite.status = 'accepted';
        await invite.save();
        await (0, notificationController_1.createNotification)(String(invite.inviter), 'community', 'Invite accepted', `Your community invite was accepted for ${community.name}.`, '/dashboard?tab=communities', String(userId), { action: 'community_invite_accepted', inviteId: String(invite._id), communityId: String(community._id) });
        res.json({ invite, community });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to respond to invite', error: error?.message });
    }
};
exports.respondToCommunityInvite = respondToCommunityInvite;
const createCommunity = async (req, res) => {
    try {
        const creatorId = req.user?.id;
        if (!creatorId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const creatorRoles = (req.user?.roles && req.user.roles.length > 0)
            ? req.user.roles
            : [req.user?.role || 'founder'];
        if (!creatorRoles.includes('expert')) {
            return res.status(403).json({ message: 'Only experts can create communities' });
        }
        const { name, icon, description, allowedRoles } = req.body;
        if (!name || !icon || !description || !Array.isArray(allowedRoles) || allowedRoles.length === 0) {
            return res.status(400).json({ message: 'name, icon, description, and allowedRoles are required' });
        }
        const community = await Community_1.default.create({
            name,
            icon,
            description,
            allowedRoles,
            createdBy: creatorId,
            members: [creatorId],
            memberCount: 1,
        });
        const defaultChannel = await Channel_1.default.create({
            communityId: community._id,
            name: 'general',
            type: 'text',
            description: 'General discussion',
            readOnly: false,
        });
        res.status(201).json({ community, defaultChannel });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create community', error: error?.message });
    }
};
exports.createCommunity = createCommunity;
const joinCommunity = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { communityId } = req.params;
        const community = await Community_1.default.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        const userRoles = (req.user?.roles && req.user.roles.length > 0)
            ? req.user.roles
            : [req.user?.role || 'founder'];
        const canJoin = userRoles.some((r) => community.allowedRoles.includes(r));
        if (!canJoin) {
            return res.status(403).json({ message: 'You are not allowed to join this community' });
        }
        const alreadyMember = (community.members || []).some((m) => String(m) === String(userId));
        if (alreadyMember) {
            return res.json({ community });
        }
        community.members = [...(community.members || []), userId];
        community.memberCount = (community.memberCount || 0) + 1;
        await community.save();
        res.json({ community });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to join community', error: error?.message });
    }
};
exports.joinCommunity = joinCommunity;
const leaveCommunity = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { communityId } = req.params;
        const community = await Community_1.default.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        const members = (community.members || []);
        const newMembers = members.filter((m) => String(m) !== String(userId));
        if (newMembers.length === members.length) {
            return res.json({ community });
        }
        community.members = newMembers;
        community.memberCount = Math.max(0, (community.memberCount || 0) - 1);
        await community.save();
        res.json({ community });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to leave community', error: error?.message });
    }
};
exports.leaveCommunity = leaveCommunity;
// Get channels for a community
const getChannels = async (req, res) => {
    try {
        const { communityId } = req.params;
        const channels = await Channel_1.default.find({ communityId: communityId }).sort({ createdAt: 1 });
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
        const messages = await CommunityMessage_1.default.find({ channelId: channelId })
            .populate('userId', 'name role avatar')
            .populate('sharedPostId')
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
            channelId: channelId,
            userId: userId,
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
const sendAttachmentMessage = async (req, res) => {
    try {
        const { channelId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
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
        const message = await CommunityMessage_1.default.create({
            channelId: channelId,
            userId: userId,
            type: 'text',
            attachments,
            reactions: [],
        });
        await message.populate('userId', 'name role avatar');
        res.status(201).json(message);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to upload attachments', error: error?.message });
    }
};
exports.sendAttachmentMessage = sendAttachmentMessage;
const sharePostToChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { postId, content } = req.body;
        if (!postId) {
            return res.status(400).json({ message: 'postId is required' });
        }
        const message = await CommunityMessage_1.default.create({
            channelId: channelId,
            userId: userId,
            type: 'shared-post',
            sharedPostId: postId,
            reactions: [],
        });
        await message.populate('userId', 'name role avatar');
        await message.populate('sharedPostId');
        res.status(201).json(message);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to share post', error: error?.message });
    }
};
exports.sharePostToChannel = sharePostToChannel;
// Get community members
const getMembers = async (req, res) => {
    try {
        const { communityId } = req.params;
        const community = await Community_1.default.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }
        const members = await User_1.default.find({
            _id: { $in: (community.members || []) }
        }).select('name role roles avatar isVerified');
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
        const systemUser = await User_1.default.findOne({ role: 'admin' }).select('_id');
        if (!systemUser?._id) {
            console.log('Skipping default communities seed: no admin user found');
            return;
        }
        await Community_1.default.insertMany([
            {
                name: 'Founder Community',
                icon: '🚀',
                description: 'Exclusive space for verified founders',
                roleExclusive: 'Founders Only',
                memberCount: 0,
                allowedRoles: ['founder'],
                createdBy: systemUser._id,
                members: [],
            },
            {
                name: 'Expert Community',
                icon: '🎓',
                description: 'Expert advisors and consultants',
                roleExclusive: 'Verified Experts',
                memberCount: 0,
                allowedRoles: ['expert'],
                createdBy: systemUser._id,
                members: [],
            },
            {
                name: 'Investor Community',
                icon: '💼',
                description: 'Exclusive investor network',
                roleExclusive: 'Verified Investors',
                memberCount: 0,
                allowedRoles: ['investor'],
                createdBy: systemUser._id,
                members: [],
            },
            {
                name: 'Announcements',
                icon: '📢',
                description: 'Platform-wide announcements and updates',
                memberCount: 0,
                allowedRoles: ['founder', 'expert', 'investor'],
                createdBy: systemUser._id,
                members: [],
            },
            {
                name: 'Intros & Networking',
                icon: '🤝',
                description: 'Introduce yourself and network',
                memberCount: 0,
                allowedRoles: ['founder', 'expert', 'investor'],
                createdBy: systemUser._id,
                members: [],
            },
            {
                name: 'SaaS Founders',
                icon: '💡',
                description: 'Community for SaaS startup founders',
                memberCount: 0,
                allowedRoles: ['founder', 'expert'],
                createdBy: systemUser._id,
                members: [],
            },
            {
                name: 'HealthTech Founders',
                icon: '🏥',
                description: 'Healthcare technology innovators',
                memberCount: 0,
                allowedRoles: ['founder'],
                createdBy: systemUser._id,
                members: [],
            },
        ]);
        console.log('Default communities seeded');
    }
};
exports.seedCommunities = seedCommunities;
