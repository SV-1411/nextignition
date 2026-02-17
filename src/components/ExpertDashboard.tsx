import { brandColors } from '../utils/colors';
import logoImage from 'figma:asset/faed1dd832314fe381fd34c35312b9faa571832d.png';
import squareLogo from 'figma:asset/c1daa721302db62b744322e73e636f7b8f029976.png';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RoleSwitcher, UserRole } from './RoleSwitcher';
import { FounderDashboard } from './FounderDashboard';
import { InvestorDashboard } from './InvestorDashboard';
import { getCurrentUser, logout } from '../services/authService';
import api from '../services/api';
import {
  Home,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Headphones,
  Newspaper,
  MessageCircle,
  Sparkles,
  BarChart3,
  User,
  Settings,
  Menu,
  X,
  Bell,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  TrendingUp,
  Award,
  Star,
  Plus,
  Edit,
  CheckCircle,
  Target,
  XCircle,
  Eye,
  ThumbsUp,
  LogOut
} from 'lucide-react';
import { EnhancedHomeFeed } from './EnhancedHomeFeed';
import { NotificationsDropdown } from './NotificationsDropdown';
import { MyClientsPage } from './MyClientsPage';
import { SchedulePage } from './SchedulePage';
import { EarningsPage } from './EarningsPage';
import { ContentStudioPage } from './ContentStudioPage';
import { EventsPage } from './EventsPage';
import { MessagingPage } from './MessagingPage';
import { CommunitiesPage } from './CommunitiesPage';
import { PodcastsPage } from './PodcastsPage';
import { NewsFeedPage } from './NewsFeedPage';
import { IgnishaAIDashboard } from './IgnishaAIDashboard';
import { ProfilePage } from './ProfilePage';
import { SettingsPage } from './SettingsPage';
import { AIMatchedStartupsPage } from './AIMatchedStartupsPage';

interface SidebarItem {
  icon: any;
  label: string;
  badge?: number;
}

interface Session {
  id: number;
  startup: string;
  founder: string;
  time: string;
  duration: string;
  type: 'video' | 'call' | 'chat';
  status: 'upcoming' | 'pending' | 'completed';
}

interface Client {
  id: number;
  name: string;
  startup: string;
  industry: string;
  stage: string;
  matchScore: number;
  status: 'pending' | 'active' | 'completed';
}

interface Post {
  id: number;
  title: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledDate?: string;
  views?: number;
  likes?: number;
}

export function ExpertDashboard() {
  const [activeTab, setActiveTab] = useState('Home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('expert');
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pendingClients, setPendingClients] = useState<Client[]>([
    {
      id: 1,
      name: 'David Park',
      startup: 'FinTech Pro',
      industry: 'Financial Technology',
      stage: 'Seed',
      matchScore: 95,
      status: 'pending',
    },
    {
      id: 2,
      name: 'Lisa Zhang',
      startup: 'HealthAI',
      industry: 'Healthcare',
      stage: 'Pre-seed',
      matchScore: 88,
      status: 'pending',
    },
    {
      id: 3,
      name: 'James Miller',
      startup: 'EduTech Solutions',
      industry: 'Education',
      stage: 'Series A',
      matchScore: 92,
      status: 'pending',
    },
  ]);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    console.log(`Switching to ${newRole} dashboard`);
  };

  // Load current user on mount
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  // If user switches to a different role, render that dashboard
  if (currentRole === 'founder') {
    return <FounderDashboard />;
  }

  if (currentRole === 'investor') {
    return <InvestorDashboard />;
  }

  // Otherwise render expert dashboard
  const sidebarItems: SidebarItem[] = [
    { icon: Home, label: 'Home' },
    { icon: Users, label: 'My Clients' },
    { icon: Calendar, label: 'Schedule', badge: 3 },
    { icon: DollarSign, label: 'Earnings' },
    { icon: FileText, label: 'Content Studio' },
    { icon: Calendar, label: 'Events' },
    { icon: Headphones, label: 'Podcasts' },
    { icon: Newspaper, label: 'News' },
    { icon: MessageCircle, label: 'Messages', badge: 8 },
    { icon: Users, label: 'Communities' },
    { icon: Sparkles, label: 'Ignisha AI' },
    { icon: BarChart3, label: 'Analytics' },
    { icon: User, label: 'Profile' },
    { icon: Settings, label: 'Settings' },
  ];

  const upcomingSessions: Session[] = [
    {
      id: 1,
      startup: 'TechFlow AI',
      founder: 'Sarah Chen',
      time: 'Today, 2:00 PM',
      duration: '60 min',
      type: 'video',
      status: 'upcoming',
    },
    {
      id: 2,
      startup: 'GreenScale',
      founder: 'Marcus Williams',
      time: 'Today, 4:30 PM',
      duration: '45 min',
      type: 'call',
      status: 'upcoming',
    },
    {
      id: 3,
      startup: 'StartupHub',
      founder: 'Emily Rodriguez',
      time: 'Tomorrow, 10:00 AM',
      duration: '30 min',
      type: 'video',
      status: 'upcoming',
    },
  ];

  const [contentPosts, setContentPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const response = await api.get('/feed');
        const expertPosts = response.data.filter((post: any) => post.author?._id === currentUser?._id);
        setContentPosts(expertPosts.map((post: any) => ({
          id: post._id,
          title: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
          status: 'published', // Default status for now
          views: 0,
          likes: post.likes?.length || 0,
        })));
      } catch (error) {
        console.error('Failed to fetch posts', error);
        setContentPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    };

    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser]);

  const revenueStats = {
    thisMonth: 8450,
    lastMonth: 7200,
    pendingConsultations: 12,
    totalMentees: 34,
    avgRating: 4.9,
    totalSessions: 127,
  };

  const [bookingRequests, setBookingRequests] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoadingBookings(true);
      try {
        const response = await api.get('/bookings');
        const expertBookings = response.data.filter((booking: any) => booking.status === 'pending');
        setBookingRequests(expertBookings.map((booking: any) => ({
          id: booking._id,
          founder: booking.founder.name || 'Unknown Founder',
          topic: booking.topic,
          time: new Date(booking.date).toLocaleDateString() + ' ' + booking.startTime,
          bookingData: booking
        })));
      } catch (error) {
        console.error('Failed to fetch bookings', error);
        setBookingRequests([]);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data.map((notif: any) => ({
          id: notif._id,
          type: notif.type || 'general',
          title: notif.title,
          message: notif.message,
          time: new Date(notif.createdAt).toLocaleDateString(),
          unread: !notif.read,
          icon: Calendar, // Default icon, could be mapped by type
        })));
      } catch (error) {
        console.error('Failed to fetch notifications', error);
        setNotifications([]);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <motion.aside 
        animate={{ width: isSidebarCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:block fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40 flex flex-col overflow-hidden"
      >
        <div className="p-6 flex items-center justify-center flex-shrink-0">
          {isSidebarCollapsed ? (
            <img 
              src={squareLogo} 
              alt="NextIgnition" 
              className="w-10 h-10 cursor-pointer"
              onClick={() => window.location.hash = ''}
            />
          ) : (
            <img 
              src={logoImage} 
              alt="NextIgnition" 
              className="h-8 cursor-pointer mr-auto"
              onClick={() => window.location.hash = ''}
            />
          )}
        </div>
        
        <nav className="px-3 flex-1 overflow-y-auto" style={{ height: 'calc(100vh - 160px)' }}>
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveTab(item.label);
              }}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg mb-1 transition-all relative group ${
                activeTab === item.label
                  ? 'bg-gradient-to-r text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={activeTab === item.label ? {
                background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})`
              } : {}}
              title={isSidebarCollapsed ? item.label : ''}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <>
                  <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {isSidebarCollapsed && item.badge && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              {/* Tooltip on hover when collapsed */}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                  {item.badge && ` (${item.badge})`}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Toggle button at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setIsSidebarOpen(false)}>
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Header - Fixed */}
            <div className="flex-shrink-0 p-6 flex items-center justify-between border-b border-gray-200 bg-white">
              <img src={logoImage} alt="NextIgnition" className="h-8" />
              <button onClick={() => setIsSidebarOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ WebkitOverflowScrolling: 'touch' }}>
              {/* Mobile Role Switcher */}
              <div className="px-3 pt-4 pb-3 border-b border-gray-200 bg-white">
                <RoleSwitcher 
                  currentRole={currentRole}
                  onRoleChange={handleRoleChange}
                />
              </div>
              
              <nav className="px-3 pt-4 pb-8">
                {sidebarItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveTab(item.label);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                      activeTab === item.label
                        ? 'bg-gradient-to-r text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={activeTab === item.label ? {
                      background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})`
                    } : {}}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </motion.aside>
        </div>
      )}

      {/* Main Content */}
      <main className="min-h-screen pb-20 lg:pb-0 transition-all duration-300 lg:ml-64">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-lg font-bold">Welcome back, Dr. Johnson!</h1>
                <p className="text-sm text-gray-600 hidden sm:block">You have 3 sessions today</p>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Desktop Role Switcher */}
              <div className="hidden lg:block">
                <RoleSwitcher 
                  currentRole={currentRole} 
                  onRoleChange={handleRoleChange}
                />
              </div>
              {/* Requests & Stats Button */}
              <button 
                onClick={() => setIsStatsModalOpen(!isStatsModalOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-full"
              >
                <BarChart3 className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-full"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-50 rounded-full"></span>
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                {currentUser?.name?.split(' ').map((n: any) => n[0]).join('').slice(0, 2).toUpperCase() || 'DJ'}
              </div>
            </div>
          </div>
        </header>

        {/* Notifications Dropdown */}
        <NotificationsDropdown 
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          userRole="expert"
        />

        {/* Conditional Tab Content */}
        {activeTab === 'Home' && (
          <EnhancedHomeFeed userType="expert" />
        )}
        
        {activeTab === 'My Clients' && <MyClientsPage />}
        
        {activeTab === 'Schedule' && <SchedulePage />}
        
        {activeTab === 'Earnings' && <EarningsPage />}
        
        {activeTab === 'Content Studio' && <ContentStudioPage />}
        
        {activeTab === 'Events' && <EventsPage userRole="expert" />}
        
        {activeTab === 'Messages' && (
          <MessagingPage initialUserId={currentUser?.id ? String(currentUser.id) : undefined} />
        )}

        {activeTab === 'Communities' && <CommunitiesPage userRole="expert" userId={currentUser?.id || 1} />}

        {activeTab === 'Podcasts' && <PodcastsPage userRole="expert" />}

        {/* News Tab */}
        {activeTab === 'News' && <NewsFeedPage userRole="expert" userId={currentUser?.id || 1} />}

        {/* Ignisha AI Tab */}
        {activeTab === 'Ignisha AI' && <IgnishaAIDashboard userRole="expert" />}

        {/* Profile View */}
        {activeTab === 'Profile' && <ProfilePage userRole="expert" onNavigateToSettings={() => setActiveTab('Settings')} />}

        {/* Settings View */}
        {activeTab === 'Settings' && <SettingsPage userRole="expert" />}

        {/* AI Matched Startups View */}
        {activeTab === 'AI Matched Startups' && <AIMatchedStartupsPage onBack={() => setActiveTab('Home')} />}

        {activeTab !== 'Home' && activeTab !== 'My Clients' && activeTab !== 'Schedule' && activeTab !== 'Earnings' && activeTab !== 'Content Studio' && activeTab !== 'Events' && activeTab !== 'Messages' && activeTab !== 'Communities' && activeTab !== 'Podcasts' && activeTab !== 'News' && activeTab !== 'Ignisha AI' && activeTab !== 'Profile' && activeTab !== 'Settings' && activeTab !== 'AI Matched Startups' && (
        <div className="">
          {/* Revenue Dashboard Widget */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-[24px] mt-[0px] mr-[24px] ml-[24px] m-[24px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white col-span-2"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-white/80 text-sm mb-1">Earnings This Month</p>
                  <h2 className="text-3xl font-bold">${revenueStats.thisMonth.toLocaleString()}</h2>
                </div>
                <DollarSign className="w-12 h-12 text-white/40" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>
                  +{Math.round(((revenueStats.thisMonth - revenueStats.lastMonth) / revenueStats.lastMonth) * 100)}% from last month
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <Clock className="w-8 h-8 text-blue-500 mb-3" />
              <div className="text-2xl font-bold mb-1">{revenueStats.pendingConsultations}</div>
              <div className="text-sm text-gray-600">Pending Consultations</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <Users className="w-8 h-8 text-orange-500 mb-3" />
              <div className="text-2xl font-bold mb-1">{revenueStats.totalMentees}</div>
              <div className="text-sm text-gray-600">Total Mentees</div>
            </motion.div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-[24px] mt-[0px] mr-[24px] ml-[24px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-4 text-center"
            >
              <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{revenueStats.avgRating}</div>
              <div className="text-xs text-gray-600">Avg Rating</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-4 text-center"
            >
              <Video className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{revenueStats.totalSessions}</div>
              <div className="text-xs text-gray-600">Total Sessions</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-4 text-center"
            >
              <Award className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-gray-600">Success Stories</div>
            </motion.div>
          </div>

          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 mb-[24px] mt-[0px] mr-[24px] ml-[24px]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Today's Schedule</h3>
              <button className="text-sm text-blue-600 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {upcomingSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                      {session.founder.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{session.startup}</h4>
                      <p className="text-xs text-gray-600">{session.founder}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {session.time}
                        </span>
                        <span className="text-xs text-gray-500">{session.duration}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="px-4 py-2 rounded-lg text-sm font-bold text-white flex items-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                  >
                    <Video className="w-4 h-4" />
                    Join
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Client Pipeline - AI Matched Startups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-xl p-6 mb-[24px] mt-[0px] mr-[24px] ml-[24px]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">AI-Matched Startups</h3>
                <Sparkles className="w-5 h-5 text-purple-500" />
              </div>
              <button 
                onClick={() => setActiveTab('AI Matched Startups')}
                className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {pendingClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold">{client.startup}</h4>
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                          {client.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{client.name} · {client.industry}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                          {client.stage}
                        </span>
                        <Target className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setPendingClients(prev => prev.filter(c => c.id !== client.id));
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Decline
                    </button>
                    <button 
                      onClick={() => {
                        setPendingClients(prev => prev.map(c => 
                          c.id === client.id ? { ...c, status: 'active' as const } : c
                        ));
                        // You could also add a success toast/notification here
                      }}
                      className="flex-1 px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors flex items-center justify-center gap-2"
                      style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Accept
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Content Studio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-white rounded-xl p-6 m-[24px] mt-[0px] mr-[24px] mb-[24px] ml-[24px]"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Content Studio</h3>
              <button 
                onClick={() => setActiveTab('Content Studio')}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
              >
                <Plus className="w-4 h-4" />
                New Post
              </button>
            </div>
            <div className="space-y-3">
              {contentPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      post.status === 'draft' ? 'bg-gray-100' :
                      post.status === 'scheduled' ? 'bg-blue-100' :
                      'bg-green-100'
                    }`}>
                      {post.status === 'draft' ? <Edit className="w-5 h-5 text-gray-600" /> :
                       post.status === 'scheduled' ? <Clock className="w-5 h-5 text-blue-600" /> :
                       <CheckCircle className="w-5 h-5 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm mb-1">{post.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className={`px-2 py-1 rounded font-medium ${
                          post.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                          post.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                        {post.scheduledDate && <span>Scheduled: {post.scheduledDate}</span>}
                        {post.views !== undefined && (
                          <>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" /> {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" /> {post.likes}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('Content Studio')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        )}
      </main>

      {/* Stats & Requests Modal Popup */}
      {isStatsModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsStatsModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold">Stats & Requests</h2>
              <button
                onClick={() => setIsStatsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Booking Requests */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">Booking Requests</h3>
                  <span className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {bookingRequests.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {bookingRequests.map((request, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-bold text-sm mb-1">{request.founder}</h4>
                      <p className="text-xs text-gray-600 mb-2">{request.topic}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <Clock className="w-3 h-3" />
                        {request.time}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={async () => {
                            try {
                              await api.put(`/booking/${request.bookingData._id}/status`, { status: 'cancelled' });
                              setBookingRequests(prev => prev.filter(r => r.id !== request.id));
                            } catch (error) {
                              console.error('Failed to decline booking', error);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium hover:bg-white transition-colors"
                        >
                          Decline
                        </button>
                        <button 
                          onClick={async () => {
                            try {
                              await api.put(`/booking/${request.bookingData._id}/status`, { status: 'confirmed' });
                              setBookingRequests(prev => prev.filter(r => r.id !== request.id));
                            } catch (error) {
                              console.error('Failed to approve booking', error);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                          style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Insights */}
              <div className="mb-6">
                <h3 className="font-bold mb-4">This Week's Performance</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">Session Completion</span>
                      <span className="text-sm font-bold text-blue-600">100%</span>
                    </div>
                    <div className="bg-white/60 rounded-full h-2">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">Response Time</span>
                      <span className="text-sm font-bold text-orange-600">{'<'}2 hrs</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span>30% faster than average</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">Client Satisfaction</span>
                      <span className="text-sm font-bold text-green-600">98%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievement Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl p-6 text-white text-center"
              >
                <Award className="w-12 h-12 mx-auto mb-3" />
                <h4 className="font-bold mb-1">Top Expert Badge</h4>
                <p className="text-sm text-white/80 mb-3">You're in the top 5% of mentors!</p>
                <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/90 transition-colors">
                  View Profile
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-bottom">
        <div className="relative">
          <div className="grid grid-cols-5 gap-1 px-2 py-2">
            {/* Home */}
            <button 
              onClick={() => setActiveTab('Home')}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                activeTab === 'Home' ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              <Home className="w-6 h-6" fill={activeTab === 'Home' ? 'currentColor' : 'none'} />
              <span className="text-xs font-medium">Home</span>
            </button>
            
            {/* My Clients */}
            <button 
              onClick={() => setActiveTab('My Clients')}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                activeTab === 'My Clients' ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs font-medium">Clients</span>
            </button>
            
            {/* Ignisha AI - Center Elevated Button */}
            <button 
              onClick={() => setActiveTab('Ignisha AI')}
              className="flex flex-col items-center justify-center relative"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`absolute -top-8 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all ${
                  activeTab === 'Ignisha AI'
                    ? 'bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500'
                    : 'bg-gradient-to-br from-purple-500 via-blue-500 to-orange-400'
                }`}
              >
                <Sparkles className="w-7 h-7 text-white" />
                {activeTab === 'Ignisha AI' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -inset-1 bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500 rounded-2xl blur-md opacity-50 -z-10"
                  />
                )}
              </motion.div>
              <span className={`text-xs font-bold mt-10 transition-colors ${
                activeTab === 'Ignisha AI' 
                  ? 'bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent' 
                  : 'text-gray-600'
              }`}>
                Ignisha
              </span>
            </button>
            
            {/* Messages */}
            <button 
              onClick={() => setActiveTab('Messages')}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg relative transition-colors ${
                activeTab === 'Messages' ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs font-medium">Messages</span>
              {3 > 0 && (
                <span className="absolute top-1 right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  3
                </span>
              )}
            </button>
            
            {/* Profile */}
            <button 
              onClick={() => setActiveTab('Profile')}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                activeTab === 'Profile' ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Quick Session Notification - Mobile */}
      <div className="lg:hidden fixed top-20 right-4 left-4 z-30">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden bg-white border border-blue-500 rounded-2xl p-4 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-600 rounded-full flex items-center justify-center">
                <Video className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Session Starting Soon</h4>
                <p className="text-xs text-gray-600">Sarah Chen - TechFlow AI</p>
              </div>
            </div>
            <button 
              className="px-4 py-2 rounded-lg text-sm font-bold text-white flex items-center gap-2"
              style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
            >
              Join
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}