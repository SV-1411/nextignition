import { PortfolioItem } from './PortfolioItem';
import { AIPortfolioInsights } from './AIPortfolioInsights';
import { EnhancedHomeFeed } from './EnhancedHomeFeed';
import { ProfilePage } from './ProfilePage';
import { SettingsPage } from './SettingsPage';
import { CommunitiesPage } from './CommunitiesPage';
import { MessagingPage } from './MessagingPage';
import { FundingPortalInvestor } from './FundingPortalInvestor';
import { DealRoomPage } from './DealRoomPage';
import { EventsPage } from './EventsPage';
import { PodcastsPage } from './PodcastsPage';
import { NewsFeedPage } from './NewsFeedPage';
import { NotificationsDropdown } from './NotificationsDropdown';
import { IgnishaAI } from './IgnishaAI';
import { EnhancedIgnishaAI } from './EnhancedIgnishaAI';
import { IgnishaAIDashboard } from './IgnishaAIDashboard';
import { DealFlowPipeline } from './DealFlowPipeline';
import { InvestorAnalytics } from './InvestorAnalytics';
import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { 
  Home, 
  TrendingUp, 
  Search, 
  Bell, 
  DollarSign, 
  Users, 
  MessageCircle, 
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  FileText,
  Star,
  BarChart3,
  Settings,
  User,
  Filter,
  Calendar,
  MapPin,
  Target,
  ArrowUpRight,
  Eye,
  Heart,
  Bookmark,
  Plus,
  Sparkles,
  CheckCircle,
  Clock,
  ThumbsUp,
  MessageSquare,
  FolderOpen,
  PieChart,
  Activity,
  Award,
  Lock,
  Download,
  Upload,
  Mic,
  Newspaper
} from 'lucide-react';
import logoImage from 'figma:asset/faed1dd832314fe381fd34c35312b9faa571832d.png';
import squareLogo from 'figma:asset/c1daa721302db62b744322e73e636f7b8f029976.png';
import { brandColors } from '../utils/colors';
import { StartupProfilePage } from './StartupProfilePage';
import { DiscoverStartups } from './DiscoverStartups';
import { DiscoverInvestor } from './DiscoverInvestor';
import { RoleSwitcher, UserRole } from './RoleSwitcher';
import { FounderDashboard } from './FounderDashboard';
import { ExpertDashboard } from './ExpertDashboard';

export function InvestorDashboard() {
  const [activeTab, setActiveTab] = useState('Home Feed');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [view, setView] = useState<'home' | 'discover' | 'pipeline' | 'portfolio' | 'dealroom'>('home');
  const [currentRole, setCurrentRole] = useState<UserRole>('investor');

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    console.log(`Switching to ${newRole} dashboard`);
  };

  // Otherwise render investor dashboard
  const sidebarItems: SidebarItem[] = [
    { icon: Home, label: 'Home Feed' },
    { icon: Target, label: 'Discover', badge: 24 },
    { icon: Briefcase, label: 'Pipeline' },
    { icon: FolderOpen, label: 'Deal Rooms', badge: 3 },
    { icon: PieChart, label: 'Portfolio' },
    { icon: BarChart3, label: 'Analytics' },
    { icon: MessageCircle, label: 'Messages', badge: 12 },
    { icon: Users, label: 'Communities' },
    { icon: Calendar, label: 'Events' },
    { icon: Sparkles, label: 'Ignisha AI' },
    { icon: Mic, label: 'Podcasts' },
    { icon: Newspaper, label: 'News' },
    { icon: User, label: 'Profile' },
    { icon: Settings, label: 'Settings' },
  ];

  const startups: Startup[] = [
    {
      id: 1,
      name: 'TechFlow AI',
      tagline: 'AI-powered workflow automation for enterprises',
      founder: 'Sarah Chen',
      industry: 'Enterprise SaaS',
      stage: 'Series A',
      fundingGoal: '$5M',
      raised: '$2.3M',
      valuation: '$20M',
      location: 'San Francisco, CA',
      teamSize: 12,
      revenue: '$480K ARR',
      growth: '+340% YoY',
      matchScore: 94,
    },
    {
      id: 2,
      name: 'GreenScale',
      tagline: 'Blockchain-based carbon credit marketplace',
      founder: 'Marcus Williams',
      industry: 'Climate Tech',
      stage: 'Seed',
      fundingGoal: '$2M',
      raised: '$800K',
      valuation: '$8M',
      location: 'Austin, TX',
      teamSize: 8,
      revenue: '$120K ARR',
      growth: '+280% YoY',
      matchScore: 88,
    },
    {
      id: 3,
      name: 'HealthAI',
      tagline: 'AI diagnostics for early disease detection',
      founder: 'Dr. Lisa Zhang',
      industry: 'HealthTech',
      stage: 'Seed',
      fundingGoal: '$3M',
      raised: '$1.5M',
      valuation: '$12M',
      location: 'Boston, MA',
      teamSize: 15,
      revenue: '$200K ARR',
      growth: '+420% YoY',
      matchScore: 92,
    },
  ];

  const dealFlow: DealFlowItem[] = [
    {
      id: 1,
      startup: 'TechFlow AI',
      founder: 'Sarah Chen',
      amount: '$500K',
      stage: 'Series A',
      lastUpdated: '2 hours ago',
      status: 'interested',
    },
    {
      id: 2,
      startup: 'FinanceHub',
      founder: 'David Park',
      amount: '$250K',
      stage: 'Seed',
      lastUpdated: '1 day ago',
      status: 'review',
    },
    {
      id: 3,
      startup: 'EduTech Pro',
      founder: 'Maria Garcia',
      amount: '$750K',
      stage: 'Series A',
      lastUpdated: '3 days ago',
      status: 'negotiating',
    },
    {
      id: 4,
      startup: 'CloudScale',
      founder: 'James Miller',
      amount: '$1M',
      stage: 'Series B',
      lastUpdated: '1 week ago',
      status: 'invested',
    },
  ];

  const portfolio: PortfolioItem[] = [
    {
      id: 1,
      startup: 'CloudScale',
      invested: '$1M',
      equity: '8%',
      currentValue: '$2.4M',
      roi: 140,
      sector: 'Cloud Infrastructure',
    },
    {
      id: 2,
      startup: 'DataViz',
      invested: '$500K',
      equity: '12%',
      currentValue: '$850K',
      roi: 70,
      sector: 'Data Analytics',
    },
    {
      id: 3,
      startup: 'SecureAuth',
      invested: '$750K',
      equity: '10%',
      currentValue: '$1.2M',
      roi: 60,
      sector: 'Cybersecurity',
    },
  ];

  const filterCategories = [
    {
      title: 'Industry',
      options: ['Enterprise SaaS', 'FinTech', 'HealthTech', 'Climate Tech', 'EdTech', 'E-commerce'],
    },
    {
      title: 'Funding Stage',
      options: ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+'],
    },
    {
      title: 'Location',
      options: ['San Francisco', 'New York', 'Austin', 'Boston', 'Remote'],
    },
    {
      title: 'Team Size',
      options: ['1-5', '6-10', '11-20', '21-50', '51+'],
    },
    {
      title: 'Revenue',
      options: ['Pre-revenue', '$0-100K', '$100K-1M', '$1M-10M', '$10M+'],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interested':
        return 'bg-blue-100 text-blue-700';
      case 'review':
        return 'bg-yellow-100 text-yellow-700';
      case 'negotiating':
        return 'bg-purple-100 text-purple-700';
      case 'invested':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'interested':
        return Eye;
      case 'review':
        return Clock;
      case 'negotiating':
        return Activity;
      case 'invested':
        return CheckCircle;
      default:
        return Clock;
    }
  };

  // Swipe functionality for mobile
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x > 100) {
      // Swiped right - Interested
      console.log('Interested in:', startups[currentCardIndex].name);
      setCurrentCardIndex((prev) => (prev + 1) % startups.length);
    } else if (info.offset.x < -100) {
      // Swiped left - Pass
      console.log('Passed on:', startups[currentCardIndex].name);
      setCurrentCardIndex((prev) => (prev + 1) % startups.length);
    }
    x.set(0);
  };

  // If user switches to a different role, render that dashboard
  if (currentRole === 'founder') {
    return <FounderDashboard />;
  }

  if (currentRole === 'expert') {
    return <ExpertDashboard />;
  }

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
                if (item.label === 'Home Feed') setView('home');
                else if (item.label === 'Discover') setView('discover');
                else if (item.label === 'Pipeline') setView('pipeline');
                else if (item.label === 'Portfolio') setView('portfolio');
                else if (item.label === 'Deal Rooms') setView('dealroom');
                else setView('home'); // Reset view for other tabs
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
                      if (item.label === 'Home Feed') setView('home');
                      if (item.label === 'Discover') setView('discover');
                      if (item.label === 'Pipeline') setView('pipeline');
                      if (item.label === 'Portfolio') setView('portfolio');
                      if (item.label === 'Deal Rooms') setView('dealroom');
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                      activeTab === item.label
                        ? 'bg-gradient-to-r text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={activeTab === item.label ? {
                      background: `linear-gradient(135deg, ${brandColors.navyBlue}, ${brandColors.electricBlue})`
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
      <motion.main 
        animate={{ 
          marginLeft: window.innerWidth >= 1024 ? (isSidebarCollapsed ? 80 : 256) : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="pb-20 lg:pb-0"
        style={{
          width: window.innerWidth >= 1024 
            ? `calc(100% - ${isSidebarCollapsed ? 80 : 256}px)` 
            : '100%'
        }}
      >
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
              <h1 className="text-xl font-bold text-gray-900 truncate">{activeTab}</h1>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Desktop Role Switcher */}
              <div className="hidden lg:block">
                <RoleSwitcher 
                  currentRole={currentRole} 
                  onRoleChange={handleRoleChange}
                />
              </div>
              <button className="relative p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-navy-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                JV
              </div>
            </div>
          </div>
        </header>

        <div className="p-[0px]">
          {/* Home Feed View */}
          {view === 'home' && activeTab === 'Home Feed' && <EnhancedHomeFeed userType="investor" />}

          {/* Discover View */}
          {view === 'discover' && activeTab === 'Discover' && <DiscoverInvestor />}

          {/* Messages View */}
          {activeTab === 'Messages' && (
            <MessagingPage userRole="investor" userId={1} />
          )}

          {/* Communities View */}
          {activeTab === 'Communities' && (
            <CommunitiesPage userRole="investor" userId={1} />
          )}

          {/* Events View */}
          {activeTab === 'Events' && (
            <EventsPage userRole="investor" userId={1} />
          )}

          {/* Podcasts View */}
          {activeTab === 'Podcasts' && (
            <PodcastsPage userRole="investor" />
          )}

          {/* News View */}
          {activeTab === 'News' && (
            <NewsFeedPage userRole="investor" userId={1} />
          )}

          {/* Ignisha AI View */}
          {activeTab === 'Ignisha AI' && (
            <IgnishaAIDashboard userRole="investor" />
          )}

          {/* Profile View */}
          {activeTab === 'Profile' && <ProfilePage userRole="investor" onNavigateToSettings={() => setActiveTab('Settings')} />}

          {/* Settings View */}
          {activeTab === 'Settings' && <SettingsPage userRole="investor" />}

          {/* Analytics View */}
          {activeTab === 'Analytics' && <InvestorAnalytics />}

          {/* Pipeline View - Kanban Board */}
          {view === 'pipeline' && activeTab === 'Pipeline' && (
            <DealFlowPipeline />
          )}

          {/* Portfolio View - Analytics */}
          {view === 'portfolio' && activeTab === 'Portfolio' && (
            <>
              {/* AI Portfolio Insights Widget */}
              <div className="mb-6">
                <AIPortfolioInsights />
              </div>

              {/* Portfolio Summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-[24px] mt-[0px] mr-[24px] ml-[24px]">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <DollarSign className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-2xl font-bold mb-1">$2.25M</div>
                  <div className="text-sm text-white/80">Total Invested</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-2xl font-bold mb-1">$4.45M</div>
                  <div className="text-sm text-white/80">Current Value</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                  <Award className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-2xl font-bold mb-1">+98%</div>
                  <div className="text-sm text-white/80">Total ROI</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                  <Briefcase className="w-8 h-8 mb-3 opacity-80" />
                  <div className="text-2xl font-bold mb-1">{portfolio.length}</div>
                  <div className="text-sm text-white/80">Active Investments</div>
                </div>
              </div>

              {/* Portfolio Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-bold">Portfolio Companies</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Sector</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Invested</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Equity</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Current Value</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">ROI</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {portfolio.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-bold text-sm">{item.startup}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">{item.sector}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium">{item.invested}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium">{item.equity}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-green-600">{item.currentValue}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`text-sm font-bold ${item.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              +{item.roi}%
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-sm text-blue-600 font-medium hover:underline">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Deal Room View */}
          {view === 'dealroom' && activeTab === 'Deal Rooms' && (
            <DealRoomPage />
          )}
        </div>
      </motion.main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-bottom">
        <div className="relative">
          <div className="grid grid-cols-5 gap-1 px-2 py-2">
            {/* Home Feed */}
            <button 
              onClick={() => {
                setActiveTab('Home Feed');
                setView('home');
              }}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                activeTab === 'Home Feed' ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              <Home className="w-6 h-6" fill={activeTab === 'Home Feed' ? 'currentColor' : 'none'} />
              <span className="text-xs font-medium">Home</span>
            </button>
            
            {/* Discover */}
            <button 
              onClick={() => {
                setActiveTab('Discover');
                setView('discover');
              }}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                activeTab === 'Discover' ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              <Target className="w-6 h-6" fill={activeTab === 'Discover' ? 'currentColor' : 'none'} />
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
            
            {/* Pipeline */}
            <button 
              onClick={() => {
                setActiveTab('Pipeline');
                setView('pipeline');
              }}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                activeTab === 'Pipeline' ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              <Briefcase className="w-6 h-6" />
              <span className="text-xs font-medium">Pipeline</span>
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
              {12 > 0 && (
                <span className="absolute top-1 right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  12
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}