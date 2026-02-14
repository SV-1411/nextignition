import { motion, AnimatePresence } from 'motion/react';
import { brandColors } from '../utils/colors';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { VerificationBanner } from './VerificationBanner';
import { StoryViewer, StoryData } from './StoryViewer';
import { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Users,
  Search,
  TrendingUp,
  Bookmark,
  Filter,
  ChevronRight,
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Sparkles,
  Trophy,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Smile,
  Send,
  ImageIcon as ImageIcon,
  Video,
  FileText,
  BarChart3,
  MapPin,
  Link as LinkIcon,
  UserPlus,
  Edit,
  Trash2,
  Flag,
  EyeOff,
  Copy,
  Ban,
  VolumeOff
} from 'lucide-react';
import { CreateEventModal } from './CreateEventModal';

interface Story {
  id: number;
  author: string;
  avatar: string;
  image: string;
  timestamp: string;
  viewed: boolean;
}

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
    title: string;
    verified: boolean;
  };
  timestamp: string;
  type: 'text' | 'image' | 'video' | 'poll' | 'milestone' | 'document';
  content: string;
  images?: string[];
  video?: {
    url: string;
    thumbnail: string;
    duration: string;
  };
  poll?: {
    question: string;
    options: { text: string; votes: number; percentage: number }[];
    totalVotes: number;
    userVoted: number | null;
  };
  milestone?: {
    title: string;
    description: string;
    icon: typeof Trophy;
    color: string;
  };
  document?: {
    title: string;
    type: string;
    size: string;
  };
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface EnhancedHomeFeedProps {
  userType?: 'founder' | 'investor' | 'expert' | 'cofounder';
}

export function EnhancedHomeFeed({ userType = 'foundor' }: EnhancedHomeFeedProps) {
  const [activeFilter, setActiveFilter] = useState('Following');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedPostType, setSelectedPostType] = useState<Post['type']>('text');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [showAIEnhancer, setShowAIEnhancer] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [aiEnhancedVersions, setAiEnhancedVersions] = useState<string[]>([]);
  const [showVerificationBanner, setShowVerificationBanner] = useState(true);
  const [isVerified, setIsVerified] = useState(false); // Always show banner by default
  const [commentText, setCommentText] = useState<{ [key: number]: string }>({});
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState<number | null>(null);
  const [mutedVideo, setMutedVideo] = useState<number | null>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const [openPostMenu, setOpenPostMenu] = useState<number | null>(null);
  const postMenuRef = useRef<HTMLDivElement | null>(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  const feedFilters = ['Following', 'Discover', 'Trending', 'Saved'];

  const stories: StoryData[] = [
    { id: 1, author: 'You', avatar: 'YU', image: '', timestamp: '', viewed: false, content: 'Add your story' },
    { id: 2, author: 'Sarah C.', avatar: 'SC', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800', timestamp: '2h ago', viewed: false, content: '🎉 Just closed our seed round! Grateful for the community support.' },
    { id: 3, author: 'Mike R.', avatar: 'MR', image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800', timestamp: '4h ago', viewed: true, content: 'Product launch day! Check out our new features 🚀' },
    { id: 4, author: 'Emma W.', avatar: 'EW', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800', timestamp: '6h ago', viewed: false, content: 'Attended an amazing startup event today! 💡' },
    { id: 5, author: 'Alex T.', avatar: 'AT', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', timestamp: '8h ago', viewed: false, content: 'Building in public - Day 30 of our journey' },
    { id: 6, author: 'Lisa M.', avatar: 'LM', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800', timestamp: '10h ago', viewed: true, content: 'Mentoring session was incredibly insightful! 🌟' },
    { id: 7, author: 'James K.', avatar: 'JK', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800', timestamp: '12h ago', viewed: false, content: 'Hit 10K users today! Thank you all for the support ❤️' },
  ];

  const trendingTopics = [
    { tag: '#AIStartups', posts: 1234, trend: '+12%' },
    { tag: '#SeedFunding', posts: 892, trend: '+8%' },
    { tag: '#ProductLaunch', posts: 567, trend: '+24%' },
    { tag: '#StartupTips', posts: 2341, trend: '+5%' },
    { tag: '#Networking', posts: 445, trend: '+15%' },
  ];

  const suggestedConnections = [
    { name: 'David Park', title: 'Angel Investor', mutual: '12 mutual', avatar: 'DP' },
    { name: 'Lisa Zhang', title: 'UX Designer', mutual: '8 mutual', avatar: 'LZ' },
    { name: 'James Miller', title: 'Marketing Expert', mutual: '15 mutual', avatar: 'JM' },
  ];

  const mockPosts: Post[] = [
    {
      id: 1,
      author: {
        name: 'Sarah Chen',
        avatar: 'SC',
        title: 'Founder at TechFlow AI',
        verified: true,
      },
      timestamp: '2h ago',
      type: 'milestone',
      content: 'Just closed our seed round! 🎉 Grateful for all the mentorship from the NextIgnition community. Here\'s what I learned about pitching to VCs...',
      milestone: {
        title: '💰 Seed Round Closed',
        description: '$2M raised',
        icon: Trophy,
        color: brandColors.atomicOrange,
      },
      likes: 124,
      comments: 18,
      shares: 7,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: 2,
      author: {
        name: 'Marcus Williams',
        avatar: 'MW',
        title: 'Co-founder at GreenScale',
        verified: true,
      },
      timestamp: '5h ago',
      type: 'text',
      content: 'Looking for a technical co-founder with experience in blockchain and sustainability. Our vision is to revolutionize carbon credit trading. DM if interested! 🌱\n\nWhat we\'re building:\n- Decentralized carbon credit marketplace\n- Real-time emissions tracking\n- AI-powered carbon offset recommendations\n- Smart contracts for transparent trading\n\nIdeal co-founder profile:\n- 3+ years blockchain development\n- Experience with Ethereum/Solidity\n- Passionate about climate tech\n- Previous startup experience is a plus\n\nWe already have:\n- Product roadmap & wireframes\n- Initial partnerships with 3 carbon registries\n- LOIs from 5 enterprise customers\n- $500K in personal funding committed\n\nLet\'s change the world together! 🚀',
      likes: 89,
      comments: 32,
      shares: 12,
      isLiked: true,
      isBookmarked: false,
    },
    {
      id: 3,
      author: {
        name: 'Emily Rodriguez',
        avatar: 'ER',
        title: 'Growth Lead at StartupHub',
        verified: false,
      },
      timestamp: '1d ago',
      type: 'image',
      content: 'Our team offsite was absolutely amazing! Building great products starts with building great teams. 💪',
      images: [
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
        'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=800',
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
      ],
      likes: 256,
      comments: 45,
      shares: 23,
      isLiked: false,
      isBookmarked: true,
    },
    {
      id: 4,
      author: {
        name: 'Alex Thompson',
        avatar: 'AT',
        title: 'Product Designer',
        verified: true,
      },
      timestamp: '2d ago',
      type: 'poll',
      content: 'Quick poll for fellow founders: What\'s your biggest challenge right now?',
      poll: {
        question: 'What\'s your biggest challenge right now?',
        options: [
          { text: 'Finding product-market fit', votes: 45, percentage: 38 },
          { text: 'Fundraising', votes: 32, percentage: 27 },
          { text: 'Hiring the right team', votes: 28, percentage: 23 },
          { text: 'Marketing & growth', votes: 14, percentage: 12 },
        ],
        totalVotes: 119,
        userVoted: null,
      },
      likes: 67,
      comments: 28,
      shares: 5,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: 5,
      author: {
        name: 'Jennifer Park',
        avatar: 'JP',
        title: 'Serial Entrepreneur',
        verified: true,
      },
      timestamp: '3d ago',
      type: 'video',
      content: 'Here\'s a behind-the-scenes look at our product development process. From ideation to launch in 6 weeks! ',
      video: {
        url: 'https://example.com/video.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        duration: '3:24',
      },
      likes: 342,
      comments: 56,
      shares: 89,
      isLiked: true,
      isBookmarked: true,
    },
    {
      id: 6,
      author: {
        name: 'David Kim',
        avatar: 'DK',
        title: 'Investor at Sequoia Capital',
        verified: true,
      },
      timestamp: '4d ago',
      type: 'document',
      content: 'Sharing our updated investment thesis for 2024. Key focus areas: AI infrastructure, climate tech, and developer tools. 📄',
      document: {
        title: 'Investment_Thesis_2024.pdf',
        type: 'PDF',
        size: '2.4 MB',
      },
      likes: 189,
      comments: 41,
      shares: 67,
      isLiked: false,
      isBookmarked: true,
    },
  ];

  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const postTypes = [
    { type: 'text' as const, icon: FileText, label: 'Text', color: brandColors.navyBlue },
    { type: 'image' as const, icon: ImageIcon, label: 'Image', color: brandColors.electricBlue },
    { type: 'video' as const, icon: Video, label: 'Video', color: brandColors.atomicOrange },
    { type: 'poll' as const, icon: BarChart3, label: 'Poll', color: '#10b981' },
    { type: 'milestone' as const, icon: Trophy, label: 'Milestone', color: '#f59e0b' },
    { type: 'document' as const, icon: FileText, label: 'Document', color: '#8b5cf6' },
  ];

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleBookmark = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const handleVote = (postId: number, optionIndex: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId && post.poll) {
        const newOptions = post.poll.options.map((opt, idx) => ({
          ...opt,
          votes: idx === optionIndex ? opt.votes + 1 : opt.votes,
        }));
        const newTotal = post.poll.totalVotes + 1;
        newOptions.forEach(opt => {
          opt.percentage = Math.round((opt.votes / newTotal) * 100);
        });
        return {
          ...post,
          poll: {
            ...post.poll,
            options: newOptions,
            totalVotes: newTotal,
            userVoted: optionIndex,
          },
        };
      }
      return post;
    }));
  };

  const toggleVideo = (postId: number) => {
    const video = videoRefs.current[postId];
    if (video) {
      if (playingVideo === postId) {
        video.pause();
        setPlayingVideo(null);
      } else {
        video.play();
        setPlayingVideo(postId);
      }
    }
  };

  const toggleMute = (postId: number) => {
    const video = videoRefs.current[postId];
    if (video) {
      video.muted = !video.muted;
      setMutedVideo(video.muted ? postId : null);
    }
  };

  useEffect(() => {
    if (showConfetti !== null) {
      const timer = setTimeout(() => setShowConfetti(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Close post menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (postMenuRef.current && !postMenuRef.current.contains(event.target as Node)) {
        setOpenPostMenu(null);
      }
    };

    if (openPostMenu !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openPostMenu]);

  const handleDeletePost = (postId: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(p => p.id !== postId));
      setOpenPostMenu(null);
    }
  };

  const handleCopyLink = (postId: number) => {
    navigator.clipboard.writeText(`https://nextignition.com/post/${postId}`);
    setOpenPostMenu(null);
    // You could add a toast notification here
  };

  const handleHidePost = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId));
    setOpenPostMenu(null);
  };

  const renderPost = (post: Post, index: number) => {
    const isExpanded = expandedPost === post.id;
    const shouldTruncate = post.content.length > 280 && post.type === 'text';
    const displayContent = shouldTruncate && !isExpanded 
      ? post.content.slice(0, 280) + '...' 
      : post.content;

    return (
      <motion.div
        key={post.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden relative"
      >
        {/* Confetti Animation for Milestone Posts */}
        {post.type === 'milestone' && showConfetti === post.id && (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: ['#f78405', '#6666ff', '#f59e0b', '#10b981', '#ef4444'][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: -10,
                }}
                animate={{
                  y: [0, 600],
                  x: [0, (Math.random() - 0.5) * 200],
                  rotate: [0, Math.random() * 360],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )}

        <div className="p-4 md:p-6">
          {/* Post Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {post.author.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900">{post.author.name}</h4>
                  {post.author.verified && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" fill="white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">{post.author.title}</p>
                <p className="text-xs text-gray-400">{post.timestamp}</p>
              </div>
            </div>
            <div className="relative">
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenPostMenu(openPostMenu === post.id ? null : post.id);
                }}
              >
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
              </button>

              {/* Post Actions Dropdown Menu */}
              <AnimatePresence>
                {openPostMenu === post.id && (
                  <motion.div
                    ref={postMenuRef}
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50 min-w-[200px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Show Edit & Delete for user's own posts (post id 1 for demo) */}
                    {post.id === 1 && (
                      <>
                        <button
                          onClick={() => {
                            setOpenPostMenu(null);
                            // Handle edit post
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Edit post</span>
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-600">Delete post</span>
                        </button>
                        <div className="border-t border-gray-200" />
                      </>
                    )}

                    {/* Common actions for all posts */}
                    <button
                      onClick={() => {
                        handleBookmark(post.id);
                        setOpenPostMenu(null);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Bookmark className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {post.isBookmarked ? 'Remove bookmark' : 'Save post'}
                      </span>
                    </button>
                    <button
                      onClick={() => handleCopyLink(post.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Copy link</span>
                    </button>

                    {/* Show hide/report for other people's posts */}
                    {post.id !== 1 && (
                      <>
                        <div className="border-t border-gray-200" />
                        <button
                          onClick={() => handleHidePost(post.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <EyeOff className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Hide post</span>
                        </button>
                        <button
                          onClick={() => {
                            setOpenPostMenu(null);
                            // Handle report
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <Flag className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Report post</span>
                        </button>
                        <button
                          onClick={() => {
                            setOpenPostMenu(null);
                            // Handle mute user
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <VolumeOff className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-700">Mute {post.author.name}</span>
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Milestone Badge */}
          {post.type === 'milestone' && post.milestone && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-4 p-4 rounded-xl"
              style={{ backgroundColor: `${post.milestone.color}15` }}
              onClick={() => setShowConfetti(post.id)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${post.milestone.color}30` }}
                >
                  <post.milestone.icon 
                    className="w-6 h-6" 
                    style={{ color: post.milestone.color }}
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg" style={{ color: post.milestone.color }}>
                    {post.milestone.title}
                  </h4>
                  <p className="text-sm text-gray-600">{post.milestone.description}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Post Content */}
          <div className="mb-4">
            <p className="text-gray-800 whitespace-pre-line">{displayContent}</p>
            {shouldTruncate && (
              <button
                onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-2"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>

          {/* Image Grid */}
          {post.type === 'image' && post.images && (
            <div className={`grid gap-2 mb-4 ${
              post.images.length === 1 ? 'grid-cols-1' :
              post.images.length === 2 ? 'grid-cols-2' :
              post.images.length === 3 ? 'grid-cols-3' :
              'grid-cols-2'
            }`}>
              {post.images.map((img, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className={`relative cursor-pointer rounded-lg overflow-hidden ${
                    post.images!.length > 3 && idx === 0 ? 'col-span-2' : ''
                  }`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img
                    src={img}
                    alt={`Post image ${idx + 1}`}
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: post.images!.length === 1 ? '16/9' : '1/1' }}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Video Player */}
          {post.type === 'video' && post.video && (
            <div className="relative mb-4 rounded-lg overflow-hidden bg-black">
              <video
                ref={el => videoRefs.current[post.id] = el}
                className="w-full"
                poster={post.video.thumbnail}
                muted
              >
                <source src={post.video.url} type="video/mp4" />
              </video>
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => toggleVideo(post.id)}
                  className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors"
                >
                  {playingVideo === post.id ? (
                    <Pause className="w-8 h-8 text-gray-900" />
                  ) : (
                    <Play className="w-8 h-8 text-gray-900 ml-1" />
                  )}
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded">
                  {post.video.duration}
                </span>
                <button
                  onClick={() => toggleMute(post.id)}
                  className="w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
                >
                  {mutedVideo === post.id ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Poll */}
          {post.type === 'poll' && post.poll && (
            <div className="mb-4 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-4">{post.poll.question}</h4>
              <div className="space-y-3">
                {post.poll.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => post.poll!.userVoted === null && handleVote(post.id, idx)}
                    disabled={post.poll!.userVoted !== null}
                    className={`w-full text-left p-3 rounded-lg transition-all relative overflow-hidden ${
                      post.poll!.userVoted === idx
                        ? 'bg-blue-500 text-white'
                        : post.poll!.userVoted !== null
                        ? 'bg-gray-200'
                        : 'bg-white hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    <div
                      className="absolute inset-0 bg-blue-100 transition-all"
                      style={{ 
                        width: post.poll!.userVoted !== null ? `${option.percentage}%` : '0%',
                        opacity: 0.3,
                      }}
                    />
                    <div className="relative flex items-center justify-between">
                      <span className="font-medium">{option.text}</span>
                      {post.poll!.userVoted !== null && (
                        <span className="font-bold">{option.percentage}%</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-3">
                {post.poll.totalVotes} {post.poll.totalVotes === 1 ? 'vote' : 'votes'}
              </p>
            </div>
          )}

          {/* Document */}
          {post.type === 'document' && post.document && (
            <div className="mb-4 p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">{post.document.title}</h4>
                  <p className="text-sm text-gray-600">
                    {post.document.type} • {post.document.size}
                  </p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}

          {/* Engagement Stats */}
          <div className="flex items-center gap-6 py-3 border-t border-b border-gray-200 text-sm text-gray-600">
            <span>{post.likes} likes</span>
            <span>{post.comments} comments</span>
            <span>{post.shares} shares</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-around pt-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLike(post.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors ${
                post.isLiked ? 'text-red-500' : 'text-gray-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">Like</span>
            </motion.button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Comment</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Share</span>
            </button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBookmark(post.id)}
              className={`hidden md:flex p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                post.isBookmarked ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          {/* Comment Input */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                YU
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={commentText[post.id] || ''}
                  onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-2 pr-20 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                    <Smile className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                    <Send className="w-5 h-5 text-blue-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <style>{`
        /* Mobile optimizations */
        @media (max-width: 1024px) {
          /* Reduced font sizes by 25% */
          .mobile-h1 { font-size: 24px !important; } /* from 32px */
          .mobile-h2 { font-size: 20px !important; } /* from 27px */
          .mobile-h3 { font-size: 18px !important; } /* from 24px */
          .mobile-body { font-size: 14px !important; } /* from 16-18px */
          .mobile-small { font-size: 12px !important; } /* from 14px */
          .mobile-xs { font-size: 11px !important; } /* from 12-13px */
          
          /* Card padding reduction */
          .mobile-card { padding: 12px !important; }
          .mobile-card-lg { padding: 16px !important; }
          
          /* Touch targets */
          .touch-target {
            min-width: 44px;
            min-height: 44px;
          }
          
          /* Hide on mobile */
          .hide-mobile { display: none !important; }
          
          /* Full width on mobile */
          .mobile-full { width: 100% !important; }
          
          /* Image auto-resize */
          .mobile-img {
            width: 100% !important;
            height: auto !important;
            object-fit: cover;
          }
        }
      `}</style>

      {/* Stories Section - Horizontal Scroll */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 mb-0 lg:mb-6">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
              onClick={() => {
                if (story.id === 1) {
                  // Handle add story functionality
                  console.log('Add story clicked');
                } else {
                  setSelectedStoryIndex(index);
                  setShowStoryViewer(true);
                }
              }}
            >
              <div className={`relative ${story.id === 1 ? '' : story.viewed ? 'opacity-60' : ''}`}>
                {story.id === 1 ? (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-dashed border-gray-400">
                    <Plus className="w-6 h-6 text-gray-600" />
                  </div>
                ) : (
                  <div className={`p-0.5 rounded-full ${story.viewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-600'}`}>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-white">
                      {story.avatar}
                    </div>
                  </div>
                )}
                {story.id !== 1 && !story.viewed && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <span className="text-xs text-gray-600 text-center max-w-[70px] truncate">
                {story.author}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 px-4 lg:px-[24px] py-[0px]">
        {/* Center Feed */}
        <main className="lg:col-span-8 space-y-4 lg:space-y-6 w-full overflow-hidden">
          {/* Feed Filters and Create Button Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white rounded-xl mobile-card-lg p-4 lg:px-4 lg:py-3 shadow-sm w-full max-w-full">
            {/* Filter Dropdown Button */}
            <div className="relative flex-1 min-w-0">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="w-full touch-target sm:w-auto flex items-center justify-between gap-3 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors min-w-[180px]"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <span className="font-bold text-gray-900 text-sm">
                    {activeFilter}
                  </span>
                </div>
                <ChevronRight 
                  className={`w-4 h-4 text-gray-600 transition-transform ${showFilterDropdown ? 'rotate-90' : ''}`} 
                />
              </button>
              
              {/* Filter Dropdown */}
              <AnimatePresence>
                {showFilterDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 sm:right-auto sm:min-w-[250px] mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
                  >
                    {feedFilters.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setActiveFilter(filter);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                          activeFilter === filter ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          activeFilter === filter 
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                        style={activeFilter === filter ? {
                          background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})`
                        } : {}}
                        >
                          {filter === 'Following' && <Users className="w-4 h-4" />}
                          {filter === 'Discover' && <Search className="w-4 h-4" />}
                          {filter === 'Trending' && <TrendingUp className="w-4 h-4" />}
                          {filter === 'Saved' && <Bookmark className="w-4 h-4" />}
                        </div>
                        <span className={`font-medium text-sm ${
                          activeFilter === filter ? 'text-gray-900 font-bold' : 'text-gray-700'
                        }`}>
                          {filter}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Create Event Button - Expert & Investor Only */}
            {(userType === 'expert' || userType === 'investor') && (
              <button
                onClick={() => setShowEventModal(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center gap-2 transition-all"
              >
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="whitespace-nowrap">Create Event</span>
              </button>
            )}

            {/* Create Post Button - Separate and Prominent */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              style={{
                background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})`,
              }}
            >
              <Plus className="w-5 h-5" />
              <span className="whitespace-nowrap">Create Post</span>
            </button>
          </div>

          {/* Post Feed */}
          <div className="space-y-6">
            {posts.map((post, index) => renderPost(post, index))}
          </div>

          {/* Load More */}
          <div className="text-center py-6">
            <button className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm">
              Load More Posts
            </button>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block lg:col-span-4 space-y-6">
          {/* Trending Hashtags */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Trending Topics
            </h3>
            <div className="space-y-3">
              {trendingTopics.map((topic, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <div>
                    <div className="font-bold text-blue-600">{topic.tag}</div>
                    <div className="text-sm text-gray-600">{topic.posts.toLocaleString()} posts</div>
                  </div>
                  <div className="text-sm font-bold text-green-600">{topic.trend}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Suggested Connections */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-500" />
              Suggested Connections
            </h3>
            <div className="space-y-4">
              {suggestedConnections.map((person, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {person.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 truncate">{person.name}</h4>
                    <p className="text-xs text-gray-600 truncate">{person.title}</p>
                    <p className="text-xs text-gray-500">{person.mutual}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Post Type Selector */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                  {postTypes.map((type) => (
                    <button
                      key={type.type}
                      onClick={() => setSelectedPostType(type.type)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        selectedPostType === type.type
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <type.icon 
                        className="w-6 h-6" 
                        style={{ color: selectedPostType === type.type ? type.color : '#6b7280' }}
                      />
                      <span className={`text-xs font-medium ${
                        selectedPostType === type.type ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    YU
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Your Name</h3>
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
                    {/* AI Enhance Button */}
                    <button 
                      onClick={() => {
                        setShowAIEnhancer(true);
                        // Mock AI enhancement
                        setAiEnhancedVersions([
                          "🚀 Exciting update: Just closed our seed round! Huge thanks to the NextIgnition community for the invaluable mentorship. Here's my biggest takeaway about pitching to VCs...",
                          "Big milestone achieved! 🎉 Successfully closed our seed round. The NextIgnition community played a crucial role in our journey. Key lessons I learned about VC pitches...",
                          "Thrilled to announce we've completed our seed round! 💰 Grateful for all the support from NextIgnition mentors. Here are the top insights I gained from pitching to investors..."
                        ]);
                      }}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={posts.find(p => p.images)?. images?.[selectedImage]}
              alt="Full size"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Enhancer Modal */}
      <AnimatePresence>
        {showAIEnhancer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
            onClick={() => setShowAIEnhancer(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#6666FF] to-[#F78405] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  <h2 className="text-xl font-bold">AI Enhanced Versions</h2>
                </div>
                <button
                  onClick={() => setShowAIEnhancer(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Select one of the AI-enhanced versions below, or continue editing:
                </p>

                {/* Enhanced Versions */}
                <div className="space-y-4">
                  {aiEnhancedVersions.map((version, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-5 border-2 border-gray-200 rounded-xl hover:border-[#6666FF] transition-all cursor-pointer group relative"
                      onClick={() => {
                        setPostContent(version);
                        setShowAIEnhancer(false);
                      }}
                    >
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="px-3 py-1 bg-[#6666FF] text-white text-xs font-medium rounded-full">
                          Select
                        </div>
                      </div>
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6666FF] to-[#F78405] flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-[#6666FF] mb-1">Version {idx + 1}</div>
                          <p className="text-gray-800">{version}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowAIEnhancer(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Keep Original
                  </button>
                  <button
                    onClick={() => {
                      // Generate new versions
                      setAiEnhancedVersions([
                        "Looking for a talented technical co-founder? 🚀 Join us in revolutionizing carbon credit trading! We're building a blockchain-based marketplace...",
                        "Passionate about climate tech? We're seeking an experienced blockchain developer to co-found GreenScale, a revolutionary carbon credit platform...",
                        "Opportunity alert! 🌱 Technical co-founder needed for sustainable blockchain startup. Transform carbon credit trading with cutting-edge technology..."
                      ]);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#6666FF] to-[#F78405] text-white rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate New Versions
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CreateEventModal 
        isOpen={showEventModal} 
        onClose={() => setShowEventModal(false)} 
        userType={userType}
      />

      {/* Story Viewer */}
      {showStoryViewer && (
        <StoryViewer
          stories={stories.filter(s => s.id !== 1)} // Exclude "Add Story"
          initialIndex={selectedStoryIndex - 1} // Adjust for filtered array
          onClose={() => setShowStoryViewer(false)}
        />
      )}
    </div>
  );
}