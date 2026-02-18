import { Response } from 'express';
import Conversation from '../models/Conversation';
import DirectMessage from '../models/DirectMessage';
import User from '../models/User';
import Follow from '../models/Follow';
import Community from '../models/Community';
import CommunityInvite from '../models/CommunityInvite';
import { AuthRequest } from '../middleware/auth';
import { io } from '../index';
import { createNotification } from './notificationController';

// Check if user can message
const canMessageUser = async (fromUserId: string, toUserId: string): Promise<boolean> => {
  if (!fromUserId || !toUserId) return false;
  if (String(fromUserId) === String(toUserId)) return true;
  const row = await Follow.findOne({ follower: fromUserId as any, following: toUserId as any }).select('_id');
  return !!row;
};

export const inviteToCommunityViaMessage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { otherUserId, communityId } = req.body as { otherUserId?: string; communityId?: string };
    if (!otherUserId || !communityId) {
      return res.status(400).json({ message: 'otherUserId and communityId are required' });
    }

    const otherUser = await User.findById(otherUserId).select('_id name role roles');
    if (!otherUser?._id) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allowed = await canMessageUser(String(userId), String(otherUserId));
    if (!allowed) {
      return res.status(403).json({ message: 'Follow this user to message them' });
    }

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const isMember = (community.members || []).some((m: any) => String(m) === String(userId));
    if (!isMember) {
      return res.status(403).json({ message: 'You must be a member to invite others' });
    }

    const alreadyMember = (community.members || []).some((m: any) => String(m) === String(otherUserId));
    if (alreadyMember) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    const inviteeRoles = (otherUser as any).roles?.length ? (otherUser as any).roles : [(otherUser as any).role];
    const canJoin = (inviteeRoles || []).some((r: string) => (community.allowedRoles as any[]).includes(r));
    if (!canJoin) {
      return res.status(400).json({ message: 'Invitee role is not allowed in this community' });
    }

    const invite = await CommunityInvite.findOneAndUpdate(
      { community: communityId as any, invitee: otherUserId as any, inviter: userId as any },
      { community: communityId as any, invitee: otherUserId as any, inviter: userId as any, status: 'pending' },
      { new: true, upsert: true }
    );

    await createNotification(
      String(otherUserId),
      'community',
      'Community invite',
      `You were invited to join ${community.name}.`,
      '/dashboard?tab=communities',
      String(userId),
      { action: 'community_invite', inviteId: String(invite._id), communityId: String(community._id) }
    );

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
      type: 'direct',
    });
    if (!conversation) {
      conversation = await Conversation.create({ participants: [userId, otherUserId], type: 'direct' });
    }

    const dmText = `I invited you to join ${community.name}. Check your notifications to accept.`;
    const message = await DirectMessage.create({
      conversationId: conversation._id as any,
      sender: userId as any,
      content: dmText,
      readBy: [userId],
    });

    await message.populate('sender', 'name avatar role');
    await Conversation.findByIdAndUpdate(conversation._id, {
      lastMessage: { content: dmText, sender: userId as any, timestamp: new Date() },
      lastMessageAt: new Date(),
    });

    io.to(`user_${otherUserId}`).emit('new_direct_message', {
      message,
      conversationId: String(conversation._id),
    });

    await conversation.populate('participants', 'name role roles avatar isVerified');
    res.status(201).json({ invite, conversation, message });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to invite user', error: error?.message });
  }
};

// Get or create conversation between two users
export const getOrCreateConversation = async (req: AuthRequest, res: Response) => {
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
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allowed = await canMessageUser(String(userId), String(otherUserId));
    if (!allowed) {
      return res.status(403).json({ message: 'Follow this user to message them' });
    }

    // Find existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
      type: 'direct',
    });

    // Create new conversation if not exists
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, otherUserId],
        type: 'direct',
      });
    }

    await conversation.populate('participants', 'name role roles avatar isVerified');
    res.json(conversation);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to get/create conversation', error: error?.message });
  }
};

// Get user's conversations
export const getMyConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate('participants', 'name role roles avatar isVerified')
      .populate('lastMessage.sender', 'name avatar')
      .sort({ lastMessageAt: -1, updatedAt: -1 });

    res.json(conversations);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch conversations', error: error?.message });
  }
};

// Get messages in a conversation
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is in conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(403).json({ message: 'You are not part of this conversation' });
    }

    if (conversation.type === 'direct') {
      const otherParticipant = (conversation.participants as any[]).find(
        (p) => String(p) !== String(userId)
      );
      if (otherParticipant) {
        const allowed = await canMessageUser(String(userId), String(otherParticipant));
        if (!allowed) {
          return res.status(403).json({ message: 'Follow this user to message them' });
        }
      }
    }

    const messages = await DirectMessage.find({ conversationId: conversationId as any })
      .populate('sender', 'name avatar role')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    // Mark messages as read
    await DirectMessage.updateMany(
      {
        conversationId: conversationId as any,
        sender: { $ne: userId },
        readBy: { $nin: [userId] },
      },
      { $addToSet: { readBy: userId } }
    );

    res.json(messages.reverse());
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch messages', error: error?.message });
  }
};

// Send a message
export const sendMessage = async (req: AuthRequest, res: Response) => {
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
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(403).json({ message: 'You are not part of this conversation' });
    }

    const message = await DirectMessage.create({
      conversationId: conversationId as any,
      sender: userId as any,
      content: content.trim(),
      readBy: [userId],
    });

    await message.populate('sender', 'name avatar role');

    // Update conversation last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content: content.trim(),
        sender: userId as any,
        timestamp: new Date(),
      },
      lastMessageAt: new Date(),
    });

    // Emit to other participants
    const otherParticipants = conversation.participants.filter(
      (p) => String(p) !== String(userId)
    );

    otherParticipants.forEach((participantId) => {
      io.to(`user_${participantId}`).emit('new_direct_message', {
        message,
        conversationId,
      });
    });

    res.status(201).json(message);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to send message', error: error?.message });
  }
};

// Search users to message (all authenticated users)
export const searchUsers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { query } = req.query;
    
    // Build search criteria
    const searchCriteria: any = {
      _id: { $ne: userId },
    };

    // If query provided, add name search
    if (query && typeof query === 'string' && query.trim()) {
      searchCriteria.name = { $regex: query.trim(), $options: 'i' };
    }

    // Search for users, excluding self
    const users = await User.find(searchCriteria)
      .select('name role roles avatar isVerified')
      .limit(50);

    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to search users', error: error?.message });
  }
};

// Get all messaging-eligible users
export const getMessagingUsers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Return all users (excluding self). UI can decide what to show.
    const users = await User.find({
      _id: { $ne: userId },
    })
      .select('name role roles avatar isVerified')
      .sort({ name: 1 })
      .limit(100);

    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch users', error: error?.message });
  }
};

// Send attachment message
export const sendAttachment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { conversationId } = req.params;

    // Verify user is in conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
    });

    if (!conversation) {
      return res.status(403).json({ message: 'You are not part of this conversation' });
    }

    const files = (req as any).files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const attachments = files.map((f) => ({
      url: `/uploads/${f.filename}`,
      originalName: f.originalname,
      mimeType: f.mimetype,
      size: f.size,
    }));

    const message = await DirectMessage.create({
      conversationId: conversationId as any,
      sender: userId as any,
      content: (req.body?.content || '').trim() || 'Sent attachments',
      attachments,
      readBy: [userId],
    });

    await message.populate('sender', 'name avatar role');

    // Update conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content: 'Sent attachments',
        sender: userId as any,
        timestamp: new Date(),
      },
      lastMessageAt: new Date(),
    });

    // Emit to other participants
    const otherParticipants = conversation.participants.filter(
      (p) => String(p) !== String(userId)
    );

    otherParticipants.forEach((participantId) => {
      io.to(`user_${participantId}`).emit('new_direct_message', {
        message,
        conversationId,
      });
    });

    res.status(201).json(message);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to send attachment', error: error?.message });
  }
};
