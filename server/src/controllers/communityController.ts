import { Request, Response } from 'express';
import Community from '../models/Community';
import Channel from '../models/Channel';
import CommunityMessage from '../models/CommunityMessage';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Get communities for current user's role
export const getCommunities = async (req: AuthRequest, res: Response) => {
  try {
    const userRoles = (req.user?.roles && req.user.roles.length > 0)
      ? req.user.roles
      : [req.user?.role || 'founder'];
    
    // Find communities that allow this role
    const communities = await Community.find({
      allowedRoles: { $in: userRoles as any }
    }).sort({ memberCount: -1 });
    
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch communities' });
  }
};

export const createCommunity = async (req: AuthRequest, res: Response) => {
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

    const community = await Community.create({
      name,
      icon,
      description,
      allowedRoles,
      createdBy: creatorId,
      members: [creatorId],
      memberCount: 1,
    });

    const defaultChannel = await Channel.create({
      communityId: community._id as any,
      name: 'general',
      type: 'text',
      description: 'General discussion',
      readOnly: false,
    });

    res.status(201).json({ community, defaultChannel });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create community', error: error?.message });
  }
};

export const joinCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { communityId } = req.params;
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const userRoles = (req.user?.roles && req.user.roles.length > 0)
      ? req.user.roles
      : [req.user?.role || 'founder'];

    const canJoin = userRoles.some((r: string) => (community.allowedRoles as any[]).includes(r));
    if (!canJoin) {
      return res.status(403).json({ message: 'You are not allowed to join this community' });
    }

    const alreadyMember = (community.members || []).some((m: any) => String(m) === String(userId));
    if (alreadyMember) {
      return res.json({ community });
    }

    community.members = [...(community.members || []), userId] as any;
    community.memberCount = (community.memberCount || 0) + 1;
    await community.save();

    res.json({ community });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to join community', error: error?.message });
  }
};

export const leaveCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { communityId } = req.params;
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const members = (community.members || []) as any[];
    const newMembers = members.filter((m) => String(m) !== String(userId));
    if (newMembers.length === members.length) {
      return res.json({ community });
    }

    community.members = newMembers as any;
    community.memberCount = Math.max(0, (community.memberCount || 0) - 1);
    await community.save();

    res.json({ community });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to leave community', error: error?.message });
  }
};

// Get channels for a community
export const getChannels = async (req: AuthRequest, res: Response) => {
  try {
    const { communityId } = req.params;
    const channels = await Channel.find({ communityId: communityId as any }).sort({ createdAt: 1 });
    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch channels' });
  }
};

// Get messages for a channel
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { channelId } = req.params;
    const messages = await CommunityMessage.find({ channelId: channelId as any })
      .populate('userId', 'name role avatar')
      .populate('sharedPostId')
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
      channelId: channelId as any,
      userId: userId as any,
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

export const sendAttachmentMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { channelId } = req.params;
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
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

    const message = await CommunityMessage.create({
      channelId: channelId as any,
      userId: userId as any,
      type: 'text',
      attachments,
      reactions: [],
    });

    await message.populate('userId', 'name role avatar');
    res.status(201).json(message);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to upload attachments', error: error?.message });
  }
};

export const sharePostToChannel = async (req: AuthRequest, res: Response) => {
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

    const message = await CommunityMessage.create({
      channelId: channelId as any,
      userId: userId as any,
      type: 'shared-post',
      sharedPostId: postId,
      reactions: [],
    });

    await message.populate('userId', 'name role avatar');
    await message.populate('sharedPostId');
    res.status(201).json(message);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to share post', error: error?.message });
  }
};

// Get community members
export const getMembers = async (req: AuthRequest, res: Response) => {
  try {
    const { communityId } = req.params;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const members = await User.find({
      _id: { $in: (community.members || []) as any }
    }).select('name role roles avatar isVerified');
    
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch members' });
  }
};

// Seed default communities (run once)
export const seedCommunities = async () => {
  const count = await Community.countDocuments();
  if (count === 0) {
    const systemUser = await User.findOne({ role: 'admin' }).select('_id');
    if (!systemUser?._id) {
      console.log('Skipping default communities seed: no admin user found');
      return;
    }

    await Community.insertMany([
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
