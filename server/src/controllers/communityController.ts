import { Request, Response } from 'express';
import Community from '../models/Community';
import Channel from '../models/Channel';
import CommunityMessage from '../models/CommunityMessage';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Get communities for current user's role
export const getCommunities = async (req: AuthRequest, res: Response) => {
  try {
    const userRole = req.user?.role || 'founder';
    
    // Find communities that allow this role
    const communities = await Community.find({
      allowedRoles: { $in: [userRole] }
    }).sort({ memberCount: -1 });
    
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch communities' });
  }
};

// Get channels for a community
export const getChannels = async (req: AuthRequest, res: Response) => {
  try {
    const { communityId } = req.params;
    const channels = await Channel.find({ communityId }).sort({ createdAt: 1 });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch channels' });
  }
};

// Get messages for a channel
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { channelId } = req.params;
    const messages = await CommunityMessage.find({ channelId })
      .populate('userId', 'name role avatar')
      .sort({ createdAt: 1 })
      .limit(50);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// Send message to channel
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { channelId } = req.params;
    const { content, type = 'text' } = req.body;
    const userId = req.user?.id;
    
    const message = await CommunityMessage.create({
      channelId,
      userId,
      content,
      type,
      reactions: [],
    });
    
    await message.populate('userId', 'name role avatar');
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message' });
  }
};

// Get community members
export const getMembers = async (req: AuthRequest, res: Response) => {
  try {
    const { communityId } = req.params;
    
    // Get users who have posted in this community's channels
    const channelIds = await Channel.find({ communityId }).distinct('_id');
    const userIds = await CommunityMessage.find({ 
      channelId: { $in: channelIds } 
    }).distinct('userId');
    
    const members = await User.find({
      _id: { $in: userIds }
    }).select('name role avatar isVerified');
    
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch members' });
  }
};

// Seed default communities (run once)
export const seedCommunities = async () => {
  const count = await Community.countDocuments();
  if (count === 0) {
    await Community.insertMany([
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
