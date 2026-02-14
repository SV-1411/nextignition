import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Hash,
  Volume2,
  Users,
  Search,
  Bell,
  BellOff,
  Pin,
  Settings,
  Plus,
  Smile,
  Paperclip,
  Send,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Star,
  Flag,
  Bookmark,
  Calendar,
  Image as ImageIcon,
  FileText,
  Link2,
  Bold,
  Italic,
  Code,
  Lock,
  Crown,
  Rocket,
  Handshake,
  Trophy,
  ThumbsUp,
  Heart,
  Sparkles,
  ArrowLeft,
  X,
  Check,
  TrendingUp,
  DollarSign,
  Award,
  Target,
  Briefcase,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { brandColors } from '../utils/colors';

interface CommunitiesPageProps {
  userRole: 'founder' | 'expert' | 'investor';
  userId: number;
}

interface Community {
  id: number;
  name: string;
  icon: string;
  roleExclusive?: string;
  unreadCount?: number;
  memberCount: number;
  description: string;
}

interface Channel {
  id: number;
  name: string;
  type: 'text' | 'voice';
  icon?: string;
  description: string;
  readOnly?: boolean;
  unreadCount?: number;
}

interface Message {
  id: number;
  userId: number;
  userName: string;
  userRole: string;
  avatar: string;
  content: string;
  timestamp: string;
  reactions?: { emoji: string; count: number; users: number[] }[];
  type?: 'system' | 'milestone' | 'poll' | 'shared-post';
  threadCount?: number;
  pinned?: boolean;
  pollOptions?: { text: string; votes: number }[];
  milestoneData?: { title: string; description: string };
}

interface Member {
  id: number;
  name: string;
  role: string;
  avatar: string;
  online: boolean;
  badge?: 'moderator' | 'founder' | 'expert' | 'investor';
}

export function CommunitiesPage({ userRole, userId }: CommunitiesPageProps) {
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showMemberList, setShowMemberList] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [mobileView, setMobileView] = useState<'communities' | 'channels' | 'chat'>('communities');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['text-channels']);

  // Role-specific communities
  const getCommunitiesForRole = (): Community[] => {
    const commonCommunities: Community[] = [
      {
        id: 100,
        name: 'Announcements',
        icon: '📢',
        memberCount: 1247,
        description: 'Platform-wide announcements and updates'
      },
      {
        id: 101,
        name: 'Intros & Networking',
        icon: '🤝',
        memberCount: 892,
        description: 'Introduce yourself and network'
      },
      {
        id: 102,
        name: 'SaaS Founders',
        icon: '💡',
        memberCount: 456,
        description: 'Community for SaaS startup founders'
      },
      {
        id: 103,
        name: 'HealthTech Founders',
        icon: '🏥',
        memberCount: 234,
        description: 'Healthcare technology innovators'
      }
    ];

    if (userRole === 'founder') {
      return [
        {
          id: 1,
          name: 'Founder Community',
          icon: '🚀',
          roleExclusive: 'Founders Only',
          unreadCount: 12,
          memberCount: 587,
          description: 'Exclusive space for verified founders'
        },
        {
          id: 2,
          name: 'Early Stage',
          icon: '🌱',
          memberCount: 342,
          description: 'Idea to MVP stage founders'
        },
        {
          id: 3,
          name: 'Growth Stage',
          icon: '📈',
          memberCount: 189,
          description: 'Scaling and growth discussions'
        },
        ...commonCommunities
      ];
    } else if (userRole === 'expert') {
      return [
        {
          id: 4,
          name: 'Expert Community',
          icon: '🎓',
          roleExclusive: 'Verified Experts',
          unreadCount: 8,
          memberCount: 234,
          description: 'Expert advisors and consultants'
        },
        {
          id: 5,
          name: 'SaaS Experts',
          icon: '🚀',
          memberCount: 156,
          description: 'SaaS industry experts'
        },
        {
          id: 6,
          name: 'Marketing Experts',
          icon: '💡',
          memberCount: 198,
          description: 'Marketing and growth specialists'
        },
        ...commonCommunities
      ];
    } else {
      return [
        {
          id: 7,
          name: 'Investor Community',
          icon: '💼',
          roleExclusive: 'Verified Investors',
          unreadCount: 5,
          memberCount: 145,
          description: 'Exclusive investor network'
        },
        {
          id: 8,
          name: 'FinTech Investors',
          icon: '💰',
          memberCount: 89,
          description: 'Financial technology investors'
        },
        {
          id: 9,
          name: 'DeepTech Investors',
          icon: '🔬',
          memberCount: 67,
          description: 'Deep technology and research'
        },
        ...commonCommunities
      ];
    }
  };

  // Role-specific channels
  const getChannelsForCommunity = (communityId: number): Channel[] => {
    if (userRole === 'founder' && communityId === 1) {
      return [
        { id: 1, name: 'announcements', type: 'text', icon: '📢', description: 'Important updates', readOnly: true },
        { id: 2, name: 'introductions', type: 'text', icon: '👋', description: 'Introduce yourself', unreadCount: 3 },
        { id: 3, name: 'general-chat', type: 'text', icon: '💬', description: 'General discussions', unreadCount: 12 },
        { id: 4, name: 'ask-founders', type: 'text', icon: '🤔', description: 'Ask other founders', unreadCount: 5 },
        { id: 5, name: 'product-feedback', type: 'text', icon: '🎯', description: 'Get product feedback' },
        { id: 6, name: 'co-founder-search', type: 'text', icon: '💼', description: 'Find your co-founder' },
        { id: 7, name: 'fundraising-tips', type: 'text', icon: '💰', description: 'Fundraising strategies' },
        { id: 8, name: 'growth-hacks', type: 'text', icon: '📊', description: 'Growth and marketing' },
        { id: 9, name: 'tech-stack', type: 'text', icon: '🛠️', description: 'Technical discussions' },
        { id: 10, name: 'wins-milestones', type: 'text', icon: '🎉', description: 'Celebrate wins' },
      ];
    } else if (userRole === 'expert' && communityId === 4) {
      return [
        { id: 11, name: 'expert-lounge', type: 'text', icon: '🧠', description: 'Expert discussions' },
        { id: 12, name: 'client-management', type: 'text', icon: '💼', description: 'Managing clients' },
        { id: 13, name: 'pricing-strategies', type: 'text', icon: '💰', description: 'Pricing your services' },
        { id: 14, name: 'resource-sharing', type: 'text', icon: '📚', description: 'Share resources' },
        { id: 15, name: 'speaker-opportunities', type: 'text', icon: '🎤', description: 'Speaking gigs' },
        { id: 16, name: 'success-stories', type: 'text', icon: '⭐', description: 'Client success stories' },
      ];
    } else if (userRole === 'investor' && communityId === 7) {
      return [
        { id: 17, name: 'co-investment-opps', type: 'text', icon: '🤝', description: 'Deal sharing', unreadCount: 2 },
        { id: 18, name: 'market-trends', type: 'text', icon: '📊', description: 'Market analysis' },
        { id: 19, name: 'legal-compliance', type: 'text', icon: '⚖️', description: 'Legal discussions' },
        { id: 20, name: 'deal-flow-discussion', type: 'text', icon: '🎯', description: 'Deal flow strategies' },
        { id: 21, name: 'portfolio-help', type: 'text', icon: '��', description: 'Support portfolio companies' },
        { id: 22, name: 'global-expansion', type: 'text', icon: '🌐', description: 'International opportunities' },
      ];
    }
    
    // Default channels for other communities
    return [
      { id: 101, name: 'general', type: 'text', icon: '💬', description: 'General discussions', unreadCount: 8 },
      { id: 102, name: 'introductions', type: 'text', icon: '👋', description: 'Introduce yourself' },
      { id: 103, name: 'resources', type: 'text', icon: '📚', description: 'Helpful resources' },
    ];
  };

  // Mock messages
  const mockMessages: Message[] = [
    {
      id: 1,
      userId: 101,
      userName: 'Sarah Chen',
      userRole: 'Founder at TechFlow AI',
      avatar: '👩',
      content: 'Hey everyone! Just launched our beta. Would love feedback from the community! 🚀',
      timestamp: '2h ago',
      reactions: [
        { emoji: '👍', count: 12, users: [1, 2, 3] },
        { emoji: '🚀', count: 8, users: [4, 5] },
        { emoji: '🎉', count: 5, users: [6, 7] }
      ],
      threadCount: 4
    },
    {
      id: 2,
      userId: 102,
      userName: 'Mike Rodriguez',
      userRole: 'Growth Expert',
      avatar: '👨',
      content: '@Sarah Chen Congrats! I\'d be happy to take a look and provide some growth feedback. DM me!',
      timestamp: '1h ago',
      reactions: [
        { emoji: '💯', count: 3, users: [1, 2] }
      ]
    },
    {
      id: 3,
      userId: 103,
      userName: 'Emma Williams',
      userRole: 'Investor at Venture Partners',
      avatar: '👩‍💼',
      content: 'This is exactly the kind of innovation we\'re looking for in HealthTech. Let\'s connect!',
      timestamp: '45m ago',
      reactions: [
        { emoji: '🔥', count: 6, users: [1, 2, 3] }
      ]
    },
    {
      id: 4,
      userId: 104,
      userName: 'System',
      userRole: 'Platform',
      avatar: '🤖',
      content: 'David Park joined the community',
      timestamp: '30m ago',
      type: 'system'
    },
    {
      id: 5,
      userId: 105,
      userName: 'Lisa Zhang',
      userRole: 'Founder at HealthAI',
      avatar: '👩‍⚕️',
      content: '🏆 **MILESTONE ACHIEVED** 🏆\n\nJust hit $100K ARR! Thank you to everyone in this community for the support and advice along the way!',
      timestamp: '15m ago',
      type: 'milestone',
      milestoneData: {
        title: '$100K ARR Achieved',
        description: 'First major revenue milestone'
      },
      reactions: [
        { emoji: '🎉', count: 24, users: [1, 2, 3, 4, 5] },
        { emoji: '👏', count: 18, users: [6, 7, 8] },
        { emoji: '🚀', count: 15, users: [9, 10] }
      ],
      threadCount: 12
    },
    {
      id: 6,
      userId: 106,
      userName: 'Alex Martinez',
      userRole: 'CTO Advisor',
      avatar: '👨‍💻',
      content: '**Quick Poll:** What\'s your biggest challenge right now?',
      timestamp: '10m ago',
      type: 'poll',
      pollOptions: [
        { text: 'Finding product-market fit', votes: 42 },
        { text: 'Hiring the right team', votes: 38 },
        { text: 'Raising capital', votes: 56 },
        { text: 'Scaling infrastructure', votes: 24 }
      ]
    },
    {
      id: 7,
      userId: 107,
      userName: 'Jordan Kim',
      userRole: 'Founder at CloudScale',
      avatar: '🧑',
      content: 'For anyone struggling with AWS costs, here\'s a thread on how we reduced our bill by 60%: https://community.nextignition.com/threads/aws-cost-optimization',
      timestamp: '5m ago',
      reactions: [
        { emoji: '🙏', count: 8, users: [1, 2] },
        { emoji: '💡', count: 6, users: [3, 4] }
      ]
    }
  ];

  // Mock members
  const mockMembers: Member[] = [
    { id: 1, name: 'Sarah Chen', role: 'Founder at TechFlow', avatar: '👩', online: true, badge: 'founder' },
    { id: 2, name: 'Mike Rodriguez', role: 'Growth Expert', avatar: '👨', online: true, badge: 'expert' },
    { id: 3, name: 'Emma Williams', role: 'Investor', avatar: '👩‍💼', online: true, badge: 'investor' },
    { id: 4, name: 'David Park', role: 'Founder', avatar: '👨‍💼', online: true, badge: 'founder' },
    { id: 5, name: 'Lisa Zhang', role: 'Founder', avatar: '👩‍⚕️', online: true, badge: 'founder' },
    { id: 6, name: 'Alex Martinez', role: 'CTO Advisor', avatar: '👨‍💻', online: true, badge: 'moderator' },
    { id: 7, name: 'Jordan Kim', role: 'Founder', avatar: '🧑', online: true, badge: 'founder' },
    { id: 8, name: 'Taylor Swift', role: 'Marketing Expert', avatar: '👩‍🎤', online: false, badge: 'expert' },
  ];

  const communities = getCommunitiesForRole();
  const channels = selectedCommunity ? getChannelsForCommunity(selectedCommunity.id) : [];

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case 'moderator':
        return <Crown className="w-3 h-3 text-yellow-500" />;
      case 'founder':
        return <Rocket className="w-3 h-3 text-blue-500" />;
      case 'expert':
        return <Award className="w-3 h-3 text-purple-500" />;
      case 'investor':
        return <Briefcase className="w-3 h-3 text-green-500" />;
      default:
        return null;
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const onlineMemberCount = mockMembers.filter(m => m.online).length;

  // Mobile Communities List View
  const MobileCommunitiesList = () => (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold">Communities</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {communities.map((community) => (
          <motion.div
            key={community.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedCommunity(community);
              setMobileView('channels');
            }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 active:bg-gray-50"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{community.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold truncate">{community.name}</h3>
                  {community.unreadCount && (
                    <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      {community.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-1">{community.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Users className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{community.memberCount} members</span>
                  {community.roleExclusive && (
                    <span className="ml-auto px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {community.roleExclusive}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Mobile Channels List View
  const MobileChannelsList = () => (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileView('communities')}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedCommunity?.icon}</span>
              <h1 className="text-lg font-bold">{selectedCommunity?.name}</h1>
            </div>
          </div>
          <button>
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-xs font-bold text-gray-500 uppercase mb-2">Text Channels</div>
        {channels.filter(c => c.type === 'text').map((channel) => (
          <motion.div
            key={channel.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedChannel(channel);
              setMobileView('chat');
            }}
            className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 active:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{channel.name}</span>
                  {channel.unreadCount && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                      {channel.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{channel.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Mobile Chat View
  const MobileChatView = () => (
    <div className="h-full bg-white flex flex-col">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileView('channels')}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-gray-500" />
              <h1 className="font-bold">{selectedChannel?.name}</h1>
            </div>
            <p className="text-xs text-gray-500">{onlineMemberCount} online · {mockMembers.length} members</p>
          </div>
          <button onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <BellOff className="w-5 h-5 text-gray-400" /> : <Bell className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockMessages.map((message) => (
          <MessageComponent key={message.id} message={message} isMobile />
        ))}
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 border-t border-gray-200 bg-white lg:relative lg:bottom-auto z-30 pt-[12px] pr-[12px] pb-[28px] pl-[12px] mx-[0px] my-[12px]">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={`Message #${selectedChannel?.name || 'channel'}`}
              className="w-full px-4 py-3 pr-20 bg-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button className="p-1.5 hover:bg-gray-200 rounded">
                <Smile className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded">
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            className="p-3 rounded-lg text-white"
            style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // Message Component
  const MessageComponent = ({ message, isMobile = false }: { message: Message; isMobile?: boolean }) => {
    if (message.type === 'system') {
      return (
        <div className="text-center text-sm text-gray-500 italic py-2">
          {message.content}
        </div>
      );
    }

    if (message.type === 'milestone') {
      return (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 shadow-lg"
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl">{message.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="font-bold">{message.userName}</span>
                <span className="text-xs text-gray-500">{message.timestamp}</span>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="font-medium text-lg mb-1">{message.milestoneData?.title}</p>
                <p className="text-gray-700">{message.content}</p>
              </div>
              {message.reactions && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {message.reactions.map((reaction, idx) => (
                    <button
                      key={idx}
                      className="flex items-center gap-1 px-2 py-1 bg-white border border-yellow-300 rounded-full hover:bg-yellow-50 transition-colors"
                    >
                      <span>{reaction.emoji}</span>
                      <span className="text-xs font-medium">{reaction.count}</span>
                    </button>
                  ))}
                  <button className="p-1 hover:bg-white rounded-full transition-colors">
                    <Plus className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      );
    }

    if (message.type === 'poll') {
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="text-2xl">{message.avatar}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm">{message.userName}</span>
                <span className="text-xs text-gray-500">{message.timestamp}</span>
              </div>
              <p className="text-sm text-gray-600">{message.userRole}</p>
            </div>
          </div>
          <p className="mb-3 font-medium">{message.content}</p>
          <div className="space-y-2">
            {message.pollOptions?.map((option, idx) => {
              const totalVotes = message.pollOptions?.reduce((sum, opt) => sum + opt.votes, 0) || 0;
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              return (
                <button
                  key={idx}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-400 transition-all relative overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-blue-50 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="relative flex items-center justify-between">
                    <span className="text-sm font-medium">{option.text}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{option.votes}</span>
                      <span className="text-xs text-gray-500">{percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className={`group hover:bg-gray-50 ${isMobile ? 'p-2' : 'px-4 py-2'} rounded transition-colors`}>
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0">{message.avatar}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-sm">{message.userName}</span>
              <span className="text-xs text-gray-500">{message.timestamp}</span>
              {message.pinned && <Pin className="w-3 h-3 text-yellow-600" />}
            </div>
            <p className="text-xs text-gray-600 mb-2">{message.userRole}</p>
            <p className="text-sm text-gray-900 break-words">{message.content}</p>
            
            {message.reactions && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {message.reactions.map((reaction, idx) => (
                  <button
                    key={idx}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <span className="text-sm">{reaction.emoji}</span>
                    <span className="text-xs font-medium text-gray-700">{reaction.count}</span>
                  </button>
                ))}
                <button className="p-1 hover:bg-gray-200 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                  <Plus className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            )}

            {message.threadCount && (
              <button className="flex items-center gap-2 mt-2 text-xs text-blue-600 hover:underline">
                <MessageSquare className="w-3 h-3" />
                {message.threadCount} {message.threadCount === 1 ? 'reply' : 'replies'}
              </button>
            )}
          </div>

          {/* Hover actions - desktop only */}
          {!isMobile && (
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
              <button className="p-1.5 hover:bg-gray-200 rounded" title="React">
                <Smile className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded" title="Reply in thread">
                <MessageSquare className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded" title="Bookmark">
                <Bookmark className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded" title="More">
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden h-screen bg-gray-50">
        {mobileView === 'communities' && <MobileCommunitiesList />}
        {mobileView === 'channels' && <MobileChannelsList />}
        {mobileView === 'chat' && <MobileChatView />}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:flex h-screen bg-white">
        {/* Community/Channel Sidebar */}
        <aside className="w-60 bg-gray-900 text-gray-100 flex flex-col">
          {/* Community Header */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-gray-800 shadow-sm">
            <h2 className="font-bold text-white truncate">
              {selectedCommunity ? (
                <span className="flex items-center gap-2">
                  <span>{selectedCommunity.icon}</span>
                  <span className="truncate">{selectedCommunity.name}</span>
                </span>
              ) : (
                'Communities'
              )}
            </h2>
            <button className="p-1 hover:bg-gray-800 rounded">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Show communities if none selected, otherwise show channels */}
          <div className="flex-1 overflow-y-auto">
            {!selectedCommunity ? (
              <div className="p-2">
                <div className="text-xs font-bold text-gray-400 uppercase px-2 py-2">Your Communities</div>
                {communities.map((community) => (
                  <button
                    key={community.id}
                    onClick={() => setSelectedCommunity(community)}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-800 transition-colors text-left group"
                  >
                    <span className="text-2xl">{community.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate">{community.name}</span>
                        {community.unreadCount && (
                          <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                            {community.unreadCount}
                          </span>
                        )}
                      </div>
                      {community.roleExclusive && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Lock className="w-2.5 h-2.5 text-gray-400" />
                          <span className="text-xs text-gray-400">{community.roleExclusive}</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-2">
                <button
                  onClick={() => {
                    setSelectedCommunity(null);
                    setSelectedChannel(null);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-2 mb-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Communities</span>
                </button>

                {/* Text Channels */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleCategory('text-channels')}
                    className="w-full flex items-center gap-1 px-2 py-1 text-xs font-bold text-gray-400 uppercase hover:text-gray-300 transition-colors"
                  >
                    {expandedCategories.includes('text-channels') ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                    Text Channels
                  </button>
                  {expandedCategories.includes('text-channels') && (
                    <div className="mt-1">
                      {channels.filter(c => c.type === 'text').map((channel) => (
                        <button
                          key={channel.id}
                          onClick={() => setSelectedChannel(channel)}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors group ${
                            selectedChannel?.id === channel.id
                              ? 'bg-gray-700 text-white'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                          }`}
                        >
                          <Hash className="w-4 h-4 flex-shrink-0" />
                          <span className="flex-1 text-sm font-medium truncate text-left">{channel.name}</span>
                          {channel.unreadCount && (
                            <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                              {channel.unreadCount}
                            </span>
                          )}
                          {channel.readOnly && <Lock className="w-3 h-3" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Voice Channels */}
                <div>
                  <button
                    onClick={() => toggleCategory('voice-channels')}
                    className="w-full flex items-center gap-1 px-2 py-1 text-xs font-bold text-gray-400 uppercase hover:text-gray-300 transition-colors"
                  >
                    {expandedCategories.includes('voice-channels') ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                    Voice Channels
                  </button>
                  {expandedCategories.includes('voice-channels') && (
                    <div className="mt-1">
                      <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-colors">
                        <Volume2 className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 text-sm font-medium truncate text-left">Casual Hangout</span>
                      </button>
                      <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-colors">
                        <Volume2 className="w-4 h-4 flex-shrink-0" />
                        <span className="flex-1 text-sm font-medium truncate text-left">Office Hours</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChannel ? (
            <>
              {/* Channel Header */}
              <header className="h-14 px-4 flex items-center justify-between border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-gray-500" />
                  <div>
                    <h2 className="font-bold">{selectedChannel.name}</h2>
                    <p className="text-xs text-gray-500">{selectedChannel.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Pinned messages">
                    <Pin className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Search">
                    <Search className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <BellOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Bell className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={() => setShowMemberList(!showMemberList)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Members"
                  >
                    <Users className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </header>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto bg-white">
                <div className="max-w-4xl mx-auto py-4">
                  {mockMessages.map((message) => (
                    <MessageComponent key={message.id} message={message} />
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="max-w-4xl mx-auto">
                  <div className="relative">
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                      <button className="p-1 hover:bg-gray-200 rounded">
                        <Plus className="w-5 h-5 text-gray-500" />
                      </button>
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder={`Message #${selectedChannel.name}`}
                        className="flex-1 bg-transparent outline-none text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-gray-200 rounded" title="Bold">
                          <Bold className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded" title="Italic">
                          <Italic className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded" title="Code">
                          <Code className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded" title="Link">
                          <Link2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Emoji"
                        >
                          <Smile className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded" title="Attach">
                          <Paperclip className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={handleSendMessage}
                          className="ml-2 p-2 rounded text-white"
                          style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                          title="Send"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Role-specific quick actions */}
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    {userRole === 'founder' && (
                      <>
                        <button className="hover:text-blue-600">Share startup profile</button>
                        <span>•</span>
                        <button className="hover:text-blue-600">Post milestone</button>
                      </>
                    )}
                    {userRole === 'expert' && (
                      <>
                        <button className="hover:text-purple-600">Share consultation link</button>
                        <span>•</span>
                        <button className="hover:text-purple-600">Upload resource</button>
                      </>
                    )}
                    {userRole === 'investor' && (
                      <>
                        <button className="hover:text-green-600">Share deal opportunity</button>
                        <span>•</span>
                        <button className="hover:text-green-600">Schedule office hours</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Hash className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  {selectedCommunity ? 'Select a channel' : 'Select a community'}
                </h3>
                <p className="text-gray-500">
                  {selectedCommunity
                    ? 'Choose a channel from the sidebar to start chatting'
                    : 'Choose a community from the sidebar to get started'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Member List Sidebar */}
        {selectedChannel && showMemberList && (
          <aside className="w-60 bg-gray-50 border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-bold text-sm text-gray-700">
                Members — {mockMembers.length}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {/* Online Members */}
              <div className="mb-4">
                <div className="px-2 py-1 text-xs font-bold text-gray-500 uppercase">
                  Online — {onlineMemberCount}
                </div>
                {mockMembers
                  .filter((m) => m.online)
                  .map((member) => (
                    <button
                      key={member.id}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 transition-colors group"
                      title="View profile"
                    >
                      <div className="relative">
                        <span className="text-xl">{member.avatar}</span>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-50 rounded-full"></span>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-gray-900 truncate">{member.name}</span>
                          {getBadgeIcon(member.badge)}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{member.role}</p>
                      </div>
                    </button>
                  ))}
              </div>

              {/* Offline Members */}
              <div>
                <div className="px-2 py-1 text-xs font-bold text-gray-500 uppercase">
                  Offline — {mockMembers.length - onlineMemberCount}
                </div>
                {mockMembers
                  .filter((m) => !m.online)
                  .map((member) => (
                    <button
                      key={member.id}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 transition-colors opacity-60"
                    >
                      <span className="text-xl">{member.avatar}</span>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-gray-900 truncate">{member.name}</span>
                          {getBadgeIcon(member.badge)}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{member.role}</p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Member count footer */}
            <div className="p-3 border-t border-gray-200 text-xs text-gray-500 text-center">
              {onlineMemberCount} online · {mockMembers.length} total
            </div>
          </aside>
        )}
      </div>
    </>
  );
}