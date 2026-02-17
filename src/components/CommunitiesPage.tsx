import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import api from '../services/api';
import { getCurrentUser } from '../services/authService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  userId: string | number;
}

interface ApiCommunity {
  _id: string;
  name: string;
  icon: string;
  roleExclusive?: string;
  unreadCount?: number;
  memberCount: number;
  description: string;
  allowedRoles: string[];
}

interface ApiChannel {
  _id: string;
  name: string;
  type: 'text' | 'voice';
  description: string;
  readOnly?: boolean;
  unreadCount?: number;
}

interface ApiMessage {
  _id: string;
  userId: {
    _id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  content: string;
  type?: 'text' | 'system' | 'milestone' | 'poll' | 'shared-post';
  attachments?: {
    url: string;
    originalName: string;
    mimeType: string;
    size: number;
  }[];
  sharedPostId?: any;
  reactions?: { emoji: string; count: number; users: string[] }[];
  threadCount?: number;
  pinned?: boolean;
  pollOptions?: { text: string; votes: number }[];
  milestoneData?: { title: string; description: string };
  createdAt: string;
}

interface ApiMember {
  _id: string;
  name: string;
  role: string;
  avatar?: string;
  isVerified?: boolean;
}

export function CommunitiesPage({ userRole, userId }: CommunitiesPageProps) {
  const [selectedCommunity, setSelectedCommunity] = useState<ApiCommunity | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<ApiChannel | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showMemberList, setShowMemberList] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [mobileView, setMobileView] = useState<'communities' | 'channels' | 'chat'>('communities');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDescription, setNewCommunityDescription] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['text-channels']);
  const [uploading, setUploading] = useState(false);
  
  // Data states
  const [communities, setCommunities] = useState<ApiCommunity[]>([]);
  const [channels, setChannels] = useState<ApiChannel[]>([]);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [members, setMembers] = useState<ApiMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const currentUser = getCurrentUser();

  // Fetch communities on mount
  useEffect(() => {
    fetchCommunities();
  }, []);

  // Fetch channels when community selected
  useEffect(() => {
    if (selectedCommunity) {
      fetchChannels(selectedCommunity._id);
      fetchMembers(selectedCommunity._id);
    }
  }, [selectedCommunity]);

  // Fetch messages when channel selected
  useEffect(() => {
    if (selectedChannel) {
      fetchMessages(selectedChannel._id);
    }
  }, [selectedChannel]);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const res = await api.get('/communities');
      setCommunities(res.data || []);
      setError('');
    } catch (err: any) {
      setError('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommunity = async () => {
    if (!newCommunityName.trim()) return;
    try {
      setLoading(true);
      await api.post('/communities', {
        name: newCommunityName.trim(),
        description: newCommunityDescription.trim(),
      });
      setIsCreateCommunityOpen(false);
      setNewCommunityName('');
      setNewCommunityDescription('');
      await fetchCommunities();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create community');
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async (communityId: string) => {
    try {
      const res = await api.get(`/communities/${communityId}/channels`);
      setChannels(res.data || []);
    } catch {
      setChannels([]);
    }
  };

  const fetchMessages = async (channelId: string) => {
    try {
      const res = await api.get(`/communities/channels/${channelId}/messages`);
      setMessages(res.data || []);
    } catch {
      setMessages([]);
    }
  };

  const fetchMembers = async (communityId: string) => {
    try {
      const res = await api.get(`/communities/${communityId}/members`);
      setMembers(res.data || []);
    } catch {
      setMembers([]);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChannel) return;
    
    try {
      await api.post(`/communities/channels/${selectedChannel._id}/messages`, {
        content: messageInput.trim(),
        type: 'text'
      });
      setMessageInput('');
      fetchMessages(selectedChannel._id);
    } catch {
      setError('Failed to send message');
    }
  };

  const formatTimestamp = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString();
  };

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case 'moderator':
        return <Crown className="w-3 h-3 text-yellow-500" />;
      case 'founder':
        return <Rocket className="w-3 h-3 text-blue-500" />;
      case 'expert':
        return <Handshake className="w-3 h-3 text-purple-500" />;
      case 'investor':
        return <Briefcase className="w-3 h-3 text-green-500" />;
      default:
        return null;
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const onlineMemberCount = members.length;

  const offlineMemberCount = 0;

  const currentChannels: ApiChannel[] = selectedCommunity ? channels : [];

  const handleUploadAttachments = async (files: FileList | null) => {
    if (!files || files.length === 0 || !selectedChannel) return;

    setUploading(true);
    try {
      const form = new FormData();
      Array.from(files).forEach((f) => form.append('files', f));

      await api.post(`/communities/channels/${selectedChannel._id}/attachments`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchMessages(selectedChannel._id);
      setError('');
    } catch (err) {
      setError('Failed to upload attachments');
    } finally {
      setUploading(false);
    }
  };

  const getPostSnapshotElementId = (messageId: string) => `shared-post-${messageId}`;

  const downloadSharedPostPng = async (messageId: string) => {
    const el = document.getElementById(getPostSnapshotElementId(messageId));
    if (!el) return;

    const canvas = await html2canvas(el as HTMLElement, { backgroundColor: '#ffffff', scale: 2 });
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `shared-post-${messageId}.png`;
    link.click();
  };

  const downloadSharedPostPdf = async (messageId: string) => {
    const el = document.getElementById(getPostSnapshotElementId(messageId));
    if (!el) return;

    const canvas = await html2canvas(el as HTMLElement, { backgroundColor: '#ffffff', scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: canvas.width >= canvas.height ? 'l' : 'p',
      unit: 'pt',
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`shared-post-${messageId}.pdf`);
  };

  const CreateCommunityModal = () => {
    if (!isCreateCommunityOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsCreateCommunityOpen(false)}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold">Create Community</h2>
            <button onClick={() => setIsCreateCommunityOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                value={newCommunityName}
                onChange={(e) => setNewCommunityName(e.target.value)}
                className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Growth Mentors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={newCommunityDescription}
                onChange={(e) => setNewCommunityDescription(e.target.value)}
                className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="What is this community about?"
                rows={4}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
            )}
          </div>

          <div className="p-5 border-t border-gray-200 flex gap-3">
            <button
              onClick={() => setIsCreateCommunityOpen(false)}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 font-medium hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateCommunity}
              className="flex-1 px-4 py-3 rounded-xl text-white font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              disabled={loading || !newCommunityName.trim()}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Mobile Communities List View
  const MobileCommunitiesList = () => (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold">Communities</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {communities.map((community) => (
          <motion.div
            key={community._id}
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
            key={channel._id}
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
            <p className="text-xs text-gray-500">{onlineMemberCount} online · {members.length} members</p>
          </div>
          <button onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <BellOff className="w-5 h-5 text-gray-400" /> : <Bell className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageComponent key={message._id} message={message} isMobile />
        ))}
      </div>

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 border-t border-gray-200 bg-white lg:relative lg:bottom-auto z-30 pt-[12px] pr-[12px] pb-[28px] pl-[12px] mx-[0px] my-[12px]">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <input
              type="file"
              multiple
              className="hidden"
              id="mobile-community-attach"
              onChange={(e) => {
                handleUploadAttachments(e.target.files);
                e.currentTarget.value = '';
              }}
              disabled={uploading}
            />
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
              <button
                className="p-1.5 hover:bg-gray-200 rounded"
                onClick={() => document.getElementById('mobile-community-attach')?.click()}
                disabled={uploading}
                title={uploading ? 'Uploading...' : 'Attach'}
              >
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
  const MessageComponent = ({ message, isMobile = false }: { message: ApiMessage; isMobile?: boolean }) => {
    if (message.type === 'system') {
      return (
        <div className="text-center text-sm text-gray-500 italic py-2">
          {message.content}
        </div>
      );
    }

    if ((message as any).type === 'shared-post' && (message as any).sharedPostId) {
      const shared = (message as any).sharedPostId;
      return (
        <div className="border border-gray-200 rounded-xl p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-gray-900">Shared Post</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadSharedPostPng(message._id)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Download PNG
              </button>
              <button
                onClick={() => downloadSharedPostPdf(message._id)}
                className="px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Download PDF
              </button>
            </div>
          </div>

          <div id={getPostSnapshotElementId(message._id)} className="rounded-lg border border-gray-200 p-4 bg-gray-50">
            <div className="text-sm font-bold text-gray-900 mb-1">{shared?.author?.name || 'Unknown'}</div>
            <div className="text-xs text-gray-600 mb-3">{shared?.author?.role || ''}</div>
            <div className="text-sm text-gray-800 whitespace-pre-wrap">{shared?.content || ''}</div>
            {shared?.image && (
              <img src={shared.image} alt="Shared" className="mt-3 rounded-lg max-h-64 object-cover" />
            )}
          </div>

          {message.content ? (
            <div className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">{message.content}</div>
          ) : null}
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
            <div className="text-3xl">{message.userId?.avatar || '👤'}</div>
            <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="font-bold">{message.userId?.name || 'Unknown'}</span>
              <span className="text-xs text-gray-500">{formatTimestamp(message.createdAt)}</span>
            </div>
            <div className="prose prose-sm max-w-none">
              <p className="font-medium text-lg mb-1">{message.milestoneData?.title}</p>
              <p className="text-gray-700">{message.milestoneData?.description}</p>
            </div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (message.type === 'poll') {
      return (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="text-2xl">{message.userId?.avatar || '👤'}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm">{message.userId?.name || 'Unknown'}</span>
                <span className="text-xs text-gray-500">{formatTimestamp(message.createdAt)}</span>
                {message.pinned && <Pin className="w-3 h-3 text-yellow-600" />}
              </div>
              <p className="text-xs text-gray-600 mb-2">{message.userId?.role || ''}</p>
              <p className="text-sm text-gray-900 break-words">{message.content}</p>

              {!!message.attachments?.length && (
                <div className="mt-2 flex flex-col gap-2">
                  {message.attachments.map((a, idx) => (
                    <a
                      key={idx}
                      href={a.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-between gap-3 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <span className="text-xs font-bold text-gray-800 truncate">{a.originalName}</span>
                      <span className="text-xs text-gray-600">Download</span>
                    </a>
                  ))}
                </div>
              )}

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
    }

    return (
      <div className={`group flex gap-3 ${isMobile ? '' : 'p-3 hover:bg-gray-50 rounded-lg'}`}>
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700 flex-shrink-0">
          {(message.userId?.name || 'U').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-sm">{message.userId?.name || 'Unknown'}</span>
            <span className="text-xs text-gray-500">{formatTimestamp(message.createdAt)}</span>
            {message.pinned && <Pin className="w-3 h-3 text-yellow-600" />}
          </div>
          <p className="text-xs text-gray-600 mb-2">{message.userId?.role || ''}</p>
          <p className="text-sm text-gray-900 break-words whitespace-pre-wrap">{message.content}</p>

          {!!message.attachments?.length && (
            <div className="mt-2 flex flex-col gap-2">
              {message.attachments.map((a, idx) => (
                <a
                  key={idx}
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-between gap-3 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span className="text-xs font-bold text-gray-800 truncate">{a.originalName}</span>
                  <span className="text-xs text-gray-600">Download</span>
                </a>
              ))}
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
                    key={community._id}
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
                      {currentChannels.filter(c => c.type === 'text').map((channel) => (
                        <button
                          key={channel._id}
                          onClick={() => setSelectedChannel(channel)}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors group ${
                            selectedChannel?._id === channel._id
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
                  {messages.map((message) => (
                    <MessageComponent key={message._id} message={message} />
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
                Members — {members.length}
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {/* Online Members */}
              <div className="mb-4">
                <div className="px-2 py-1 text-xs font-bold text-gray-500 uppercase">
                  Online — {onlineMemberCount}
                </div>
                {members.map((member) => (
                    <button
                      key={member._id}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 transition-colors group"
                      title="View profile"
                    >
                      <div className="relative">
                        <span className="text-xl">{member.avatar || '👤'}</span>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-50 rounded-full"></span>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-gray-900 truncate">{member.name}</span>
                          {member.isVerified && <Check className="w-3 h-3 text-blue-500" />}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{member.role}</p>
                      </div>
                    </button>
                  ))}
              </div>

              {/* Offline Members */}
              <div>
                <div className="px-2 py-1 text-xs font-bold text-gray-500 uppercase">
                  Offline — {offlineMemberCount}
                </div>
                {[]
                  .map((member: ApiMember) => (
                    <button
                      key={member._id}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 transition-colors opacity-60"
                    >
                      <span className="text-xl">{member.avatar || '👤'}</span>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-gray-900 truncate">{member.name}</span>
                          {member.isVerified && <Check className="w-3 h-3 text-blue-500" />}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{member.role}</p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Member count footer */}
            <div className="p-3 border-t border-gray-200 text-xs text-gray-500 text-center">
              {onlineMemberCount} online · {members.length} total
            </div>
          </aside>
        )}
      </div>
    </>
  );
}