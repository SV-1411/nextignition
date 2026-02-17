import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { getCurrentUser } from '../services/authService';
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  User,
  Check,
  CheckCheck,
  X,
  Loader2,
  MessageSquare,
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  role: string;
  roles?: string[];
  avatar?: string;
  isVerified?: boolean;
}

const FALLBACK_RECOMMENDED_USERS: User[] = [
  { _id: 'recommended-1', name: 'Recommended Founder', role: 'founder', isVerified: true },
  { _id: 'recommended-2', name: 'Recommended Expert', role: 'expert', isVerified: true },
  { _id: 'recommended-3', name: 'Recommended Co-Founder', role: 'co-founder', isVerified: false },
];

interface Message {
  _id: string;
  conversationId: string;
  sender: User;
  content: string;
  attachments?: {
    url: string;
    originalName: string;
    mimeType: string;
    size: number;
  }[];
  readBy: string[];
  createdAt: string;
}

interface Conversation {
  _id: string;
  participants: User[];
  lastMessage?: {
    content: string;
    sender: User;
    timestamp: string;
  };
  lastMessageAt?: string;
  type: 'direct' | 'group';
  unreadCount?: { [key: string]: number };
  createdAt?: string;
  updatedAt?: string;
}

interface DirectMessagingProps {
  onClose?: () => void;
  initialUserId?: string;
}

export default function DirectMessaging({ onClose, initialUserId }: DirectMessagingProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [recommendedUsers, setRecommendedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load current user
  useEffect(() => {
    const user = getCurrentUser();
    console.log('DirectMessaging: Loaded currentUser from storage:', user);
    setCurrentUser(user);
  }, []);

  // Load conversations
  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  // Handle initialUserId (start conversation with specific user)
  const [processedInitialUserId, setProcessedInitialUserId] = useState<string | null>(null);
  
  useEffect(() => {
    if (initialUserId && currentUser && initialUserId !== processedInitialUserId) {
      setProcessedInitialUserId(initialUserId);
      startConversationWithUser(initialUserId);
    }
  }, [initialUserId, currentUser, processedInitialUserId]);

  // Load all messaging users when search is opened
  useEffect(() => {
    if (showUserSearch) {
      loadAllMessagingUsers();
    }
  }, [showUserSearch]);

  const loadAllMessagingUsers = async () => {
    console.log('loadAllMessagingUsers starting...');
    try {
      setIsSearching(true);
      setSearchError(null);
      
      // Initialize with fallbacks so UI is never empty
      setRecommendedUsers(FALLBACK_RECOMMENDED_USERS);
      
      const response = await api.get('/messaging/users/messaging');
      console.log('API Users response:', response.data);
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setSearchResults(response.data);
        setRecommendedUsers(response.data);
      } else {
        console.log('API returned empty or non-array, staying with fallbacks');
      }
    } catch (error: any) {
      console.error('Failed to load users from API:', error);
      setSearchError(error.response?.data?.message || 'Failed to load real users');
      // Already has fallbacks from line above
    } finally {
      setIsSearching(false);
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching conversations...');
      const response = await api.get('/messaging/conversations');
      console.log('Fetched conversations:', response.data);
      setConversations(response.data);
      
      // If we have an initialUserId, we don't select the first conversation
      if (!initialUserId && response.data.length > 0 && !selectedConversation) {
        selectConversation(response.data[0]);
      }
    } catch (error: any) {
      console.error('Failed to fetch conversations:', error);
      if (error.response?.status === 401) {
        console.log('Unauthorized access - token might be invalid');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const startConversationWithUser = async (userId: string) => {
    // 1. Immediately update UI state
    setShowUserSearch(false);
    setSearchQuery('');

    // 2. Handle mock/fallback users
    if (userId.startsWith('recommended-')) {
      const fallbackUser = FALLBACK_RECOMMENDED_USERS.find(u => u._id === userId);
      if (fallbackUser) {
        const mockConversation: Conversation = {
          _id: `mock-conv-${userId}`,
          participants: [
            { _id: currentUser?.id || 'me', name: currentUser?.name || 'You', role: currentUser?.role || 'member' },
            fallbackUser
          ],
          type: 'direct',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setSelectedConversation(mockConversation);
        setShowChat(true);
        setMessages([]);
        return;
      }
    }

    // 3. Real API call for actual users
    try {
      setIsLoading(true);
      const response = await api.post('/messaging/conversations', { otherUserId: userId });
      const conversation = response.data;
      
      setConversations(prev => {
        const exists = prev.find(c => c._id === conversation._id);
        if (exists) return prev;
        return [conversation, ...prev];
      });
      
      // Select the conversation which triggers messages fetch and sets showChat(true)
      await selectConversation(conversation);
    } catch (error: any) {
      console.error('Failed to start conversation:', error);
      alert(error.response?.data?.message || 'Failed to start conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      loadAllMessagingUsers();
      return;
    }
    
    try {
      setIsSearching(true);
      setSearchError(null);
      const response = await api.get(`/messaging/users/search?query=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
    } catch (error: any) {
      console.error('Failed to search users:', error);
      setSearchError(error.response?.data?.message || 'Search failed');
      setRecommendedUsers(FALLBACK_RECOMMENDED_USERS);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, searchUsers]);

  const selectConversation = async (conversation: Conversation) => {
    console.log('Selecting conversation:', conversation);
    setSelectedConversation(conversation);
    setShowChat(true);
    setShowUserSearch(false);
    setMessages([]);
    
    try {
      const response = await api.get(`/messaging/conversations/${conversation._id}/messages`);
      console.log('Fetched messages:', response.data);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!selectedConversation || (!messageInput.trim() && !fileInputRef.current?.files?.length)) return;
    
    try {
      setIsSending(true);
      const response = await api.post(
        `/messaging/conversations/${selectedConversation._id}/messages`,
        { content: messageInput.trim() }
      );
      
      setMessages((prev) => [...prev, response.data]);
      setMessageInput('');
      
      // Update conversation last message
      setConversations((prev) =>
        prev.map((c) =>
          c._id === selectedConversation._id
            ? {
                ...c,
                lastMessage: {
                  content: response.data.content,
                  sender: response.data.sender,
                  timestamp: response.data.createdAt,
                },
                lastMessageAt: response.data.createdAt,
              }
            : c
        )
      );
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedConversation) return;
    
    try {
      setIsSending(true);
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append('files', file));
      
      const response = await api.post(
        `/messaging/conversations/${selectedConversation._id}/attachments`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      setMessages((prev) => [...prev, response.data]);
      
      // Update conversation
      setConversations((prev) =>
        prev.map((c) =>
          c._id === selectedConversation._id
            ? {
                ...c,
                lastMessage: {
                  content: 'Sent attachments',
                  sender: response.data.sender,
                  timestamp: response.data.createdAt,
                },
                lastMessageAt: response.data.createdAt,
              }
            : c
        )
      );
    } catch (error) {
      console.error('Failed to upload attachments:', error);
    } finally {
      setIsSending(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getOtherParticipant = (conversation: Conversation): User | null => {
    if (!currentUser) return null;
    return conversation.participants.find((p) => p._id !== currentUser.id) || null;
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString();
  };

  // Mobile back button handler
  const handleBack = () => {
    if (showChat) {
      setShowChat(false);
      setSelectedConversation(null);
    } else if (showUserSearch) {
      setSearchQuery('');
      setShowUserSearch(false);
    } else if (onClose) {
      onClose();
    }
  };

  // Render conversation list
  const renderConversationList = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Messages</h2>
        <button
          onClick={() => {
            setSearchQuery('');
            setShowUserSearch(true);
          }}
          className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>

      {/* Search Toggle */}
      <div className="p-3 border-b">
        <button
          onClick={() => {
            setSearchQuery('');
            setShowUserSearch(true);
          }}
          className="w-full flex items-center gap-2 p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span className="text-sm">Search users to message...</span>
        </button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 mb-2">No conversations yet</p>
            <p className="text-sm text-gray-400">Search for founders, co-founders, or experts to start messaging</p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const otherUser = getOtherParticipant(conversation);
            if (!otherUser) return null;
            
            return (
              <button
                key={conversation._id}
                onClick={() => selectConversation(conversation)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b ${
                  selectedConversation?._id === conversation._id ? 'bg-indigo-50' : ''
                }`}
              >
                <div className="relative">
                  {otherUser.avatar ? (
                    <img
                      src={otherUser.avatar}
                      alt={otherUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                  )}
                  {otherUser.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{otherUser.name}</h3>
                    {conversation.lastMessageAt && (
                      <span className="text-xs text-gray-400">
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 capitalize">{otherUser.role}</p>
                  {conversation.lastMessage && (
                    <p className="text-sm text-gray-600 truncate mt-0.5">
                      {conversation.lastMessage.sender._id === currentUser?.id ? 'You: ' : ''}
                      {conversation.lastMessage.content}
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  const renderUserSearch = () => (
    <div className="flex flex-col h-full bg-white relative z-[60]">
      <div className="p-4 border-b flex items-center gap-3 bg-white sticky top-0 z-10">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Back clicked in search');
            setShowUserSearch(false);
            setSearchQuery('');
          }} 
          className="p-2 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search people to message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-none"
              autoFocus
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm text-gray-500 animate-pulse">Finding people...</p>
          </div>
        ) : searchError ? (
          <div className="p-4">
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-center">
              <p className="text-red-600 font-semibold mb-1">Search limited</p>
              <p className="text-xs text-red-500">{searchError}</p>
              <button 
                onClick={() => loadAllMessagingUsers()}
                className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Try Again
              </button>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase px-3 py-2 tracking-wider">Suggested People</h3>
              {FALLBACK_RECOMMENDED_USERS.map((user) => (
                <button
                  key={user._id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Selected fallback user:', user.name);
                    startConversationWithUser(user._id);
                  }}
                  className="w-full p-3 flex items-center gap-3 hover:bg-indigo-50 rounded-2xl transition-all group mt-1"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-transparent group-hover:border-indigo-200">
                    <User className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-700">{user.name}</h4>
                    <p className="text-xs text-gray-500 capitalize font-medium">{user.role}</p>
                  </div>
                  <MessageSquare className="w-5 h-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          </div>
        ) : (searchQuery.trim() === '' || searchResults.length === 0) ? (
          <div className="p-2">
            <div className="px-3 py-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {searchQuery.trim() === '' ? 'People You Can Message' : 'No matches found - try these people'}
              </h3>
            </div>
            <div className="space-y-1">
              {(recommendedUsers && recommendedUsers.length > 0 ? recommendedUsers : FALLBACK_RECOMMENDED_USERS).slice(0, 20).map((user) => (
                <button
                  key={user._id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Selected user from recommended list:', user.name);
                    startConversationWithUser(user._id);
                  }}
                  className="w-full p-3 flex items-center gap-3 hover:bg-indigo-50 rounded-2xl transition-all group"
                >
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-indigo-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-transparent group-hover:border-indigo-200">
                        <User className="w-6 h-6 text-indigo-600" />
                      </div>
                    )}
                    {user.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-white">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-700">{user.name}</h4>
                    <p className="text-xs text-gray-500 capitalize font-medium">{user.role || 'Member'}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="p-2">
            <div className="px-3 py-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Search Results</h3>
            </div>
            <div className="space-y-1">
              {searchResults.map((user) => (
                <button
                  key={user._id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Selected user from search:', user.name);
                    startConversationWithUser(user._id);
                  }}
                  className="w-full p-3 flex items-center gap-3 hover:bg-indigo-50 rounded-2xl transition-all group"
                >
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-indigo-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-transparent group-hover:border-indigo-200">
                        <User className="w-6 h-6 text-indigo-600" />
                      </div>
                    )}
                    {user.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-white">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-700">{user.name}</h4>
                    <p className="text-xs text-gray-500 capitalize font-medium">{user.role || 'Member'}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-all">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );

  // Render chat
  const renderChat = () => {
    if (!selectedConversation) return null;
    
    const otherUser = getOtherParticipant(selectedConversation);
    if (!otherUser) return null;

    return (
      <div className="flex flex-col h-full bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center gap-3">
          {isMobile && (
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          <div className="relative">
            {otherUser.avatar ? (
              <img
                src={otherUser.avatar}
                alt={otherUser.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
            )}
            {otherUser.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium">{otherUser.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{otherUser.role}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Video className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
              <p>Start a conversation with {otherUser.name}</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isMe = message.sender._id === currentUser?.id;
              const showDate = index === 0 || 
                formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt);
              
              return (
                <div key={message._id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  )}
                  
                  <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${isMe ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-2xl px-4 py-2`}>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="space-y-2 mb-2">
                          {message.attachments.map((attachment, idx) => (
                            <a
                              key={idx}
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2 p-2 rounded-lg ${isMe ? 'bg-indigo-500' : 'bg-gray-200'} hover:opacity-80 transition-opacity`}
                            >
                              <Paperclip className="w-4 h-4" />
                              <span className="text-sm truncate max-w-[150px]">
                                {attachment.originalName}
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
                      
                      {message.content !== 'Sent attachments' && (
                        <p className="text-sm">{message.content}</p>
                      )}
                      
                      <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                        <span className="text-xs opacity-70">
                          {formatTime(message.createdAt)}
                        </span>
                        {isMe && (
                          <span className="text-xs opacity-70">
                            {message.readBy.length > 1 ? (
                              <CheckCheck className="w-3 h-3" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
              className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
            >
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 p-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSending}
            />
            
            <button
              onClick={sendMessage}
              disabled={isSending || (!messageInput.trim() && !fileInputRef.current?.files?.length)}
              className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Mobile layout
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        {showUserSearch ? renderUserSearch() : showChat ? renderChat() : renderConversationList()}
      </div>
    );
  }

  // Desktop layout - inline (not modal)
  return (
    <div className="h-full w-full bg-white flex overflow-hidden">
      {/* Left sidebar */}
      <div className="w-80 border-r flex-shrink-0">
        {showUserSearch ? renderUserSearch() : renderConversationList()}
      </div>
      
      {/* Right chat area */}
      <div className="flex-1 min-w-0">
        {selectedConversation ? (
          renderChat()
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium">Select a conversation</p>
            <p className="text-sm text-gray-400">or search for someone to message</p>
          </div>
        )}
      </div>
    </div>
  );
}
