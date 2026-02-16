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
import api from '../services/api';
import { getCurrentUser } from '../services/authService';

type UserRole = 'founder' | 'expert' | 'investor';

interface Message {
  id: string;
  senderId: string;
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
  id: string;
  participantId: string;
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
  userId?: number;
}

type ApiUser = {
  _id: string;
  name?: string;
  avatar?: string;
  role?: string;
  isVerified?: boolean;
};

type ApiConversation = {
  _id: string;
  participants: ApiUser[];
  lastMessage?: {
    content?: string;
    sender?: string;
    timestamp?: string;
  };
  unreadCount?: Record<string, number>;
  updatedAt?: string;
};

type ApiMessage = {
  _id: string;
  conversationId: string;
  sender: ApiUser | string;
  receiver: string;
  content: string;
  isRead: boolean;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  createdAt: string;
};

export function MessagingPage({
  userRole,
  userId
}: MessagingPageProps) {
  const currentUser = getCurrentUser();
  const currentUserId: string | null = currentUser?._id || currentUser?.id || null;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'pinned'>('all');
  const [isInfoSidebarOpen, setIsInfoSidebarOpen] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const mapApiConversationToUi = (c: ApiConversation): Conversation | null => {
    if (!currentUserId) return null;
    const other = (c.participants || []).find((p) => p?._id && p._id !== currentUserId);
    if (!other?._id) return null;

    const lastTimestamp = c.lastMessage?.timestamp || c.updatedAt;
    const ts = lastTimestamp ? new Date(lastTimestamp) : null;

    return {
      id: c._id,
      participantId: other._id,
      participantName: other.name || 'User',
      participantRole: other.role || '',
      participantCompany: '',
      avatar: (other.avatar || (other.name ? other.name.charAt(0).toUpperCase() : 'U')) as string,
      lastMessage: c.lastMessage?.content || '',
      timestamp: ts ? ts.toLocaleString() : '',
      unreadCount: c.unreadCount?.[currentUserId] || 0,
      online: false,
      pinned: false,
      archived: false,
      verified: !!other.isVerified,
      badge: (other.role as any) || undefined,
    };
  };

  const mapApiMessageToUi = (m: ApiMessage): Message => {
    const senderId = typeof m.sender === 'string' ? m.sender : m.sender?._id;
    const base: Message = {
      id: m._id,
      senderId: senderId || '',
      text: m.content,
      timestamp: new Date(m.createdAt),
      read: !!m.isRead,
      type: m.type === 'image' ? 'image' : m.type === 'file' ? 'file' : 'text',
      fileUrl: m.fileUrl,
      fileName: m.type === 'file' ? 'File' : undefined,
    };
    return base;
  };

  const fetchConversations = async () => {
    if (!currentUserId) {
      setConversations([]);
      return;
    }

    setLoadingConversations(true);
    setError('');
    try {
      const resp = await api.get<ApiConversation[]>('/messages/conversations');
      const mapped = (resp.data || [])
        .map(mapApiConversationToUi)
        .filter((x): x is Conversation => Boolean(x));
      setConversations(mapped);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch conversations';
      setError(msg);
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    setError('');
    try {
      const resp = await api.get<ApiMessage[]>(`/messages/${conversationId}`);
      setMessages((resp.data || []).map(mapApiMessageToUi));
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch messages';
      setError(msg);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const markConversationRead = async (conversationId: string) => {
    try {
      await api.put(`/messages/${conversationId}/read`);
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
      );
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [currentUserId]);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.participantCompany.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && conv.unreadCount > 0) ||
                         (filter === 'pinned' && conv.pinned);
    return matchesSearch && matchesFilter;
  });

  const sendMessage = async () => {
    const text = messageInput.trim();
    if (!text) return;
    if (!activeConversation) return;
    if (!currentUserId) return;

    setError('');
    try {
      const resp = await api.post<ApiMessage>('/messages/send', {
        receiverId: activeConversation.participantId,
        content: text,
        type: 'text',
      });

      const created = mapApiMessageToUi(resp.data);
      setMessages((prev) => [...prev, created]);
      setMessageInput('');
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? { ...c, lastMessage: text, timestamp: new Date().toLocaleString() }
            : c
        )
      );
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to send message';
      setError(msg);
    }
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
    fetchMessages(conv.id);
    markConversationRead(conv.id);
    setShowMobileChat(true);
  };

  const handleBackToList = () => {
    setShowMobileChat(false);
    setIsInfoSidebarOpen(false);
  };

  const pipelineStageLabel = activeConversation?.pipelineStage
    ? activeConversation.pipelineStage.charAt(0).toUpperCase() + activeConversation.pipelineStage.slice(1)
    : '';

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

          {error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

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
        {loadingConversations && conversations.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">Loading conversations...</div>
        ) : (
          <>
            {filteredConversations.map(conv => (
              <motion.div
                key={conv.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                onClick={() => handleConversationClick(conv)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors relative ${
                  activeConversation?.id === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <ConversationItem
                  conversation={conv}
                  isActive={activeConversation?.id === conv.id}
                  onClick={() => handleConversationClick(conv)}
                />
              </motion.div>
            ))}
            {filteredConversations.length === 0 && (
              <div className="p-4 text-sm text-gray-600">No conversations yet.</div>
            )}
          </>
        )}
      </div>

      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-white h-full overflow-hidden ${showMobileChat ? 'flex' : 'hidden lg:flex'}`}>
        {activeConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToList}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {activeConversation.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-gray-900 truncate">{activeConversation.participantName}</h2>
                    {activeConversation.verified && (
                      <CheckCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 truncate">{activeConversation.participantRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setIsInfoSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 hide-scrollbar">
              {loadingMessages && messages.length === 0 ? (
                <div className="text-sm text-gray-600">Loading messages...</div>
              ) : null}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                    message.senderId === currentUserId
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    {message.text && <p className="text-sm whitespace-pre-wrap">{message.text}</p>}
                    <div className={`text-[10px] mt-1 ${message.senderId === currentUserId ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

              {messages.length === 0 && !loadingMessages && (
                <div className="text-sm text-gray-600">No messages yet.</div>
              )}
            </div>

            <div className="border-t border-gray-200 bg-white p-3 flex items-end gap-2 flex-shrink-0">
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
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
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
                        {pipelineStageLabel}
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