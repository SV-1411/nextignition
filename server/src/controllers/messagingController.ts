import { Response } from 'express';
import Conversation from '../models/Conversation';
import DirectMessage from '../models/DirectMessage';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { io } from '../index';

// Allowed roles for direct messaging
// NOTE: Messaging is enabled for any authenticated user. Role gating was removed
// to allow "search for all the people" from the messaging UI.
const MESSAGING_ROLES = ['founder', 'co-founder', 'expert'];

// Check if user can message
const canUseMessaging = (_user: any): boolean => {
  return true;
};

// Get or create conversation between two users
export const getOrCreateConversation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!canUseMessaging(req.user)) {
      return res.status(403).json({ message: 'Messaging is not available for this user' });
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

    // Any authenticated user can receive messages.

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

// Search users to message (only founders, co-founders, experts)
export const searchUsers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Log current user for debugging
    console.log('Search users - current user:', req.user);

    if (!canUseMessaging(req.user)) {
      return res.status(403).json({ message: 'Messaging is not available for this user' });
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

    console.log('Search criteria:', JSON.stringify(searchCriteria, null, 2));

    // Search for users, excluding self
    const users = await User.find(searchCriteria)
      .select('name role roles avatar isVerified')
      .limit(50);

    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (error: any) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Failed to search users', error: error?.message });
  }
};

// Get all messaging-eligible users (for "start conversation" list)
export const getMessagingUsers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!canUseMessaging(req.user)) {
      return res.status(403).json({ message: 'Messaging is not available for this user' });
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
    console.error('getMessagingUsers error:', error);
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
