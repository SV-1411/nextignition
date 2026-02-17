import { motion } from 'motion/react';
import {
  MapPin,
  Share2,
  MoreVertical,
  MessageCircle,
  UserPlus,
  CheckCircle,
  Star,
  Eye,
  ThumbsUp,
  Users,
  TrendingUp,
  Award,
  Briefcase,
  DollarSign,
  Target,
  Calendar,
  ExternalLink,
  Globe,
  Linkedin,
  Twitter,
  Clock,
  AlignLeft,
  Video,
  FileText,
  Image as ImageIcon,
  Heart,
  Sparkles,
  Shield,
  Edit,
  UserCheck,
  Plus,
  Flag,
  Ban,
  Building,
  TrendingDown,
  Lightbulb,
  Rocket,
  Code,
  BarChart3,
  PlayCircle,
  Download,
  Send,
  Smile,
  Link as LinkIcon,
  Trophy,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { brandColors } from '../utils/colors';
import { getCurrentUser } from '../services/authService';
import { getProfile } from '../services/userService';

interface ProfilePageProps {
  userRole: 'founder' | 'expert' | 'investor';
  isOwnProfile?: boolean;
  onNavigateToSettings?: () => void;
}

export function ProfilePage({ userRole, isOwnProfile = true, onNavigateToSettings }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('Posts');
  const [showMenu, setShowMenu] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showCreateOfferModal, setShowCreateOfferModal] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState<'text' | 'image' | 'video' | 'poll' | 'milestone' | 'document'>('text');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        try {
          const userId = currentUser.id || currentUser._id;
          if (!userId) {
            setError('User ID not found');
            setUser(currentUser);
            setLoading(false);
            return;
          }
          const profile = await getProfile(userId);
          setUser({ ...currentUser, ...profile });
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to load profile');
          setUser(currentUser);
        } finally {
          setLoading(false);
        }
      } else {
        setError('Please log in to view profile');
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error || 'Profile not found'}</div>
      </div>
    );
  }

  const currentProfile = {
    name: user.name,
    username: `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
    avatar: user.name.charAt(0),
    tagline: user.profile?.title || (userRole === 'founder' ? 'Innovating at NextIgnition' : 'Expert Mentor'),
    location: user.profile?.location || 'India',
    verified: true,
    stats: userRole === 'founder' ? {
      profileViews: '1.2K',
      connections: 0,
      followers: 0,
      engagement: '0%',
      startupFollowers: 0
    } : userRole === 'expert' ? {
      startupsHelped: 0,
      totalSessions: 0,
      avgRating: 5.0,
      revenueMonth: '$0',
      revenueLifetime: '$0'
    } : {
      totalInvestments: 0,
      exits: 0,
      avgCheckSize: '$0',
      yearsInvesting: 0
    },
    bio: user.profile?.bio || 'Passionate professional on NextIgnition',
    skills: user.profile?.skills || [],
    lookingFor: [],
    dealBreakers: [],
    languages: ['English', 'Hindi'],
    title: user.profile?.title,
    experience: `${user.profile?.experience || 0} years`,
    expertise: user.profile?.skills || [],
    availableFor: [],
    rating: 5.0,
    reviews: 0,
    ticketSize: '$0',
    stages: [],
    sectors: [],
    openToDeals: true,
    thesis: '',
    industries: [],
    startup: user.profile?.startupName ? {
      name: user.profile.startupName,
      logo: '🚀',
      mission: 'Visionary Startup',
      stage: 'Idea'
    } : null
  };

  const tabs = userRole === 'founder'
    ? ['Posts', 'About', 'Media', 'Connections', 'Portfolio']
    : userRole === 'expert'
      ? ['Posts', 'About', 'Media', 'Connections', 'Reviews', 'Services']
      : ['Posts', 'About', 'Media', 'Connections', 'Portfolio'];

  // Real data would come from API; show empty until integrated
  const posts: { id: number; type: string; content: string; likes: number; comments: number; time: string; pinned: boolean }[] = [];
  const connections: { name: string; role: string; company: string; avatar: string; mutual: number }[] = [];
  const reviews: { reviewer: string; role: string; rating: number; text: string; type: string; time: string; avatar: string }[] = [];
  const portfolio: { name: string; logo: string; description: string; stage: string; sector: string; role: string; status: string }[] = [];
  const services: { title: string; price: string; description: string; bullets: string[]; popular: boolean }[] = [];

  type PostTypeOption = {
    type: 'text' | 'image' | 'video' | 'poll' | 'milestone' | 'document';
    icon: any;
    label: string;
    color: string;
  };

  const postTypes: PostTypeOption[] = [
    { type: 'text', icon: AlignLeft, label: 'Text', color: brandColors.electricBlue },
    { type: 'image', icon: ImageIcon, label: 'Image', color: brandColors.atomicOrange },
    { type: 'video', icon: Video, label: 'Video', color: '#8B5CF6' },
    { type: 'poll', icon: BarChart3, label: 'Poll', color: '#10B981' },
    { type: 'milestone', icon: Trophy, label: 'Milestone', color: '#F59E0B' },
    { type: 'document', icon: FileText, label: 'Doc', color: '#6B7280' },
  ];

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left - Avatar & Basic Info */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-4xl mb-4">
                {currentProfile.avatar}
              </div>
              <h1 className="text-2xl font-bold mb-1 text-center lg:text-left">{currentProfile.name}</h1>
              <p className="text-gray-600 mb-2 text-center lg:text-left">{currentProfile.username}</p>
              {currentProfile.verified && (
                <div className="flex items-center gap-1 text-blue-500 mb-2">
                  <CheckCircle className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">Verified {userRole}</span>
                </div>
              )}
              <p className="text-gray-700 mb-3 text-center lg:text-left max-w-xs">{currentProfile.tagline}</p>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{currentProfile.location}</span>
              </div>
              <div className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                {userRole === 'founder' ? 'Founder / Co-founder' : userRole === 'expert' ? 'Expert / Mentor' : 'Investor / VC'}
              </div>
            </div>

            {/* Middle - Role-specific Info */}
            <div className="flex-1">
              {userRole === 'founder' && currentProfile.startup && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl border border-gray-200">
                      {currentProfile.startup.logo}
                    </div>
                    <div>
                      <h3 className="font-bold">{currentProfile.startup.name}</h3>
                      <p className="text-sm text-gray-600">{currentProfile.startup.mission}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${currentProfile.startup.stage === 'Idea' ? 'bg-gray-200 text-gray-700' :
                      currentProfile.startup.stage === 'MVP' ? 'bg-blue-100 text-blue-700' :
                        currentProfile.startup.stage === 'Growth' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                      }`}>
                      {currentProfile.startup.stage}
                    </span>
                    <button className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      View Startup Profile
                    </button>
                  </div>
                </div>
              )}

              {userRole === 'expert' && (
                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-2">{currentProfile.title}</h3>
                  <p className="text-gray-600 mb-3">{currentProfile.experience}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= Math.floor(currentProfile.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold">{currentProfile.rating}</span>
                    <span className="text-gray-600">({currentProfile.reviews} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.expertise.slice(0, 5).map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {userRole === 'investor' && (
                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-2">{currentProfile.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Ticket Size</p>
                      <p className="font-bold">{currentProfile.ticketSize}</p>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">
                        {currentProfile.openToDeals && (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse block"></span>
                            Open to new deals
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">Preferred Stages</p>
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.stages.map((stage, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full"
                        >
                          {stage}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Sector Focus</p>
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.sectors.map((sector, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full"
                        >
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right - Actions */}
            <div className="flex flex-col gap-2 lg:items-end">
              {isOwnProfile ? (
                <button
                  onClick={onNavigateToSettings}
                  className="px-6 py-2.5 rounded-lg font-bold text-white flex items-center gap-2 justify-center"
                  style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    className="px-6 py-2.5 rounded-lg font-bold text-white flex items-center gap-2 justify-center"
                    style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                  >
                    {userRole === 'founder' ? (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Connect
                      </>
                    ) : userRole === 'expert' ? (
                      <>
                        <Calendar className="w-4 h-4" />
                        Book Session
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Request Meeting
                      </>
                    )}
                  </button>
                  <button className="px-6 py-2.5 border-2 border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors flex items-center gap-2 justify-center">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                </>
              )}
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                      <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                        <Flag className="w-4 h-4" />
                        Report
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                        <Ban className="w-4 h-4" />
                        Block
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats & Actions Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-4 mb-6"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:flex lg:divide-x divide-gray-200 gap-4 lg:gap-6 w-full lg:w-auto">
              {userRole === 'founder' && currentProfile.stats && (
                <>
                  <div className="lg:pr-6">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Eye className="w-4 h-4" />
                      <span className="text-xs">Profile Views (30d)</span>
                    </div>
                    <p className="text-2xl font-bold">{currentProfile.stats.profileViews}</p>
                  </div>
                  <div className="lg:px-6">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">Connections</span>
                    </div>
                    <p className="text-2xl font-bold">{currentProfile.stats.connections}</p>
                  </div>
                  <div className="lg:px-6">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <UserCheck className="w-4 h-4" />
                      <span className="text-xs">Followers</span>
                    </div>
                    <p className="text-2xl font-bold">{currentProfile.stats.followers}</p>
                  </div>
                  <div className="lg:px-6">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs">Engagement</span>
                    </div>
                    <p className="text-2xl font-bold">{currentProfile.stats.engagement}</p>
                  </div>
                </>
              )}

              {userRole === 'expert' && currentProfile.stats && (
                <>
                  <div className="lg:pr-6">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">Startups Helped</span>
                    </div>
                    <p className="text-2xl font-bold">{currentProfile.stats.startupsHelped}</p>
                  </div>
                  <div className="lg:px-6">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Video className="w-4 h-4" />
                      <span className="text-xs">Total Sessions</span>
                    </div>
                    <p className="text-2xl font-bold">{currentProfile.stats.totalSessions}</p>
                  </div>
                  <div className="lg:px-6">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Star className="w-4 h-4" />
                      <span className="text-xs">Avg Rating</span>
                    </div>
                    <p className="text-2xl font-bold">{currentProfile.stats.avgRating}</p>
                  </div>
                  <div className="lg:px-6">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs">This Month</span>
                    </div>
                    <p className="text-2xl font-bold">{currentProfile.stats.revenueMonth}</p>
                  </div>
                </>
              )}

              {userRole === 'investor' && currentProfile.stats && (
                <>
                  <div className="lg:pr-6">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Target className="w-4 h-4" />
                      <span className="text-xs">Investments</span>
                    </div>
                    <p className="text-2xl font-bold">{currentProfile.stats.totalInvestments}</p>
                  </div>
                  <div className="lg:px-6">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs">Exits</span>
                    </div>
                    <p className="text-2xl font-bold">{currentProfile.stats.exits}</p>
                  </div>
                  <div className="lg:px-6">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs">Avg Check</span>
                    </div>
                    <p className="text-2xl font-bold">{currentProfile.stats.avgCheckSize}</p>
                  </div>
                  <div className="lg:px-6">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">Years Investing</span>
                    </div>
                    <p className="text-2xl font-bold">{currentProfile.stats.yearsInvesting}</p>
                  </div>
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 w-full lg:w-auto">
              {userRole === 'founder' && (
                <>
                  <button
                    onClick={() => setShowCreatePostModal(true)}
                    className="flex-1 lg:flex-none px-4 py-2 rounded-lg font-bold text-white text-sm"
                    style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                  >
                    Create Post
                  </button>
                  <button
                    onClick={() => setShowAddMilestoneModal(true)}
                    className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50"
                  >
                    Add Milestone
                  </button>
                </>
              )}
              {userRole === 'expert' && (
                <>
                  <button
                    onClick={() => setShowAvailabilityModal(true)}
                    className="flex-1 lg:flex-none px-4 py-2 rounded-lg font-bold text-white text-sm"
                    style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                  >
                    View Availability
                  </button>
                  <button
                    onClick={() => setShowCreateOfferModal(true)}
                    className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50"
                  >
                    Create Offer
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
              <div className="grid grid-cols-4 sm:grid-cols-5 md:flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2 sm:px-6 py-4 font-bold text-xs sm:text-sm transition-all relative whitespace-nowrap ${activeTab === tab
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {/* Posts Tab */}
              {activeTab === 'Posts' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Filter chips */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium whitespace-nowrap">
                      All
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
                      Milestones
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
                      Articles
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
                      Updates
                    </button>
                  </div>

                  {/* Posts */}
                  {posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-xl shadow-sm p-6">
                      {post.pinned && (
                        <div className="flex items-center gap-2 text-blue-600 mb-3 text-sm font-medium">
                          <Sparkles className="w-4 h-4" />
                          Pinned Post
                        </div>
                      )}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-lg">
                          {currentProfile.avatar}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold">{currentProfile.name}</h4>
                          <p className="text-sm text-gray-600">{post.time}</p>
                        </div>
                      </div>
                      <p className="text-gray-800 mb-4">{post.content}</p>
                      <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                          <ThumbsUp className="w-5 h-5" />
                          <span className="text-sm font-medium">{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* About Tab */}
              {activeTab === 'About' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold mb-4">
                      {userRole === 'investor' ? 'Investment Thesis' : 'About'}
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {userRole === 'founder' && currentProfile.bio}
                      {userRole === 'expert' && 'Experienced growth marketing expert with a proven track record of helping startups scale from 0 to millions in revenue. Passionate about building sustainable growth systems and mentoring the next generation of founders.'}
                      {userRole === 'investor' && currentProfile.thesis}
                    </p>

                    {userRole === 'founder' && (
                      <>
                        <h4 className="font-bold mb-3">Skills & Focus Areas</h4>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {currentProfile.skills.map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <h4 className="font-bold mb-3">Looking For</h4>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {currentProfile.lookingFor.map((item, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-green-100 text-green-700 text-sm font-medium rounded-lg"
                            >
                              {item}
                            </span>
                          ))}
                        </div>

                        <h4 className="font-bold mb-3">Languages</h4>
                        <p className="text-gray-700">{currentProfile.languages.join(', ')}</p>
                      </>
                    )}

                    {userRole === 'expert' && (
                      <>
                        <h4 className="font-bold mb-3">Areas of Expertise</h4>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {currentProfile.expertise.map((item: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-purple-100 text-purple-700 text-sm font-medium rounded-lg"
                            >
                              {item}
                            </span>
                          ))}
                        </div>

                        <h4 className="font-bold mb-3">Industries</h4>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {currentProfile.industries.map((item: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-orange-100 text-orange-700 text-sm font-medium rounded-lg"
                            >
                              {item}
                            </span>
                          ))}
                        </div>

                        <h4 className="font-bold mb-3">Available For</h4>
                        <div className="flex flex-wrap gap-2">
                          {(currentProfile.availableFor || []).map((item: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </>
                    )}

                    {userRole === 'investor' && (
                      <>
                        <h4 className="font-bold mb-3">What I Look For</h4>
                        <ul className="space-y-2 mb-6">
                          {currentProfile.lookingFor.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>

                        <h4 className="font-bold mb-3 text-red-600">Deal Breakers</h4>
                        <ul className="space-y-2">
                          {(currentProfile.dealBreakers || []).map((item: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <Ban className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Media Tab */}
              {activeTab === 'Media' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium whitespace-nowrap">
                      All
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
                      Images
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
                      Videos
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 whitespace-nowrap">
                      Documents
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div key={item} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-3 flex items-center justify-center">
                          {item % 3 === 0 ? (
                            <PlayCircle className="w-12 h-12 text-blue-500" />
                          ) : item % 3 === 1 ? (
                            <FileText className="w-12 h-12 text-orange-500" />
                          ) : (
                            <ImageIcon className="w-12 h-12 text-purple-500" />
                          )}
                        </div>
                        <p className="text-sm font-medium truncate">Media Item {item}</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Connections Tab */}
              {activeTab === 'Connections' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      Connections
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200">
                      Followers
                    </button>
                  </div>

                  <div className="space-y-3">
                    {connections.map((connection, index) => (
                      <div key={index} className="bg-white rounded-xl shadow-sm p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                              {connection.avatar}
                            </div>
                            <div>
                              <h4 className="font-bold">{connection.name}</h4>
                              <p className="text-sm text-gray-600">{connection.role} at {connection.company}</p>
                              <p className="text-xs text-gray-500">{connection.mutual} mutual connections</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                            Message
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Reviews Tab (Expert only) */}
              {activeTab === 'Reviews' && userRole === 'expert' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Rating Summary */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="text-center">
                        <div className="text-5xl font-bold mb-2">{currentProfile.rating}</div>
                        <div className="flex items-center gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="w-5 h-5 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{currentProfile.reviews} reviews</p>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-2 mb-2">
                            <span className="text-sm w-8">{stars}★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-full rounded-full"
                                style={{ width: stars === 5 ? '85%' : stars === 4 ? '12%' : '3%' }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-12 text-right">
                              {stars === 5 ? '85%' : stars === 4 ? '12%' : '3%'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-lg">
                            {review.avatar}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold">{review.reviewer}</h4>
                            <p className="text-sm text-gray-600">{review.role}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                      }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">• {review.time}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{review.text}</p>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {review.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Services Tab (Expert only) */}
              {activeTab === 'Services' && userRole === 'expert' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold">Mentorship Packages</h3>
                  <div className="grid gap-4">
                    {services.map((service, index) => (
                      <div
                        key={index}
                        className={`bg-white rounded-xl shadow-sm p-6 ${service.popular ? 'ring-2 ring-blue-500' : ''
                          }`}
                      >
                        {service.popular && (
                          <div className="inline-block px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full mb-4">
                            MOST POPULAR
                          </div>
                        )}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-bold mb-2">{service.title}</h4>
                            <p className="text-gray-600 mb-4">{service.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600">{service.price}</div>
                          </div>
                        </div>
                        <ul className="space-y-2 mb-6">
                          {service.bullets.map((bullet, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          className="w-full px-6 py-3 rounded-lg font-bold text-white"
                          style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                        >
                          Book Now
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Portfolio Tab */}
              {activeTab === 'Portfolio' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {userRole === 'investor' && (
                    <>
                      <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-3xl font-bold text-blue-600">{currentProfile.stats.totalInvestments}</div>
                            <div className="text-sm text-gray-600">Active Investments</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-green-600">{currentProfile.stats.exits}</div>
                            <div className="text-sm text-gray-600">Successful Exits</div>
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-orange-600">SaaS</div>
                            <div className="text-sm text-gray-600">Top Sector</div>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold">Portfolio Companies</h3>
                      <div className="grid gap-4">
                        {portfolio.map((company, index) => (
                          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                                {company.logo}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="text-lg font-bold">{company.name}</h4>
                                  {company.status === 'Exited' && (
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                      EXITED
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-3">{company.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                    {company.stage}
                                  </span>
                                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                    {company.sector}
                                  </span>
                                  <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                                    {company.role}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {userRole === 'founder' && (
                    <>
                      <h3 className="text-xl font-bold">Startups Founded</h3>
                      <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl">
                            🚀
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold mb-1">TechFlow AI</h4>
                            <p className="text-gray-600">AI-powered customer support platform</p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            CURRENT
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                          <div>
                            <div className="text-2xl font-bold">$15M</div>
                            <div className="text-sm text-gray-600">Raised</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold">50+</div>
                            <div className="text-sm text-gray-600">Team Size</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold">500+</div>
                            <div className="text-sm text-gray-600">Customers</div>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mt-6">Achievements & Milestones</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-4 text-white">
                          <Award className="w-8 h-8 mb-2" />
                          <h4 className="font-bold">YC S23</h4>
                          <p className="text-sm text-white/80">Y Combinator</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                          <TrendingUp className="w-8 h-8 mb-2" />
                          <h4 className="font-bold">Series A</h4>
                          <p className="text-sm text-white/80">$15M Raised</p>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {userRole === 'founder' && (
              <>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4">Startup Snapshot</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Funding Required</p>
                      <p className="font-bold">$5M - $10M</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Equity Available</p>
                      <p className="font-bold">15-20%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">MRR</p>
                      <p className="font-bold">$150K</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Growth Rate</p>
                      <p className="font-bold text-green-600">+25% MoM</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="font-bold">AI Insights</h3>
                  </div>
                  <p className="text-sm text-white/90 mb-4">
                    Ignisha suggests updating your pitch deck with recent traction metrics to attract more investor interest.
                  </p>
                  <button className="w-full px-4 py-2 bg-white text-purple-600 rounded-lg font-bold text-sm hover:bg-white/90 transition-colors">
                    View Suggestions
                  </button>
                </div>
              </>
            )}

            {userRole === 'expert' && (
              <>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4">Availability</h3>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="text-sm">Mon, Jan 27</span>
                      <span className="text-sm font-medium text-green-600">3 slots</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-200">
                      <span className="text-sm">Tue, Jan 28</span>
                      <span className="text-sm font-medium text-green-600">5 slots</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Wed, Jan 29</span>
                      <span className="text-sm font-medium text-green-600">2 slots</span>
                    </div>
                  </div>
                  <button
                    className="w-full px-4 py-2 rounded-lg font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                  >
                    View Full Calendar
                  </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4">Session Types</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">30-min Call</span>
                      <span className="font-bold text-blue-600">$299</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">60-min Session</span>
                      <span className="font-bold text-blue-600">$499</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Workshop (2hr)</span>
                      <span className="font-bold text-blue-600">$899</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {userRole === 'investor' && (
              <>
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                  <h3 className="font-bold mb-3">Current Focus</h3>
                  <p className="text-sm text-white/90">
                    Actively looking for FinTech & SaaS companies in India/US at Seed–Series A stage with strong product-market fit.
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4">Co-investors Network</h3>
                  <div className="flex -space-x-2 mb-4">
                    {['👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍🏫'].map((avatar, index) => (
                      <div
                        key={index}
                        className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white"
                      >
                        {avatar}
                      </div>
                    ))}
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white text-xs font-bold">
                      +12
                    </div>
                  </div>
                  <button className="text-sm text-blue-600 font-medium">See all co-investors →</button>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Invested in Stripe</p>
                        <p className="text-xs text-gray-600">Dec 2025</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Led round in Notion</p>
                        <p className="text-xs text-gray-600">Nov 2025</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Joined Figma board</p>
                        <p className="text-xs text-gray-600">Oct 2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
              <button
                onClick={() => setShowCreatePostModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Post Type Selector */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
                {postTypes.map((type) => (
                  <button
                    key={type.type}
                    onClick={() => setSelectedPostType(type.type)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${selectedPostType === type.type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <type.icon
                      className="w-6 h-6"
                      style={{ color: selectedPostType === type.type ? type.color : '#6b7280' }}
                    />
                    <span className={`text-xs font-medium ${selectedPostType === type.type ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {currentProfile.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{currentProfile.name}</h3>
                  <p className="text-sm text-gray-600">Post publicly</p>
                </div>
              </div>

              {/* Content Input */}
              <textarea
                placeholder="What's on your mind?"
                rows={6}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
              />

              {/* Type-specific inputs */}
              {selectedPostType === 'image' && (
                <div className="mb-4 p-8 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-gray-400 transition-colors">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Click to upload images</p>
                  <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                </div>
              )}

              {selectedPostType === 'video' && (
                <div className="mb-4 p-8 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-gray-400 transition-colors">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Click to upload video</p>
                  <p className="text-sm text-gray-500 mt-1">MP4, MOV, AVI up to 100MB</p>
                </div>
              )}

              {selectedPostType === 'poll' && (
                <div className="mb-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Poll question"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Option 1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Option 2"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Add option
                  </button>
                </div>
              )}

              {selectedPostType === 'milestone' && (
                <div className="mb-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Milestone title (e.g., 'Raised $1M')"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select milestone type</option>
                    <option>💰 Funding</option>
                    <option>🚀 Product Launch</option>
                    <option>👥 Team Milestone</option>
                    <option>📈 Growth Milestone</option>
                    <option>🏆 Award/Recognition</option>
                  </select>
                </div>
              )}

              {selectedPostType === 'document' && (
                <div className="mb-4 p-8 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-gray-400 transition-colors">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Click to upload document</p>
                  <p className="text-sm text-gray-500 mt-1">PDF, DOC, PPT up to 10MB</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Add emoji">
                    <Smile className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Add location">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Add link">
                    <LinkIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Schedule post">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-[#6666FF] to-[#F78405] text-white rounded-lg transition-all hover:shadow-md flex items-center justify-center gap-2"
                    title="Enhance with AI"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium whitespace-nowrap">Enhance with AI</span>
                  </button>
                  <button
                    className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r text-white rounded-lg font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
                    style={{
                      background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})`,
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Milestone Modal */}
      {showAddMilestoneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Add Milestone</h2>
                <button
                  onClick={() => setShowAddMilestoneModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Milestone Title</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., Closed Series A Funding"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg min-h-[120px]"
                    placeholder="Share details about this milestone..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg">
                    <option>Funding</option>
                    <option>Product</option>
                    <option>Team</option>
                    <option>Partnership</option>
                    <option>Revenue</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddMilestoneModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 rounded-lg font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                >
                  Add Milestone
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Availability Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Availability</h2>
                <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">Weekly Schedule</h3>
                <div className="space-y-3">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                    <div key={day} className="flex items-center gap-4">
                      <div className="w-28 font-medium">{day}</div>
                      <input type="time" className="p-2 border border-gray-300 rounded-lg" defaultValue="09:00" />
                      <span>to</span>
                      <input type="time" className="p-2 border border-gray-300 rounded-lg" defaultValue="17:00" />
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Available</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-4">Upcoming Sessions</h3>
                <div className="space-y-3">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">Strategy Call - TechStartup Inc.</p>
                        <p className="text-sm text-gray-600">Tomorrow, 2:00 PM - 3:00 PM</p>
                      </div>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">Growth Workshop - FinTech Co.</p>
                        <p className="text-sm text-gray-600">Jan 30, 10:00 AM - 12:00 PM</p>
                      </div>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  className="px-6 py-2 rounded-lg font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                >
                  Update Availability
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Offer Modal */}
      {showCreateOfferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Create New Service Offer</h2>
                <button
                  onClick={() => setShowCreateOfferModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Service Title</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., 60-min Growth Strategy Session"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg min-h-[120px]"
                    placeholder="Describe what's included in this service..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="$299"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg">
                      <option>30 minutes</option>
                      <option>60 minutes</option>
                      <option>90 minutes</option>
                      <option>2 hours</option>
                      <option>Custom</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg">
                    <option>1:1 Mentorship</option>
                    <option>Workshop</option>
                    <option>Advisory</option>
                    <option>Consultation</option>
                    <option>Code Review</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">What's Included</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="e.g., 1:1 video call"
                    />
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="e.g., Actionable insights"
                    />
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="e.g., Follow-up notes"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateOfferModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 rounded-lg font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                >
                  Create Offer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
