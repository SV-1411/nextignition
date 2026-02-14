import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Message from '../models/Message';
import Conversation from '../models/Conversation';

// Send a message
export const sendMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { receiverId, content, type, fileUrl } = req.body;
        const senderId = req.user.id;

        // Check if conversation already exists between these two users
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
            type: 'direct',
        });

        // If not, create a new conversation
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                type: 'direct',
            });
        }

        // Create the message
        const message = await Message.create({
            conversationId: conversation._id,
            sender: senderId,
            receiver: receiverId,
            content,
            type: type || 'text',
            fileUrl,
        });

        // Update conversation with last message and unread count
        const unreadKey = `unreadCount.${receiverId}`;
        await Conversation.findByIdAndUpdate(conversation._id, {
            lastMessage: {
                content: type === 'image' ? 'Sent an image' : type === 'file' ? 'Sent a file' : content,
                sender: senderId,
                timestamp: new Date(),
            },
            $inc: { [unreadKey]: 1 },
        });

        // TODO: Emit socket event for real-time update

        const populatedMessage = await message.populate('sender', 'name avatar');
        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Message sending failed' });
    }
};

// Get all conversations for the current user
export const getConversations = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const conversations = await Conversation.find({
            participants: userId,
        })
            .populate('participants', 'name avatar role isVerified')
            .sort({ updatedAt: -1 });

        res.json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch conversations' });
    }
};

// Get messages for a specific conversation
export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId })
            .populate('sender', 'name avatar')
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
};

// Mark conversation as read
export const markAsRead = async (req: AuthRequest, res: Response) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.id;

        // Reset unread count for this user in the conversation
        const unreadKey = `unreadCount.${userId}`;
        await Conversation.findByIdAndUpdate(conversationId, {
            $set: { [unreadKey]: 0 },
        });

        // Mark all messages in this conversation received by this user as read
        await Message.updateMany(
            { conversationId, receiver: userId, isRead: false },
            { $set: { isRead: true } }
        );

        res.json({ message: 'Marked as read' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to mark as read' });
    }
};
