import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  BarChart3,
  Activity,
  Users,
  UserCheck,
  UserX,
  Search,
  CreditCard,
  FileText,
  Flag,
  Image,
  MessageSquare,
  Rocket,
  Briefcase,
  GraduationCap,
  Calendar,
  Mic,
  DollarSign,
  TrendingUp,
  Gift,
  Filter as FilterIcon,
  Shield,
  AlertTriangle,
  ScrollText,
  Lock,
  Settings,
  Palette,
  Mail,
  Bot,
  Wrench,
  ExternalLink,
  LogOut,
  Bell,
  ChevronDown,
  X,
  Check,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  RefreshCw,
  ChevronRight,
  TrendingDown,
  Target,
  Zap,
  Award,
  Clock,
  Menu,
  ArrowRight
} from 'lucide-react';
import { brandColors } from '../utils/colors';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

type NavigationItem = {
  id: string;
  label: string;
  icon: any;
  section?: string;
};

type User = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: 'Founder' | 'Expert' | 'Investor';
  status: 'Pending' | 'Active' | 'Suspended' | 'Flagged';
  tier: 'Free' | 'Pro' | 'Elite' | 'Expert' | 'Investor';
  joined: string;
  lastActive: string;
};

type ReportedContent = {
  id: string;
  type: 'Post' | 'Comment' | 'Message';
  author: string;
  content: string;
  reportCount: number;
  reasons: string[];
  aiRisk: 'High' | 'Medium' | 'Low';
  timestamp: string;
};

export function AdminDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [analyticsTab, setAnalyticsTab] = useState('revenue');
  const [showAlerts, setShowAlerts] = useState(true);

  // Navigation structure
  const navigation: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'Overview' },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3, section: 'Overview' },
    { id: 'activity', label: 'Real-time Activity', icon: Activity, section: 'Overview' },
    { id: 'all-users', label: 'All Users', icon: Users, section: 'User Management' },
    { id: 'pending', label: 'Pending Approvals', icon: UserCheck, section: 'User Management' },
    { id: 'flagged', label: 'Flagged/Suspended', icon: UserX, section: 'User Management' },
    { id: 'user-search', label: 'Advanced Search', icon: Search, section: 'User Management' },
    { id: 'subscriptions', label: 'Subscription Management', icon: CreditCard, section: 'User Management' },
    { id: 'posts', label: 'Posts & Comments', icon: FileText, section: 'Content Moderation' },
    { id: 'reported', label: 'Reported Content', icon: Flag, section: 'Content Moderation' },
    { id: 'media', label: 'Media Review', icon: Image, section: 'Content Moderation' },
    { id: 'chat', label: 'Chat Monitoring', icon: MessageSquare, section: 'Content Moderation' },
    { id: 'startups', label: 'Startups Management', icon: Rocket, section: 'Platform Operations' },
    { id: 'investors', label: 'Investors Management', icon: Briefcase, section: 'Platform Operations' },
    { id: 'experts', label: 'Experts Management', icon: GraduationCap, section: 'Platform Operations' },
    { id: 'events', label: 'Events & Webinars', icon: Calendar, section: 'Platform Operations' },
    { id: 'podcasts', label: 'Podcasts Management', icon: Mic, section: 'Platform Operations' },
    { id: 'payments', label: 'Payment Tracking', icon: DollarSign, section: 'Business & Revenue' },
    { id: 'revenue', label: 'Revenue Analytics', icon: TrendingUp, section: 'Business & Revenue' },
    { id: 'referrals', label: 'Referrals & Rewards', icon: Gift, section: 'Business & Revenue' },
    { id: 'conversion', label: 'Conversion Funnels', icon: FilterIcon, section: 'Business & Revenue' },
    { id: 'security', label: 'Security Dashboard', icon: Shield, section: 'Security & Compliance' },
    { id: 'alerts', label: 'Alert Center', icon: AlertTriangle, section: 'Security & Compliance' },
    { id: 'audit', label: 'Audit Logs', icon: ScrollText, section: 'Security & Compliance' },
    { id: 'access', label: 'Access Control', icon: Lock, section: 'Security & Compliance' },
    { id: 'config', label: 'Platform Configuration', icon: Palette, section: 'Settings' },
    { id: 'email', label: 'Email Templates', icon: Mail, section: 'Settings' },
    { id: 'ai', label: 'AI Settings', icon: Bot, section: 'Settings' },
    { id: 'system', label: 'System Settings', icon: Wrench, section: 'Settings' },
  ];

  // Mock data
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Rahul Shah',
      username: 'rahulshah',
      avatar: 'RS',
      role: 'Founder',
      status: 'Pending',
      tier: 'Free',
      joined: 'Jan 28',
      lastActive: '-'
    },
    {
      id: '2',
      name: 'Priya Kumar',
      username: 'priyak',
      avatar: 'PK',
      role: 'Expert',
      status: 'Active',
      tier: 'Expert',
      joined: 'Jan 25',
      lastActive: '2 hrs ago'
    },
    {
      id: '3',
      name: 'Amit Ventures',
      username: 'amitvc',
      avatar: 'AV',
      role: 'Investor',
      status: 'Active',
      tier: 'Investor',
      joined: 'Jan 20',
      lastActive: '1 day ago'
    },
    {
      id: '4',
      name: 'Fake User',
      username: 'spam123',
      avatar: 'FU',
      role: 'Founder',
      status: 'Flagged',
      tier: 'Free',
      joined: 'Jan 29',
      lastActive: '5 mins ago'
    }
  ];

  const reportedContent: ReportedContent[] = [
    {
      id: '1',
      type: 'Post',
      author: '@rahul_founder',
      content: 'Check out this amazing crypto scheme that will 10x your investment...',
      reportCount: 5,
      reasons: ['Spam (3 reports)', 'Inappropriate content (2)'],
      aiRisk: 'High',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'Comment',
      author: '@newuser456',
      content: 'Contact me for quick loans, no documentation needed!',
      reportCount: 3,
      reasons: ['Spam (3 reports)'],
      aiRisk: 'High',
      timestamp: '4 hours ago'
    }
  ];

  const revenueData = [
    { month: 'Jul', subscriptions: 8.2, featured: 1.8, events: 0.9, total: 10.9 },
    { month: 'Aug', subscriptions: 9.5, featured: 2.1, events: 1.2, total: 12.8 },
    { month: 'Sep', subscriptions: 11.2, featured: 2.3, events: 1.4, total: 14.9 },
    { month: 'Oct', subscriptions: 12.8, featured: 2.5, events: 1.5, total: 16.8 },
    { month: 'Nov', subscriptions: 13.5, featured: 2.6, events: 1.6, total: 17.7 },
    { month: 'Dec', subscriptions: 14.2, featured: 2.8, events: 1.7, total: 18.7 }
  ];

  const userGrowthData = [
    { month: 'Jul', total: 8234, founders: 3421, experts: 1523, investors: 1234, active: 5123 },
    { month: 'Aug', total: 9456, founders: 3892, experts: 1734, investors: 1389, active: 5834 },
    { month: 'Sep', total: 10234, founders: 4234, experts: 1892, investors: 1523, active: 6421 },
    { month: 'Oct', total: 11234, founders: 4623, experts: 2034, investors: 1678, active: 7123 },
    { month: 'Nov', total: 12000, founders: 4923, experts: 2145, investors: 1789, active: 7834 },
    { month: 'Dec', total: 12847, founders: 5234, experts: 2108, investors: 1847, active: 8234 }
  ];

  const tierBreakdown = [
    { name: 'Pro', value: 2.2, count: 2234, color: brandColors.electricBlue },
    { name: 'Elite', value: 4.3, count: 1423, color: brandColors.atomicOrange },
    { name: 'Expert', value: 1.7, count: 847, color: brandColors.navyBlue },
    { name: 'Investor', value: 5.9, count: 387, color: '#10b981' }
  ];

  // Group navigation by section
  const groupedNav = navigation.reduce((acc, item) => {
    const section = item.section || 'Other';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  const sections = ['Overview', 'User Management', 'Content Moderation', 'Platform Operations', 'Business & Revenue', 'Security & Compliance', 'Settings'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#f59e0b';
      case 'Active': return '#10b981';
      case 'Suspended': return '#ef4444';
      case 'Flagged': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Founder': return Rocket;
      case 'Expert': return GraduationCap;
      case 'Investor': return Briefcase;
      default: return Users;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-lg">Admin</h1>
        <div className="flex items-center gap-2">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
            AD
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || mobileMenuOpen) && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`${
              mobileMenuOpen ? 'fixed inset-0 z-40' : 'hidden lg:block'
            } lg:w-[18%] bg-white border-r border-gray-200 overflow-y-auto`}
            style={{ paddingTop: mobileMenuOpen ? '60px' : '0' }}
          >
            {/* Mobile Overlay */}
            {mobileMenuOpen && (
              <div className="lg:hidden fixed inset-0 bg-black/50 -z-10" onClick={() => setMobileMenuOpen(false)} />
            )}

            <div className="p-6">
              {/* Logo */}
              <div className="mb-6 hidden lg:block">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl font-bold" style={{ color: brandColors.electricBlue }}>
                    NextIgnition
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">Admin Panel</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Logged in as: Admin User</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-6">
                {sections.map(section => (
                  <div key={section}>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                      {section === 'Overview' && '📊'}
                      {section === 'User Management' && '👥'}
                      {section === 'Content Moderation' && '📝'}
                      {section === 'Platform Operations' && '🎯'}
                      {section === 'Business & Revenue' && '💰'}
                      {section === 'Security & Compliance' && '🔒'}
                      {section === 'Settings' && '⚙️'}
                      {section}
                    </h3>
                    <div className="space-y-1">
                      {groupedNav[section]?.map(item => {
                        const Icon = item.icon;
                        const isActive = activeView === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveView(item.id);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              isActive
                                ? 'text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            style={isActive ? { backgroundColor: brandColors.electricBlue } : {}}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="flex-1 text-left">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Bottom Section */}
              <div className="mt-8 pt-6 border-t border-gray-200 space-y-2">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                  <ExternalLink className="w-4 h-4" />
                  View Live Site
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header */}
        <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Platform Overview</h1>
                <p className="text-sm text-gray-500">Updated 2 mins ago</p>
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                  autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto-refresh
              </button>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{ focusRingColor: brandColors.electricBlue }}
              >
                <option>Today</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Quarter</option>
                <option>Custom</option>
              </select>
              <div className="relative">
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Quick Actions
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showQuickActions && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Add User</button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Feature Startup</button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Send Platform Announcement</button>
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Export Report</button>
                  </div>
                )}
              </div>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  23
                </span>
              </button>
              <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                  AD
                </div>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6" style={{ paddingTop: mobileMenuOpen ? '0' : '70px' }}>
          {/* Mobile Quick Stats */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm flex-shrink-0">
              <Users className="w-4 h-4" style={{ color: brandColors.electricBlue }} />
              <div>
                <p className="text-xs text-gray-500">Users</p>
                <p className="text-sm font-bold">12.8K</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm flex-shrink-0">
              <DollarSign className="w-4 h-4" style={{ color: brandColors.atomicOrange }} />
              <div>
                <p className="text-xs text-gray-500">Revenue</p>
                <p className="text-sm font-bold">₹18.7L</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-xs text-gray-500">Alerts</p>
                <p className="text-sm font-bold">15</p>
              </div>
            </div>
          </div>

          {activeView === 'dashboard' && (
            <>
              {/* Critical Alerts Banner */}
              {showAlerts && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-bold">ALERTS:</span>
                    </div>
                    <ul className="space-y-1 text-sm">
                      <li>• 15 users pending approval (&gt;48 hours)</li>
                      <li>• 8 reported posts need review</li>
                      <li>• System backup due in 2 hours</li>
                    </ul>
                    <div className="flex gap-2 mt-3">
                      <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium">
                        Review
                      </button>
                      <button
                        onClick={() => setShowAlerts(false)}
                        className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium"
                      >
                        Dismiss All
                      </button>
                    </div>
                  </div>
                  <button onClick={() => setShowAlerts(false)} className="p-1 hover:bg-white/20 rounded">
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {/* Card 1: Total Users */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandColors.electricBlue}20` }}>
                      <Users className="w-6 h-6" style={{ color: brandColors.electricBlue }} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl lg:text-3xl font-bold">12,847</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">+342 this week</span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <div className="flex justify-between">
                      <span>Founders:</span>
                      <span className="font-medium">5,234 (41%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Experts:</span>
                      <span className="font-medium">2,108 (16%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investors:</span>
                      <span className="font-medium">1,847 (14%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Free tier:</span>
                      <span className="font-medium">3,658 (29%)</span>
                    </div>
                  </div>
                  <button className="text-sm font-medium hover:underline" style={{ color: brandColors.electricBlue }}>
                    View All Users →
                  </button>
                </motion.div>

                {/* Card 2: Active Subscriptions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandColors.atomicOrange}20` }}>
                      <CreditCard className="w-6 h-6" style={{ color: brandColors.atomicOrange }} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Subscriptions</p>
                      <p className="text-2xl lg:text-3xl font-bold">4,891</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-lg font-bold" style={{ color: brandColors.atomicOrange }}>₹14.2L MRR</p>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <div className="flex justify-between">
                      <span>Pro:</span>
                      <span className="font-medium">2,234 (₹2.2L)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Elite:</span>
                      <span className="font-medium">1,423 (₹4.3L)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expert:</span>
                      <span className="font-medium">847 (₹1.7L)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investor:</span>
                      <span className="font-medium">387 (₹1.9L)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">+12% vs last month</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Churn rate: <span className="font-medium">2.3%</span>
                  </div>
                </motion.div>

                {/* Card 3: Platform Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${brandColors.navyBlue}20` }}>
                      <Zap className="w-6 h-6" style={{ color: brandColors.navyBlue }} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Platform Activity</p>
                      <p className="text-2xl lg:text-3xl font-bold">8,234</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">actions today</p>
                    <p className="text-lg font-bold">142K this week</p>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <div className="flex justify-between">
                      <span>Posts:</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Messages:</span>
                      <span className="font-medium">3,892</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profile views:</span>
                      <span className="font-medium">2,341</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Connections:</span>
                      <span className="font-medium">754</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Engagement Rate:</span>
                    <span className="font-bold ml-2" style={{ color: brandColors.navyBlue }}>68% DAU/MAU</span>
                  </div>
                </motion.div>

                {/* Card 4: Revenue Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Revenue Overview</p>
                      <p className="text-2xl lg:text-3xl font-bold">₹18.7L</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Target: ₹25L</span>
                      <span className="text-xs font-medium">75%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-gray-600 mb-3">
                    <div className="flex justify-between">
                      <span>Subscriptions:</span>
                      <span className="font-medium">₹14.2L (76%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Featured:</span>
                      <span className="font-medium">₹2.8L (15%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Events:</span>
                      <span className="font-medium">₹1.7L (9%)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">+18% vs last month</span>
                  </div>
                </motion.div>
              </div>

              {/* User Management Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel: Recent User Registrations */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <h2 className="text-lg lg:text-xl font-bold">Recent User Registrations</h2>
                    <div className="flex gap-2">
                      <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                        <option>All Roles</option>
                        <option>Founders</option>
                        <option>Experts</option>
                        <option>Investors</option>
                      </select>
                      <button className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search by name, email, @username..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2"
                      style={{ focusRingColor: brandColors.electricBlue }}
                    />
                  </div>
                  <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
                    <table className="w-full min-w-[640px]">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">User</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Role</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Status</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Tier</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Joined</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Last Active</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockUsers.map((user, index) => (
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
                                  {user.avatar}
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{user.name}</p>
                                  <p className="text-xs text-gray-500">@{user.username}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3">
                              <span
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white"
                                style={{ backgroundColor: getStatusColor(user.status) }}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3">
                              <span className="text-sm">{user.tier}</span>
                            </td>
                            <td className="py-3">
                              <span className="text-sm text-gray-600">{user.joined}</span>
                            </td>
                            <td className="py-3">
                              <span className="text-sm text-gray-600">{user.lastActive}</span>
                            </td>
                            <td className="py-3">
                              <button className="p-1 hover:bg-gray-200 rounded">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-between mt-4 text-sm">
                    <span className="text-gray-600">Showing 1-4 of 1,247</span>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Previous</button>
                      <button className="px-3 py-1 border rounded hover:bg-gray-50" style={{ borderColor: brandColors.electricBlue, color: brandColors.electricBlue }}>1</button>
                      <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
                      <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">3</button>
                      <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">Next</button>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Pending Approvals Queue */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Pending Approvals</h2>
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">15</span>
                  </div>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {/* Pending Approval Card */}
                    <div className="border-2 border-orange-200 rounded-xl p-4 bg-orange-50/50">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          SP
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm">Sameer Patel</p>
                          <p className="text-xs text-gray-600">@sameerpatel | Investor</p>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-start gap-2 text-xs text-orange-700 bg-orange-100 p-2 rounded">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">Flagged: Suspicious LinkedIn</p>
                            <p className="text-orange-600">profile (no connections)</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-3 space-y-1">
                        <p>Registered: Jan 28, 2026</p>
                        <p>Requested tier: Investor (₹4,999/m)</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600">
                          <Check className="w-3 h-3" />
                          Approve
                        </button>
                        <button className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-300">
                          Request Info
                        </button>
                        <button className="flex items-center justify-center gap-1 px-3 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600">
                          <X className="w-3 h-3" />
                          Reject
                        </button>
                        <button className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50">
                          <Eye className="w-3 h-3" />
                          View Profile
                        </button>
                      </div>
                    </div>

                    {/* More pending approvals */}
                    <div className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          NK
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm">Neha Kumar</p>
                          <p className="text-xs text-gray-600">@nehak | Expert</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-3 space-y-1">
                        <p>Registered: Jan 27, 2026</p>
                        <p>Requested tier: Expert (₹1,999/m)</p>
                        <p className="text-green-600">✓ All checks passed</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600">
                          <Check className="w-3 h-3" />
                          Approve
                        </button>
                        <button className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50">
                          <Eye className="w-3 h-3" />
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-4 py-2 text-sm font-medium hover:underline" style={{ color: brandColors.electricBlue }}>
                    View All Pending (15) →
                  </button>
                </div>
              </div>

              {/* Content Moderation Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Reported Content Feed */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <h2 className="text-lg lg:text-xl font-bold">Reported Content</h2>
                    <div className="flex gap-2">
                      <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                        <option>All Types</option>
                        <option>Posts</option>
                        <option>Comments</option>
                        <option>Messages</option>
                      </select>
                      <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                        <option>Most Reported</option>
                        <option>Recent</option>
                        <option>Severity</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {reportedContent.map(item => (
                      <div key={item.id} className={`border-2 rounded-xl p-4 ${
                        item.aiRisk === 'High' ? 'border-red-200 bg-red-50/50' :
                        item.aiRisk === 'Medium' ? 'border-orange-200 bg-orange-50/50' :
                        'border-yellow-200 bg-yellow-50/50'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Flag className={`w-4 h-4 ${
                                item.aiRisk === 'High' ? 'text-red-500' :
                                item.aiRisk === 'Medium' ? 'text-orange-500' :
                                'text-yellow-500'
                              }`} />
                              <span className="font-bold text-sm uppercase">{item.type} REPORTED</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                item.aiRisk === 'High' ? 'bg-red-500 text-white' :
                                item.aiRisk === 'Medium' ? 'bg-orange-500 text-white' :
                                'bg-yellow-500 text-white'
                              }`}>
                                {item.reportCount} reports
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">By: {item.author} | {item.timestamp}</p>
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm text-gray-700 line-clamp-2">"{item.content}"</p>
                        </div>
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-700 mb-1">Reports:</p>
                          <ul className="text-xs text-gray-600 space-y-0.5">
                            {item.reasons.map((reason, idx) => (
                              <li key={idx}>• {reason}</li>
                            ))}
                          </ul>
                        </div>
                        <div className={`flex items-center gap-2 p-2 rounded text-xs font-medium mb-3 ${
                          item.aiRisk === 'High' ? 'bg-red-100 text-red-700' :
                          item.aiRisk === 'Medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          <Bot className="w-4 h-4" />
                          <span>AI Analysis: {item.aiRisk} risk - likely spam</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button className="px-3 py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50">
                            View Full {item.type}
                          </button>
                          <button className="px-3 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600">
                            Hide {item.type}
                          </button>
                          <button className="px-3 py-2 bg-yellow-500 text-white text-xs font-bold rounded-lg hover:bg-yellow-600">
                            Warn User
                          </button>
                          <button className="px-3 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600">
                            Ban User
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: AI Moderation Insights */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg lg:text-xl font-bold">AI Moderation Dashboard</h2>
                    <div className="flex items-center gap-2 text-xs text-purple-600">
                      <Bot className="w-4 h-4" />
                      <span className="font-medium">Powered by Ignisha AI</span>
                    </div>
                  </div>

                  {/* Auto-Moderation Stats */}
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
                    <h3 className="font-bold text-sm mb-3">Today's Auto-Actions:</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-red-500 rounded"></div>
                        <span className="text-gray-700">Auto-hidden: <span className="font-bold">23 posts</span> (spam detected)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-orange-500 rounded"></div>
                        <span className="text-gray-700">Auto-flagged: <span className="font-bold">47 items</span> (manual review)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-green-500 rounded"></div>
                        <span className="text-gray-700">Auto-approved: <span className="font-bold">892 items</span> (safe)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 bg-yellow-500 rounded"></div>
                        <span className="text-gray-700">False positives: <span className="font-bold">2</span> (users appealed)</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-purple-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Accuracy Rate:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-600">97.8%</span>
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  <div className="mb-4">
                    <h3 className="font-bold text-sm mb-3">Category Breakdown:</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Spam', value: 45, color: '#ef4444' },
                              { name: 'Inappropriate', value: 30, color: '#f59e0b' },
                              { name: 'Misleading', value: 15, color: '#3b82f6' },
                              { name: 'Other', value: 10, color: '#6b7280' }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.name}: ${entry.value}%`}
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {[
                              { name: 'Spam', value: 45, color: '#ef4444' },
                              { name: 'Inappropriate', value: 30, color: '#f59e0b' },
                              { name: 'Misleading', value: 15, color: '#3b82f6' },
                              { name: 'Other', value: 10, color: '#6b7280' }
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recent AI Actions */}
                  <div>
                    <h3 className="font-bold text-sm mb-3">Recent AI Actions:</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs">
                        <Bot className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Hidden post by @user123</p>
                          <p className="text-gray-600">(spam keyword detected)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs">
                        <Bot className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Flagged profile @newuser</p>
                          <p className="text-gray-600">(incomplete)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs">
                        <Bot className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Approved 47 comments</p>
                          <p className="text-gray-600">(safe)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Analytics Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <h2 className="text-lg lg:text-xl font-bold mb-4">Business Analytics</h2>
                
                {/* Tab Navigation */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-6 border-b border-gray-200 scrollbar-hide">
                  {[
                    { id: 'revenue', label: 'Revenue Analytics', icon: DollarSign },
                    { id: 'growth', label: 'User Growth', icon: TrendingUp },
                    { id: 'funnel', label: 'Conversion Funnel', icon: FilterIcon },
                    { id: 'engagement', label: 'Engagement Metrics', icon: Activity }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setAnalyticsTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                        analyticsTab === tab.id
                          ? 'text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      style={analyticsTab === tab.id ? { backgroundColor: brandColors.electricBlue } : {}}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Revenue Analytics Tab */}
                {analyticsTab === 'revenue' && (
                  <div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                      {/* Revenue Trend Chart */}
                      <div className="lg:col-span-2">
                        <h3 className="font-bold mb-4">Revenue Over Time</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis label={{ value: '₹ Lakhs', angle: -90, position: 'insideLeft' }} />
                              <Tooltip />
                              <Legend />
                              <Area type="monotone" dataKey="subscriptions" stackId="1" stroke={brandColors.electricBlue} fill={brandColors.electricBlue} />
                              <Area type="monotone" dataKey="featured" stackId="1" stroke={brandColors.atomicOrange} fill={brandColors.atomicOrange} />
                              <Area type="monotone" dataKey="events" stackId="1" stroke="#10b981" fill="#10b981" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Revenue Breakdown */}
                      <div>
                        <h3 className="font-bold mb-4">Subscription Tiers</h3>
                        <div className="h-64 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={tierBreakdown}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => `${entry.name}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {tierBreakdown.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-2 mt-4">
                          {tierBreakdown.map(tier => (
                            <div key={tier.name} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }}></div>
                                <span>{tier.name}:</span>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">₹{tier.value}L</p>
                                <p className="text-xs text-gray-600">{tier.count} users</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Other Revenue Streams */}
                    <div className="mt-6">
                      <h3 className="font-bold mb-4">Other Revenue Streams</h3>
                      <div className="space-y-3">
                        {[
                          { name: 'Featured Listings', value: 2.8, percent: 35, color: brandColors.atomicOrange },
                          { name: 'Event Tickets', value: 1.7, percent: 21, color: brandColors.electricBlue },
                          { name: 'Referral Credits', value: 1.2, percent: 15, color: '#10b981' },
                          { name: 'Sponsored Posts', value: 0.8, percent: 10, color: '#8b5cf6' },
                          { name: 'Other', value: 0.7, percent: 9, color: '#6b7280' }
                        ].map(stream => (
                          <div key={stream.name}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{stream.name}:</span>
                              <span className="text-sm font-bold">₹{stream.value}L ({stream.percent}%)</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${stream.percent}%`, backgroundColor: stream.color }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* User Growth Tab */}
                {analyticsTab === 'growth' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold">User Growth Trend</h3>
                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Growth Rate:</span>
                            <span className="text-green-600 font-bold">+12.3% MoM</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Net Growth:</span>
                            <span className="font-bold">+753</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={userGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="total" stroke={brandColors.navyBlue} strokeWidth={3} name="Total Users" />
                            <Line type="monotone" dataKey="founders" stroke={brandColors.electricBlue} name="Founders" />
                            <Line type="monotone" dataKey="experts" stroke={brandColors.atomicOrange} name="Experts" />
                            <Line type="monotone" dataKey="investors" stroke="#10b981" name="Investors" />
                            <Line type="monotone" dataKey="active" stroke="#8b5cf6" strokeDasharray="5 5" name="Active Users" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold mb-4">Acquisition Funnel</h3>
                      <div className="space-y-2">
                        {[
                          { label: 'Site Visitors', value: '24,892', percent: 100, width: 100 },
                          { label: 'Signed Up', value: '3,247', percent: 13, width: 80 },
                          { label: 'Completed Profile', value: '2,841', percent: 87, width: 65 },
                          { label: 'Verified Profile', value: '2,634', percent: 93, width: 50 },
                          { label: 'Paid Subscription', value: '847', percent: 32, width: 35 }
                        ].map((stage, index) => (
                          <div key={stage.label} className="relative">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-400 text-white p-3 rounded-lg"
                              style={{ width: `${stage.width}%`, marginLeft: `${(100 - stage.width) / 2}%` }}
                            >
                              <p className="font-bold text-sm">{stage.label}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold">{stage.value}</span>
                                {index > 0 && <span className="text-xs">{stage.percent}%</span>}
                              </div>
                            </div>
                            {index < 4 && (
                              <div className="flex justify-center">
                                <ChevronDown className="w-4 h-4 text-gray-400 my-1" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Conversion Funnel Tab */}
                {analyticsTab === 'funnel' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Funnel 1 */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-bold mb-3">Free → Paid Conversion</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Free Users:</span>
                            <span className="font-bold">8,234</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Viewed Pricing:</span>
                            <span className="font-bold">3,247 (39%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Started Checkout:</span>
                            <span className="font-bold">1,423 (44%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Completed Payment:</span>
                            <span className="font-bold">847 (60%)</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Overall:</span>
                            <div className="text-right">
                              <p className="font-bold text-lg" style={{ color: brandColors.electricBlue }}>10.3%</p>
                              <p className="text-xs text-red-600">Target: 15%</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Funnel 2 */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-bold mb-3">Founder → Investment</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Founders on Platform:</span>
                            <span className="font-bold">5,234</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Submitted Pitch:</span>
                            <span className="font-bold">2,847 (54%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Pitch Viewed:</span>
                            <span className="font-bold">1,923 (68%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Investor Interest:</span>
                            <span className="font-bold">847 (44%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Meeting Scheduled:</span>
                            <span className="font-bold">423 (50%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Investment Made:</span>
                            <span className="font-bold">89 (21%)</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Success Rate:</span>
                            <p className="font-bold text-lg" style={{ color: brandColors.atomicOrange }}>1.7%</p>
                          </div>
                        </div>
                      </div>

                      {/* Funnel 3 */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h3 className="font-bold mb-3">Event Registration → Attendance</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Saw Event:</span>
                            <span className="font-bold">12,847</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Registered:</span>
                            <span className="font-bold">3,247 (25%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Received Reminder:</span>
                            <span className="font-bold">3,247 (100%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Attended Live:</span>
                            <span className="font-bold">2,134 (66%)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Watched Recording:</span>
                            <span className="font-bold">847 (26%)</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Overall Engagement:</span>
                            <div className="text-right">
                              <p className="font-bold text-lg text-green-600">92%</p>
                              <p className="text-xs text-gray-600">Excellent ✓</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Engagement Metrics Tab */}
                {analyticsTab === 'engagement' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        title: 'Daily Active Users',
                        metrics: [
                          { label: 'DAU', value: '5,847' },
                          { label: 'WAU', value: '9,234' },
                          { label: 'MAU', value: '12,847' },
                          { label: 'DAU/MAU', value: '45%', status: 'healthy ✓' }
                        ]
                      },
                      {
                        title: 'Session Metrics',
                        metrics: [
                          { label: 'Avg Session Duration', value: '12m 34s' },
                          { label: 'Avg Sessions/User', value: '3.2/day' },
                          { label: 'Bounce Rate', value: '23%' }
                        ]
                      },
                      {
                        title: 'Content Creation',
                        metrics: [
                          { label: 'Posts/Day', value: '247' },
                          { label: 'Comments/Day', value: '1,423' },
                          { label: 'Messages/Day', value: '3,892' },
                          { label: 'Top Creator', value: '@techguru', subtitle: '(47 posts)' }
                        ]
                      },
                      {
                        title: 'Network Growth',
                        metrics: [
                          { label: 'Connections Made', value: '754/day' },
                          { label: 'Messages Sent', value: '3,892/day' },
                          { label: 'Profile Views', value: '8,234/day' },
                          { label: 'Avg Connections/User', value: '42' }
                        ]
                      },
                      {
                        title: 'Feature Adoption',
                        metrics: [
                          { label: 'Using AI Features', value: '34%' },
                          { label: 'Using Events', value: '58%' },
                          { label: 'Using Communities', value: '67%' },
                          { label: 'Using Deal Room', value: '12%' },
                          { label: 'Least Used', value: 'Job Board', subtitle: '(2%)' }
                        ]
                      },
                      {
                        title: 'Investor Activity',
                        metrics: [
                          { label: 'Startups Reviewed', value: '1,247' },
                          { label: 'Pitch Decks Viewed', value: '892' },
                          { label: 'Messages to Founders', value: '423' },
                          { label: 'Meetings Scheduled', value: '156' },
                          { label: 'Investments Made', value: '23' }
                        ]
                      }
                    ].map((card, index) => (
                      <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-50 rounded-xl p-4"
                      >
                        <h3 className="font-bold mb-3">{card.title}</h3>
                        <div className="space-y-2">
                          {card.metrics.map((metric, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">{metric.label}:</span>
                              <div className="text-right">
                                <span className="font-bold text-sm">{metric.value}</span>
                                {metric.subtitle && <p className="text-xs text-gray-500">{metric.subtitle}</p>}
                                {metric.status && <p className="text-xs text-green-600">{metric.status}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Security Dashboard */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                <h2 className="text-lg lg:text-xl font-bold mb-4">Security Dashboard</h2>
                
                {/* Alert Status Bar */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-green-700">All Systems Operational</p>
                      <p className="text-sm text-green-600">Last Security Scan: 15 mins ago | Next Scan: 45 mins</p>
                    </div>
                  </div>
                </div>

                {/* Security Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    {
                      title: 'Login Security',
                      metrics: [
                        { label: 'Failed Login Attempts Today', value: '47' },
                        { label: 'Suspicious IPs Blocked', value: '12' },
                        { label: '2FA Enabled Users', value: '78%' }
                      ]
                    },
                    {
                      title: 'Data Protection',
                      metrics: [
                        { label: 'Files Encrypted', value: '100%' },
                        { label: 'Backups Status', value: '✓ Up to date' },
                        { label: 'Last Backup', value: '2 hours ago' }
                      ]
                    },
                    {
                      title: 'User Reports',
                      metrics: [
                        { label: 'Spam Reports', value: '23 (pending)' },
                        { label: 'Fraud Reports', value: '5 (review)' },
                        { label: 'Banned Users', value: '47' }
                      ]
                    },
                    {
                      title: 'System Health',
                      metrics: [
                        { label: 'Server Uptime', value: '99.9%' },
                        { label: 'API Response Time', value: '120ms' },
                        { label: 'Database Load', value: '34%' }
                      ]
                    }
                  ].map(card => (
                    <div key={card.title} className="bg-gray-50 rounded-xl p-4">
                      <h3 className="font-bold text-sm mb-3">{card.title}</h3>
                      <div className="space-y-2">
                        {card.metrics.map((metric, idx) => (
                          <div key={idx}>
                            <p className="text-xs text-gray-600">{metric.label}:</p>
                            <p className="font-bold text-sm">{metric.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Security Events */}
                <div>
                  <h3 className="font-bold mb-3">Recent Security Events</h3>
                  <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
                    <table className="w-full min-w-[640px]">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Timestamp</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Event Type</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">User/IP</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Severity</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Status</th>
                          <th className="text-left text-xs font-medium text-gray-500 uppercase pb-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { time: 'Jan 29 10:34 AM', event: 'Failed Login (5x)', userIp: 'IP: 192.168.x.x', severity: 'Medium', status: 'Auto-blocked' },
                          { time: 'Jan 29 09:12 AM', event: 'Suspicious Profile', userIp: '@newuser123', severity: 'High', status: 'Flagged' },
                          { time: 'Jan 29 08:45 AM', event: 'Unauthorized Access Attempt', userIp: 'IP: 10.0.x.x', severity: 'High', status: 'Blocked' }
                        ].map((event, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 text-sm">{event.time}</td>
                            <td className="py-3 text-sm font-medium">{event.event}</td>
                            <td className="py-3 text-sm text-gray-600">{event.userIp}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                event.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                              }`}>
                                {event.severity}
                              </span>
                            </td>
                            <td className="py-3 text-sm">{event.status}</td>
                            <td className="py-3">
                              <button className="text-sm font-medium hover:underline" style={{ color: brandColors.electricBlue }}>
                                Review
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Other Views Placeholder */}
          {activeView !== 'dashboard' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${brandColors.electricBlue}20` }}>
                  {navigation.find(n => n.id === activeView)?.icon && 
                    (() => {
                      const Icon = navigation.find(n => n.id === activeView)!.icon;
                      return <Icon className="w-8 h-8" style={{ color: brandColors.electricBlue }} />;
                    })()
                  }
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {navigation.find(n => n.id === activeView)?.label}
                </h2>
                <p className="text-gray-600 mb-6">
                  This section is currently under development. The admin dashboard provides comprehensive controls for managing all aspects of the NextIgnition platform.
                </p>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="px-6 py-3 rounded-lg text-white font-medium"
                  style={{ backgroundColor: brandColors.electricBlue }}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-around z-50">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1 ${activeView === 'dashboard' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Dashboard</span>
        </button>
        <button
          onClick={() => setActiveView('all-users')}
          className={`flex flex-col items-center gap-1 ${activeView === 'all-users' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <Users className="w-5 h-5" />
          <span className="text-xs font-medium">Users</span>
        </button>
        <button
          onClick={() => setActiveView('analytics')}
          className={`flex flex-col items-center gap-1 ${activeView === 'analytics' ? 'text-blue-600' : 'text-gray-600'}`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs font-medium">Analytics</span>
        </button>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 text-gray-600"
        >
          <Menu className="w-5 h-5" />
          <span className="text-xs font-medium">More</span>
        </button>
      </div>
    </div>
  );
}
