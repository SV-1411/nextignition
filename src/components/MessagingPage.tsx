import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Mic,
  Send,
  Smile,
  Download,
  Star,
  Archive,
  Trash2,
  Check,
  CheckCheck,
  Circle,
  Pin,
  Bell,
  BellOff,
  AlertCircle,
  Calendar,
  CreditCard,
  FolderOpen,
  TrendingUp,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArrowLeft,
  Plus,
  Camera,
  Folder,
  Upload,
  Play,
  Pause,
  Eye,
  Target,
  DollarSign,
  BookOpen,
  Shield,
  Users,
  Building,
  MessageCircle
} from 'lucide-react';
import { brandColors } from '../utils/colors';

type UserRole = 'founder' | 'expert' | 'investor';

interface Message {
  id: number;
  senderId: number;
  text?: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'file' | 'voice' | 'meeting' | 'post';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  duration?: string;
}

interface Conversation {
  id: number;
  participantId: number;
  participantName: string;
  participantRole: string;
  participantCompany: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  online: boolean;
  pinned: boolean;
  archived: boolean;
  verified: boolean;
  badge?: 'expert' | 'investor' | 'founder' | 'client' | 'prospect';
  pipelineStage?: 'interested' | 'review' | 'negotiating' | 'invested' | 'passed';
  startupStage?: string;
  fundingAsk?: string;
}

interface MessagingPageProps {
  userRole: UserRole;
  userId: number;
}

// Mock data for conversations
const mockConversations: Conversation[] = [
  {
    id: 1,
    participantId: 2,
    participantName: 'Sarah Chen',
    participantRole: 'Founder',
    participantCompany: 'TechFlow AI',
    avatar: 'SC',
    lastMessage: 'Thanks! Looking forward to our call next week.',
    timestamp: '2m ago',
    unreadCount: 0,
    online: true,
    pinned: true,
    archived: false,
    verified: true,
    badge: 'founder',
    pipelineStage: 'negotiating',
    startupStage: 'Series A',
    fundingAsk: '$5M'
  },
  {
    id: 2,
    participantId: 3,
    participantName: 'Michael Rodriguez',
    participantRole: 'Growth Expert',
    participantCompany: 'Scale Advisors',
    avatar: 'MR',
    lastMessage: 'I can help with your go-to-market strategy',
    timestamp: '1h ago',
    unreadCount: 3,
    online: true,
    pinned: false,
    archived: false,
    verified: true,
    badge: 'expert'
  },
  {
    id: 3,
    participantId: 4,
    participantName: 'Jennifer Park',
    participantRole: 'Angel Investor',
    participantCompany: 'Park Ventures',
    avatar: 'JP',
    lastMessage: 'Sent you the term sheet',
    timestamp: '3h ago',
    unreadCount: 1,
    online: false,
    pinned: true,
    archived: false,
    verified: true,
    badge: 'investor',
    pipelineStage: 'review'
  },
  {
    id: 4,
    participantId: 5,
    participantName: 'David Kim',
    participantRole: 'Founder',
    participantCompany: 'HealthTech Pro',
    avatar: 'DK',
    lastMessage: 'Can we schedule a demo?',
    timestamp: '5h ago',
    unreadCount: 0,
    online: false,
    pinned: false,
    archived: false,
    verified: false,
    badge: 'founder',
    startupStage: 'Seed',
    fundingAsk: '$1.5M'
  },
  {
    id: 5,
    participantId: 6,
    participantName: 'Lisa Wang',
    participantRole: 'Marketing Expert',
    participantCompany: 'Brand Boost',
    avatar: 'LW',
    lastMessage: 'Here are the campaign metrics',
    timestamp: '1d ago',
    unreadCount: 0,
    online: true,
    pinned: false,
    archived: false,
    verified: true,
    badge: 'expert'
  }
];

// Mock data for messages
const mockMessages: Message[] = [
  {
    id: 1,
    senderId: 2,
    text: 'Hi! Thanks for reviewing our pitch deck.',
    timestamp: new Date(Date.now() - 3600000),
    read: true,
    type: 'text'
  },
  {
    id: 2,
    senderId: 1,
    text: 'Of course! Your traction is impressive. I\'d love to learn more about your go-to-market strategy.',
    timestamp: new Date(Date.now() - 3500000),
    read: true,
    type: 'text'
  },
  {
    id: 3,
    senderId: 2,
    text: 'Great! Let me share our detailed GTM plan.',
    timestamp: new Date(Date.now() - 3400000),
    read: true,
    type: 'text'
  },
  {
    id: 4,
    senderId: 2,
    type: 'file',
    fileName: 'GTM_Strategy_2024.pdf',
    fileSize: '2.4 MB',
    timestamp: new Date(Date.now() - 3300000),
    read: true
  },
  {
    id: 5,
    senderId: 1,
    text: 'Perfect, I\'ll review this and get back to you with questions.',
    timestamp: new Date(Date.now() - 3000000),
    read: true,
    type: 'text'
  },
  {
    id: 6,
    senderId: 2,
    text: 'Sounds good! Also wanted to mention we just closed a partnership with Microsoft.',
    timestamp: new Date(Date.now() - 2000000),
    read: true,
    type: 'text'
  },
  {
    id: 7,
    senderId: 1,
    text: 'That\'s fantastic news! Congrats 🎉',
    timestamp: new Date(Date.now() - 1800000),
    read: true,
    type: 'text'
  },
  {
    id: 8,
    senderId: 1,
    text: 'Would you be available for a call next Tuesday at 2pm PST?',
    timestamp: new Date(Date.now() - 1200000),
    read: true,
    type: 'text'
  },
  {
    id: 9,
    senderId: 2,
    text: 'Thanks! Looking forward to our call next week.',
    timestamp: new Date(Date.now() - 120000),
    read: true,
    type: 'text'
  }
];

export function MessagingPage({
  userRole,
  userId
}: MessagingPageProps) {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'pinned'>('all');
  const [isInfoSidebarOpen, setIsInfoSidebarOpen] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.participantCompany.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && conv.unreadCount > 0) ||
                         (filter === 'pinned' && conv.pinned);
    return matchesSearch && matchesFilter;
  });

  const sendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      senderId: userId,
      text: messageInput,
      timestamp: new Date(),
      read: false,
      type: 'text'
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleConversationClick = (conv: Conversation) => {
    setActiveConversation(conv);
    setMessages(mockMessages);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setIsInfoSidebarOpen(false);
  };

  // Desktop View
  return (
    <div className="h-full lg:h-full flex bg-white rounded-[0px] border-0 lg:border border-gray-200 overflow-hidden">
      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Conversations Sidebar */}
      <div className={`w-full lg:w-80 border-r border-gray-200 flex flex-col bg-white h-full overflow-hidden flex-shrink-0 ${showMobileChat ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-lg border-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilter('pinned')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'pinned' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pinned
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {/* Pinned Section */}
          {filteredConversations.some(c => c.pinned) && (
            <div className="p-3 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Pinned</p>
              {filteredConversations
                .filter(c => c.pinned)
                .map(conv => (
                  <ConversationItem
                    key={conv.id}
                    conversation={conv}
                    isActive={activeConversation?.id === conv.id}
                    onClick={() => handleConversationClick(conv)}
                  />
                ))}
            </div>
          )}

          {/* All Conversations */}
          <div className="p-3">
            {filteredConversations
              .filter(c => !c.pinned)
              .map(conv => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isActive={activeConversation?.id === conv.id}
                  onClick={() => handleConversationClick(conv)}
                />
              ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${showMobileChat ? 'flex' : 'hidden lg:flex'}`}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                {/* Back button for mobile */}
                <button
                  onClick={handleBackToList}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>

                <button 
                  onClick={() => setIsInfoSidebarOpen(!isInfoSidebarOpen)}
                  className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -ml-2 lg:ml-0 transition-colors"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {activeConversation.avatar}
                    </div>
                    {activeConversation.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{activeConversation.participantName}</h3>
                      {activeConversation.verified && (
                        <CheckCheck className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {activeConversation.participantRole} · {activeConversation.participantCompany}
                    </p>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto hide-scrollbar p-6 bg-gray-50">
              {messages.map((message, index) => {
                const isOwnMessage = message.senderId === userId;
                const showDateSeparator = index === 0 || 
                  new Date(messages[index - 1].timestamp).toDateString() !== new Date(message.timestamp).toDateString();

                return (
                  <div key={message.id}>
                    {showDateSeparator && (
                      <div className="flex items-center justify-center my-6">
                        <span className="px-4 py-1.5 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">
                          {new Date(message.timestamp).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 mb-6 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isOwnMessage && (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {activeConversation.avatar}
                        </div>
                      )}

                      <div className={`max-w-[60%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                        {message.type === 'text' && message.text && (
                          <div
                            className={`px-4 py-3 rounded-2xl ${
                              isOwnMessage
                                ? 'bg-blue-600 text-white rounded-br-md'
                                : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.text}</p>
                          </div>
                        )}

                        {message.type === 'file' && (
                          <div className={`p-4 rounded-2xl ${
                            isOwnMessage ? 'bg-blue-600 rounded-br-md' : 'bg-white rounded-bl-md shadow-sm'
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                isOwnMessage ? 'bg-blue-500' : 'bg-gray-100'
                              }`}>
                                <FileText className={`w-6 h-6 ${isOwnMessage ? 'text-white' : 'text-gray-600'}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${
                                  isOwnMessage ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {message.fileName}
                                </p>
                                <p className={`text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                                  {message.fileSize}
                                </p>
                              </div>
                              <button className={`p-2 rounded-lg hover:bg-opacity-20 hover:bg-black transition-colors ${
                                isOwnMessage ? 'text-white' : 'text-gray-600'
                              }`}>
                                <Download className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-1 px-1">
                          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                          {isOwnMessage && (
                            message.read ? (
                              <CheckCheck className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Check className="w-4 h-4 text-gray-400" />
                            )
                          )}
                        </div>
                      </div>

                      {isOwnMessage && (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          ME
                        </div>
                      )}
                    </motion.div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 bg-white fixed lg:relative bottom-[64px] lg:bottom-0 left-0 right-0 z-40 shadow-lg lg:shadow-none mt-[0px] mr-[0px] mb-[12px] ml-[0px] pt-[12px] pr-[12px] pb-[24px] pl-[12px]">
              <div className="flex items-end gap-2 max-w-7xl mx-auto">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors touch-target">
                  <Plus className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors touch-target">
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 max-h-24 overflow-y-auto hide-scrollbar">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="w-full bg-transparent border-none outline-none text-sm"
                  />
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-target"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 px-[16px] py-[12px]">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-sm text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Info Sidebar */}
      <AnimatePresence>
        {isInfoSidebarOpen && activeConversation && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-l border-gray-200 overflow-hidden absolute inset-0 z-20"
          >
            <div className="h-full overflow-y-auto hide-scrollbar">
              {/* Back Button Header */}
              <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                <button
                  onClick={() => setIsInfoSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="font-semibold text-gray-900">Profile</h2>
              </div>

              {/* Profile Section */}
              <div className="p-6 border-b border-gray-200">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                    {activeConversation.avatar}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{activeConversation.participantName}</h3>
                    {activeConversation.verified && (
                      <CheckCheck className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{activeConversation.participantRole}</p>
                  <p className="text-sm text-gray-500">{activeConversation.participantCompany}</p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    View Profile
                  </button>
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Star className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 border-b border-gray-200">
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <span>Start Voice Call</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm">
                    <Video className="w-5 h-5 text-gray-600" />
                    <span>Start Video Call</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span>Schedule Meeting</span>
                  </button>
                </div>
              </div>

              {/* Deal Info (for investors) */}
              {userRole === 'investor' && activeConversation.badge === 'founder' && (
                <div className="p-6 border-b border-gray-200">
                  <h4 className="font-semibold text-sm text-gray-900 mb-3">Deal Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Pipeline Stage</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        activeConversation.pipelineStage === 'negotiating' ? 'bg-orange-100 text-orange-700' :
                        activeConversation.pipelineStage === 'review' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {activeConversation.pipelineStage?.charAt(0).toUpperCase() + activeConversation.pipelineStage?.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Startup Stage</p>
                      <p className="text-sm font-medium">{activeConversation.startupStage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Funding Ask</p>
                      <p className="text-sm font-medium">{activeConversation.fundingAsk}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Options */}
              <div className="p-6">
                <h4 className="font-semibold text-sm text-gray-900 mb-3">Options</h4>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span>Mute Notifications</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm">
                    <Archive className="w-5 h-5 text-gray-600" />
                    <span>Archive Chat</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors text-sm text-red-600">
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Chat</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Conversation Item Component
function ConversationItem({ 
  conversation, 
  isActive, 
  onClick 
}: { 
  conversation: Conversation; 
  isActive: boolean; 
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`w-full p-3 rounded-lg mb-1 transition-all text-left ${
        isActive
          ? 'bg-blue-50 border border-blue-200'
          : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {conversation.avatar}
          </div>
          {conversation.online && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-gray-900 truncate">
                {conversation.participantName}
              </span>
              {conversation.verified && (
                <CheckCheck className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              )}
              {conversation.pinned && (
                <Pin className="w-3 h-3 text-gray-400 flex-shrink-0" />
              )}
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{conversation.timestamp}</span>
          </div>
          
          <p className="text-xs text-gray-600 mb-1 truncate">{conversation.participantRole}</p>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 truncate flex-1">{conversation.lastMessage}</p>
            {conversation.unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full flex-shrink-0">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}