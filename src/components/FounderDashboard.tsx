import { ProfilePage } from './ProfilePage';
import { SettingsPage } from './SettingsPage';
import { DiscoverExperts } from './DiscoverExperts';
import { DiscoverCoFounders } from './DiscoverCoFounders';
import { MessagingPage } from './MessagingPage';
import { CommunitiesPage } from './CommunitiesPage';
import { FundingPortalFounder } from './FundingPortalFounder';
import { EventsPage } from './EventsPage';
import { PodcastsPage } from './PodcastsPage';
import { NewsFeedPage } from './NewsFeedPage';
import { InvestorDashboard } from './InvestorDashboard';
import { ExpertDashboard } from './ExpertDashboard';
import { RoleSwitcher, UserRole } from './RoleSwitcher';
import { NotificationsDropdown } from './NotificationsDropdown';
import { MyStartupPage } from './MyStartupPage';
import { EnhancedHomeFeed } from './EnhancedHomeFeed';
import { IgnishaAIDashboard } from './IgnishaAIDashboard';
import { VerificationBanner } from './VerificationBanner';
import { brandColors } from '../utils/colors';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import api from '../services/api';
import { fetchMe, getCurrentUser, setCurrentUser as persistCurrentUser, logout } from '../services/authService';
import {
  Home,
  Rocket,
  Users,
  MessageCircle,
  Calendar,
  Settings,
  Bell,
  Menu,
  X,
  Plus,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  User,
  Compass,
  Mic,
  Newspaper,
  FileText,
  UserPlus,
  Sparkles,
  Target,
  Award,
  Briefcase,
  BarChart3,
  TrendingUp,
  Search,
  Edit,
  LogOut
} from 'lucide-react';
import logoImage from 'figma:asset/faed1dd832314fe381fd34c35312b9faa571832d.png';
import squareLogo from 'figma:asset/c1daa721302db62b744322e73e636f7b8f029976.png';

interface SidebarItem {
  icon: any;
  label: string;
  badge?: number;
}

interface QuickAction {
  icon: any;
  title: string;
  description: string;
  color: string;
  action: () => void;
}

export function FounderDashboard() {
  const [activeTab, setActiveTab] = useState('Home Feed');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [discoverSubTab, setDiscoverSubTab] = useState('Experts');
  const [openHomeFeedCreatePost, setOpenHomeFeedCreatePost] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('founder');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showVerificationBanner, setShowVerificationBanner] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const userId = currentUser?.id ?? currentUser?._id;
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [initialMessageUserId, setInitialMessageUserId] = useState<string | undefined>(undefined);
  const [dashboardStats, setDashboardStats] = useState({
    profileViews: 0,
    connections: 0,
    investorInterest: 0,
    fundingProgress: 0
  });

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsVerified(!!user?.isVerified);

    // Fetch dashboard data
    fetchDashboardData();

    // Refresh user state from backend to determine verification + banner visibility
    (async () => {
      try {
        const me = await fetchMe();
        if (me) {
          persistCurrentUser(me);
          setCurrentUser(me);
          setIsVerified(!!me.isVerified);

          const dismissedUntil = me.verificationBannerDismissedUntil ? new Date(me.verificationBannerDismissedUntil) : null;
          const now = new Date();
          const hideBanner = dismissedUntil ? dismissedUntil.getTime() > now.getTime() : false;
          setShowVerificationBanner(!hideBanner);
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  const dismissVerificationBanner = async (hours: number) => {
    try {
      const dismissedUntil = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
      await api.post('/verification/banner', { dismissedUntil });
      setShowVerificationBanner(false);
      const me = await fetchMe();
      if (me) {
        persistCurrentUser(me);
        setCurrentUser(me);
      }
    } catch {
      setShowVerificationBanner(false);
    }
  };

  const completeVerification = async () => {
    try {
      await api.post('/verification/complete');
      setIsVerified(true);
      const me = await fetchMe();
      if (me) {
        persistCurrentUser(me);
        setCurrentUser(me);
      }
    } catch {
      // ignore
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch unread messages count
      const messagesRes = await api.get('/messages/conversations');
      const unreadCount = messagesRes.data?.reduce((acc: number, conv: any) => acc + (conv.unreadCount || 0), 0);
      setUnreadMessages(unreadCount || 0);

      // Fetch unread notifications
      const notifRes = await api.get('/notifications');
      const notifCount = notifRes.data?.filter((n: any) => !n.read).length || 0;
      setUnreadNotifications(notifCount);

      // Fetch upcoming events count
      const eventsRes = await api.get('/events', { params: { status: 'upcoming' } });
      setUpcomingEvents(eventsRes.data?.length || 0);
    } catch {
      // Silent fail - keep showing 0
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    console.log(`Switching to ${newRole} dashboard`);
  };

  const quickActions: QuickAction[] = [
    {
      icon: Edit,
      title: 'Post Update',
      description: 'Share your progress',
      color: brandColors.electricBlue,
      action: () => {
        setActiveTab('Home Feed');
        setOpenHomeFeedCreatePost(true);
      },
    },
    {
      icon: FileText,
      title: 'Upload Pitch Deck',
      description: 'Add to your profile',
      color: brandColors.atomicOrange,
      action: () => setActiveTab('My Startup'),
    },
    {
      icon: UserPlus,
      title: 'Find Co-founder',
      description: 'Browse matches',
      color: brandColors.navyBlue,
      action: () => {
        setActiveTab('Discover');
        setDiscoverSubTab('CoFounders');
      },
    },
    {
      icon: DollarSign,
      title: 'Apply for Funding',
      description: 'Get investor ready',
      color: brandColors.electricBlue,
      action: () => setActiveTab('Funding Portal'),
    },
  ];
  const sidebarItems: SidebarItem[] = [
    { icon: Home, label: 'Home Feed' },
    { icon: Rocket, label: 'My Startup' },
    { icon: Compass, label: 'Discover' },
    { icon: MessageCircle, label: 'Messages', badge: unreadMessages || undefined },
    { icon: DollarSign, label: 'Funding Portal' },
    { icon: Users, label: 'Communities' },
    { icon: Calendar, label: 'Events', badge: upcomingEvents || undefined },
    { icon: Mic, label: 'Podcasts' },
    { icon: Newspaper, label: 'News' },
    { icon: Sparkles, label: 'Ignisha AI' },
    { icon: User, label: 'Profile' },
    { icon: Settings, label: 'Settings' },
  ];

  // If user switches to a different role, render that dashboard
  if (currentRole === 'investor') {
    return <InvestorDashboard />;
  }

  if (currentRole === 'expert') {
    return <ExpertDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        /* Mobile optimizations */
        @media (max-width: 1024px) {
          .safe-bottom {
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
        
        /* Smooth transitions */
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      {/* Desktop Sidebar */}
      <motion.aside 
        animate={{ width: isSidebarCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:block fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40 overflow-hidden"
      >
        <div className="p-6 flex items-center justify-center">
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
              onClick={() => window.location.href = '/'}
            />
          )}
        </div>
        
        <nav className="px-3 overflow-y-auto pb-20" style={{ height: 'calc(100vh - 88px - 72px)', WebkitOverflowScrolling: 'touch' }}>
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg mb-1 transition-all relative group ${
                activeTab === item.label
                  ? item.label === 'Ignisha AI' 
                    ? 'text-white' 
                    : 'bg-gradient-to-r text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={activeTab === item.label ? 
                item.label === 'Ignisha AI'
                  ? {
                      backgroundColor: brandColors.electricBlue,
                      borderLeft: `4px solid ${brandColors.atomicOrange}`,
                      boxShadow: '0 0 20px rgba(102, 102, 255, 0.3)'
                    }
                  : {
                      background: `linear-gradient(135deg, ${brandColors.atomicOrange}, ${brandColors.electricBlue})`
                    }
                : {}
              }
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
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
                      background: `linear-gradient(135deg, ${brandColors.atomicOrange}, ${brandColors.electricBlue})`
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

      {/* Main Content Area */}
      <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} h-screen overflow-hidden pb-20 lg:pb-0 flex flex-col`}>
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 flex-shrink-0">
          <div className="flex items-center justify-between px-[24px] py-[12px]">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">{activeTab}</h1>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Desktop Role Switcher */}
              <div className="hidden lg:block">
                <RoleSwitcher 
                  currentRole={currentRole} 
                  onRoleChange={handleRoleChange}
                />
              </div>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-full"
              >
                <Bell className="w-6 h-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-6 h-6" />
              </button>
              <button className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center text-white font-bold">
                {currentUser?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'JD'}
              </button>
            </div>
          </div>
        </header>

        {/* Notifications Dropdown */}
        <NotificationsDropdown 
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          userRole="founder"
        />

        {/* Verification Banner */}
        {showVerificationBanner && !isVerified && (
          <VerificationBanner 
            userRole={currentRole === 'founder' ? 'founder' : 'founder'}
            userName={currentUser?.name}
            onComplete={completeVerification}
            onDismiss={() => dismissVerificationBanner(24)}
            onClose={() => dismissVerificationBanner(24)}
          />
        )}

        <div className="flex-1 overflow-y-auto lg:overflow-y-auto">
          {/* Home Feed Tab */}
          {activeTab === 'Home Feed' && (
            <div className="space-y-6">
              {/* Dashboard Stats Widget */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-[24px] mt-[16px]">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.profileViews}</p>
                      <p className="text-xs text-gray-500">Profile Views</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.connections}</p>
                      <p className="text-xs text-gray-500">Connections</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.investorInterest}</p>
                      <p className="text-xs text-gray-500">Investor Interest</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{dashboardStats.fundingProgress}%</p>
                      <p className="text-xs text-gray-500">Funding Progress</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm mx-[24px] mt-[16px]">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className="flex flex-col items-start p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:shadow-md transition-all text-left"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                        style={{ backgroundColor: `${action.color}20` }}
                      >
                        <action.icon className="w-5 h-5" style={{ color: action.color }} />
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">{action.title}</h3>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </button>
                  ))}
                </div>
              </div>
              <EnhancedHomeFeed
                userType="founder"
                openCreateModal={openHomeFeedCreatePost}
                onCreateModalClose={() => setOpenHomeFeedCreatePost(false)}
              />
            </div>
          )}

          {/* My Startup Tab - Shows Startup Profile */}
          {activeTab === 'My Startup' && (
            <div className="max-w-7xl mx-auto">
              <MyStartupPage userRole="founder" />
            </div>
          )}

          {/* Discover Tab */}
          {activeTab === 'Discover' && (
            <div>
              {/* Sub-tab Navigation */}
              <div className="bg-white rounded-xl p-2 shadow-sm flex gap-2 mt-[16px] mr-[24px] mb-[24px] ml-[24px]">
                <button
                  onClick={() => setDiscoverSubTab('Experts')}
                  className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
                    discoverSubTab === 'Experts'
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={discoverSubTab === 'Experts' ? {
                    background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})`
                  } : {}}
                >
                  Find Experts
                </button>
                <button
                  onClick={() => setDiscoverSubTab('CoFounders')}
                  className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all ${
                    discoverSubTab === 'CoFounders'
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={discoverSubTab === 'CoFounders' ? {
                    background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})`
                  } : {}}
                >
                  Find Founders/Co-Founders
                </button>
              </div>

              {/* Sub-tab Content */}
              {discoverSubTab === 'Experts' && <DiscoverExperts onMessage={(userId) => { setInitialMessageUserId(userId); setActiveTab('Messages'); }} />}
              {discoverSubTab === 'CoFounders' && <DiscoverCoFounders onMessage={(userId) => { setInitialMessageUserId(userId); setActiveTab('Messages'); }} />}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'Messages' && (
            <MessagingPage initialUserId={initialMessageUserId} />
          )}

          {/* Communities Tab */}
          {activeTab === 'Communities' && (
            userId ? <CommunitiesPage userRole="founder" userId={userId} /> : null
          )}

          {/* Funding Portal Tab */}
          {activeTab === 'Funding Portal' && (
            <FundingPortalFounder />
          )}

          {/* Events Tab */}
          {activeTab === 'Events' && (
            <EventsPage userRole="founder" />
          )}

          {/* Podcasts Tab */}
          {activeTab === 'Podcasts' && (
            <PodcastsPage userRole="founder" />
          )}

          {/* News Tab */}
          {activeTab === 'News' && (
            <NewsFeedPage />
          )}

          {/* Ignisha AI Tab */}
          {activeTab === 'Ignisha AI' && (
            <IgnishaAIDashboard userRole="founder" />
          )}

          {/* Profile Tab */}
          {activeTab === 'Profile' && <ProfilePage userRole="founder" onNavigateToSettings={() => setActiveTab('Settings')} />}

          {/* Settings Tab */}
          {activeTab === 'Settings' && <SettingsPage userRole="founder" />}

          {/* Placeholder for other tabs */}
          {!['Home Feed', 'My Startup', 'Profile', 'Discover', 'Messages', 'Communities', 'Funding Portal', 'Events', 'Podcasts', 'News', 'Ignisha AI', 'Settings'].includes(activeTab) && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeTab}</h2>
                <p className="text-gray-600">This section is coming soon!</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-bottom">
        <div className="relative">
          <div className="grid grid-cols-5 gap-1 px-2 py-2">
            {/* Home */}
            <button 
              onClick={() => setActiveTab('Home Feed')}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                activeTab === 'Home Feed' ? 'text-orange-500' : 'text-gray-600'
              }`}
            >
              <Home className="w-6 h-6" fill={activeTab === 'Home Feed' ? 'currentColor' : 'none'} />
              <span className="text-xs font-medium">Home</span>
            </button>
            
            {/* Discover */}
            <button 
              onClick={() => setActiveTab('Discover')}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                activeTab === 'Discover' ? 'text-orange-500' : 'text-gray-600'
              }`}
            >
              <Compass className="w-6 h-6" />
              <span className="text-xs font-medium">Discover</span>
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
                activeTab === 'Messages' ? 'text-orange-500' : 'text-gray-600'
              }`}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs font-medium">Messages</span>
              {unreadMessages > 0 && (
                <span className="absolute top-1 right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </button>
            
            {/* More Menu */}
            <button 
              onClick={() => setActiveTab('Communities')}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                activeTab === 'Communities' ? 'text-orange-500' : 'text-gray-600'
              }`}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs font-medium">Communities</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}