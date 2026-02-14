import { useState } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  Download,
  Settings,
  FileText,
  Users,
  Target,
  MessageCircle,
  Calendar,
  Lock,
  Eye,
  Plus,
  Sparkles,
  AlertCircle,
  Activity,
  Clock,
  CheckCircle,
  ArrowRight,
  Filter,
  ChevronDown,
  Zap,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react';
import { brandColors } from '../utils/colors';

export function InvestorAnalytics() {
  const [dateRange, setDateRange] = useState('last30days');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showCreateSearchModal, setShowCreateSearchModal] = useState(false);
  const [portfolioView, setPortfolioView] = useState('investments');
  const [activityFilter, setActivityFilter] = useState('all');
  const [activeIntelligenceTab, setActiveIntelligenceTab] = useState('trends');

  // Mock data
  const kpiData = {
    dealsReviewed: { value: 247, trend: 18, previous: 209 },
    activePipeline: { value: 23, interested: 8, underReview: 10, negotiating: 5 },
    connections: { value: 42, messages: 67, meetings: 15 },
    qualityScore: { value: 8.2, max: 10 }
  };

  const funnelData = [
    { stage: 'Viewed Profiles', count: 247, percentage: 100, conversion: 23.5 },
    { stage: 'Saved/Interested', count: 58, percentage: 75, conversion: 39.7 },
    { stage: 'Added to Pipeline', count: 23, percentage: 50, conversion: 65.2 },
    { stage: 'Requested Meeting', count: 15, percentage: 30, conversion: 33.3 },
    { stage: 'In Negotiation', count: 5, percentage: 15, conversion: 40.0 },
    { stage: 'Invested', count: 2, percentage: 8, conversion: null }
  ];

  const conversionMetrics = [
    { from: 'Viewed → Saved', rate: 23.5, trend: 2.1, color: 'bg-blue-500' },
    { from: 'Saved → Pipeline', rate: 39.7, trend: 5.3, color: 'bg-green-500' },
    { from: 'Pipeline → Meeting', rate: 65.2, trend: 0, color: 'bg-yellow-500' },
    { from: 'Meeting → Negotiation', rate: 33.3, trend: -8, color: 'bg-orange-500' },
    { from: 'Negotiation → Invested', rate: 40.0, trend: 10, color: 'bg-purple-500' }
  ];

  const activities = [
    {
      id: 1,
      type: 'view',
      icon: Eye,
      title: 'You viewed TechFlow AI',
      subtitle: 'Startup: SaaS, Seed stage, 15K users',
      time: '2 hours ago',
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'pipeline',
      icon: Plus,
      title: 'Added FinPay to "Under Review"',
      subtitle: 'AI Score: 85/100',
      time: 'Yesterday at 3:45 PM',
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'meeting',
      icon: Calendar,
      title: 'Meeting scheduled with Rahul Shah (HealthAI)',
      subtitle: 'Jan 30, 2026 at 2:00 PM',
      time: '3 days ago',
      color: 'text-orange-600'
    },
    {
      id: 4,
      type: 'message',
      icon: MessageCircle,
      title: 'Sent message to Priya (DataViz)',
      subtitle: '"I\'d like to discuss your traction metrics..."',
      time: '5 days ago',
      color: 'text-purple-600'
    },
    {
      id: 5,
      type: 'dealroom',
      icon: Lock,
      title: 'Accessed deal room for PayNow',
      subtitle: 'Reviewed: Pitch deck, financials',
      time: '1 week ago',
      color: 'text-gray-600'
    }
  ];

  const aiInsights = [
    {
      type: 'opportunity',
      icon: '💡',
      title: 'New Opportunities',
      description: '3 high-potential startups match your thesis',
      startups: [
        { name: 'TechFlow AI', score: 92 },
        { name: 'FinPay Pro', score: 88 },
        { name: 'HealthKit', score: 87 }
      ],
      borderColor: 'border-l-green-500',
      action: 'View All'
    },
    {
      type: 'action',
      icon: '⚠️',
      title: 'Action Required',
      description: '5 startups awaiting your response',
      items: [
        'PayNow: Meeting request (3 days ago)',
        'DataViz: Document request (5 days ago)',
        'CloudSync: Follow-up needed (1 week ago)'
      ],
      borderColor: 'border-l-orange-500',
      action: 'Review Now'
    },
    {
      type: 'trend',
      icon: '📈',
      title: 'Trending Sector',
      description: 'FinTech deals up 40% this month',
      stats: [
        'Average deal size: ₹3.2 Cr (+15%)',
        '12 new FinTech startups on platform',
        'Avg AI score: 78/100'
      ],
      borderColor: 'border-l-blue-500',
      action: 'Explore FinTech Deals'
    },
    {
      type: 'portfolio',
      icon: '🎯',
      title: 'Portfolio Update',
      description: '2 portfolio companies hit milestones',
      items: [
        'TechFlow AI: 50K users milestone 🎉',
        'FinPay: ₹1Cr MRR achieved ✓'
      ],
      borderColor: 'border-l-green-500',
      action: 'View Portfolio'
    }
  ];

  const scoreDistribution = [
    { range: '0-20', count: 2, color: 'bg-red-500' },
    { range: '21-40', count: 10, color: 'bg-orange-500' },
    { range: '41-60', count: 28, color: 'bg-yellow-500' },
    { range: '61-80', count: 42, color: 'bg-lime-500' },
    { range: '81-100', count: 15, color: 'bg-green-500' }
  ];

  const industryTrends = [
    { name: 'AI/ML', trend: 45, direction: 'up' },
    { name: 'FinTech', trend: 32, direction: 'up' },
    { name: 'HealthTech', trend: 28, direction: 'up' },
    { name: 'EdTech', trend: 18, direction: 'up' },
    { name: 'E-commerce', trend: -5, direction: 'down' }
  ];

  const savedSearches = [
    {
      id: 1,
      icon: '📁',
      name: 'FinTech Seed Deals',
      count: 23,
      updated: '2 days ago',
      filters: 'FinTech, Seed stage, ₹1-3Cr'
    },
    {
      id: 2,
      icon: '⭐',
      name: 'High Priority Watch',
      count: 8,
      updated: '3 new this week',
      filters: 'Your custom list'
    },
    {
      id: 3,
      icon: '🎯',
      name: 'Series A SaaS',
      count: 15,
      updated: '5 days ago',
      filters: 'SaaS, Series A, >$1M ARR'
    },
    {
      id: 4,
      icon: '🔥',
      name: 'Hot Deals',
      count: 12,
      updated: 'Updated today',
      filters: 'AI Score >85, Active'
    }
  ];

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Left Section */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl"
                  style={{ background: `${brandColors.electricBlue}15` }}>
                  📊
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Investment Analytics</h1>
                </div>
              </div>
              <p className="text-gray-600">Track your deal flow, portfolio performance, and platform activity</p>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Date Range Selector */}
              <div className="relative">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="lastquarter">Last Quarter</option>
                  <option value="lastyear">Last Year</option>
                  <option value="alltime">All Time</option>
                  <option value="custom">Custom Range</option>
                </select>
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Export Button */}
              <button
                onClick={() => setShowExportModal(true)}
                className="px-4 py-2.5 border-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
                style={{ borderColor: brandColors.electricBlue, color: brandColors.electricBlue }}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export Report</span>
              </button>

              {/* Settings */}
              <div className="relative">
                <button
                  onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                  className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>

                {showSettingsDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-30"
                  >
                    <div className="space-y-2">
                      <div className="text-sm font-bold text-gray-700 pb-2 border-b">Analytics Preferences</div>
                      <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span>Show KPI Cards</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span>Show Deal Flow Funnel</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span>Show AI Insights</span>
                      </label>
                      <div className="pt-2 border-t">
                        <div className="text-xs text-gray-500 mb-2">Email Digest</div>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                          <option>Never</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Section 1: KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Deals Reviewed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ background: `${brandColors.electricBlue}15` }}>
                <FileText className="w-6 h-6" style={{ color: brandColors.electricBlue }} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{kpiData.dealsReviewed.value}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-3">Startups Reviewed</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="font-bold">+{kpiData.dealsReviewed.trend}%</span>
              </div>
              <div className="text-xs text-gray-500">vs last period</div>
            </div>
            {/* Mini sparkline */}
            <div className="mt-3 h-8 flex items-end gap-0.5">
              {[40, 60, 45, 70, 55, 80, 90].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{ height: `${height}%`, background: brandColors.electricBlue }}
                />
              ))}
            </div>
          </motion.div>

          {/* Card 2: Active Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ background: `${brandColors.atomicOrange}15` }}>
                <Target className="w-6 h-6" style={{ color: brandColors.atomicOrange }} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{kpiData.activePipeline.value}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-3">In Active Pipeline</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Interested: {kpiData.activePipeline.interested}</span>
                <span className="text-gray-600">Review: {kpiData.activePipeline.underReview}</span>
                <span className="text-gray-600">Nego: {kpiData.activePipeline.negotiating}</span>
              </div>
              {/* Progress bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                <div className="bg-blue-500" style={{ width: `${(kpiData.activePipeline.interested / kpiData.activePipeline.value) * 100}%` }} />
                <div className="bg-yellow-500" style={{ width: `${(kpiData.activePipeline.underReview / kpiData.activePipeline.value) * 100}%` }} />
                <div className="bg-green-500" style={{ width: `${(kpiData.activePipeline.negotiating / kpiData.activePipeline.value) * 100}%` }} />
              </div>
              <div className="text-xs text-green-600 font-medium">+3 since last week</div>
            </div>
          </motion.div>

          {/* Card 3: Connections Made */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-900/10">
                <Users className="w-6 h-6 text-blue-900" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{kpiData.connections.value}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-3">Founder Connections</div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Messages sent:</span>
                <span className="font-bold">{kpiData.connections.messages}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>Meetings scheduled:</span>
                <span className="font-bold">{kpiData.connections.meetings}</span>
              </div>
              <div className="mt-2 text-xs text-green-600 font-medium">+12% engagement rate</div>
            </div>
          </motion.div>

          {/* Card 4: Investment Readiness Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{kpiData.qualityScore.value}<span className="text-lg text-gray-500">/10</span></div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4">Avg Deal Quality Score</div>
            {/* Circular progress */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg className="transform -rotate-90 w-16 h-16">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#10b981"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${(kpiData.qualityScore.value / kpiData.qualityScore.max) * 175.93} 175.93`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-green-600">
                  {Math.round((kpiData.qualityScore.value / kpiData.qualityScore.max) * 100)}%
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Quality improving</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section 2: Deal Flow Analytics */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Deal Flow Funnel (2 columns) */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Deal Flow Funnel</h2>
                <p className="text-sm text-gray-500 mt-1">Last 30 Days</p>
              </div>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Funnel Visualization */}
            <div className="space-y-3">
              {funnelData.map((stage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-lg py-4 px-6 transition-all hover:opacity-90 flex items-center justify-between"
                      style={{
                        width: `${stage.percentage}%`,
                        background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})`,
                        minWidth: '200px'
                      }}
                    >
                      <span className="text-white font-bold">{stage.stage}</span>
                      <span className="text-white text-xl font-bold">{stage.count}</span>
                    </div>
                    {stage.conversion && (
                      <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        {stage.conversion}% →
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Overall Conversion Rate</div>
                  <div className="text-2xl font-bold text-gray-900">0.81%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Industry Benchmark</div>
                  <div className="text-2xl font-bold text-gray-500">0.95%</div>
                </div>
                <button className="px-4 py-2 rounded-lg font-medium text-white"
                  style={{ background: brandColors.electricBlue }}>
                  Improve Funnel
                </button>
              </div>
            </div>
          </div>

          {/* Conversion Metrics (1 column) */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Conversion Rates</h2>
            <div className="space-y-4">
              {conversionMetrics.map((metric, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{metric.from}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">{metric.rate}%</span>
                      {metric.trend !== 0 && (
                        <span className={`text-xs flex items-center gap-0.5 ${metric.trend > 0 ? 'text-green-600' : metric.trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {metric.trend > 0 ? <TrendingUp className="w-3 h-3" /> : metric.trend < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                          {Math.abs(metric.trend)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${metric.color} rounded-full transition-all`}
                      style={{ width: `${metric.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Portfolio Performance & Activity Timeline */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Activity Timeline (2 columns) */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <select
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Activity</option>
                <option value="dealflow">Deal Flow</option>
                <option value="meetings">Meetings</option>
                <option value="messages">Messages</option>
              </select>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 ${activity.color}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">{activity.title}</div>
                    <div className="text-sm text-gray-600 mt-0.5">{activity.subtitle}</div>
                    <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-white border border-gray-300">
                    View
                  </button>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Load More
            </button>
          </div>

          {/* AI Insights Panel (1 column) */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5" style={{ color: brandColors.electricBlue }} />
                Ignisha AI Insights
              </h2>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {aiInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border-l-4 ${insight.borderColor} bg-gray-50 rounded-lg`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl">{insight.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{insight.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    </div>
                  </div>

                  {insight.startups && (
                    <div className="space-y-2 mt-3">
                      {insight.startups.map((startup, i) => (
                        <div key={i} className="flex items-center justify-between text-sm p-2 bg-white rounded">
                          <span className="font-medium text-gray-900">{startup.name}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-bold">
                            {startup.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {insight.items && (
                    <ul className="space-y-1.5 mt-3">
                      {insight.items.map((item, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {insight.stats && (
                    <ul className="space-y-1.5 mt-3">
                      {insight.stats.map((stat, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          <span>{stat}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <button className="mt-3 w-full py-2 px-4 rounded-lg font-medium text-white text-sm"
                    style={{ background: brandColors.electricBlue }}>
                    {insight.action}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Deal Quality Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Deal Quality Distribution</h2>
            <p className="text-sm text-gray-500 mt-1">Based on Ignisha AI Scoring</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Score Distribution Chart */}
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 rounded-full">
                  <span className="text-sm text-gray-600">Average Score:</span>
                  <span className="text-3xl font-bold" style={{ color: brandColors.electricBlue }}>72/100</span>
                </div>
              </div>

              <div className="space-y-3">
                {scoreDistribution.map((range, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{range.range}</span>
                      <span className="text-gray-900 font-bold">{range.count} startups</span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(range.count / 97) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`h-full ${range.color} flex items-center justify-end pr-3`}
                      >
                        {range.count > 5 && (
                          <span className="text-xs font-bold text-white">{range.count}</span>
                        )}
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <span>Low (0-40)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span>Medium (41-60)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-lime-500 rounded-full" />
                    <span>Good (61-80)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span>Excellent (81-100)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Components Radar Chart Placeholder */}
            <div className="flex items-center justify-center">
              <div className="relative w-80 h-80">
                {/* Simplified radar chart representation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Center point */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full z-10" />
                    
                    {/* Axes */}
                    {['Team Quality', 'Market Size', 'Traction', 'PMF', 'Financial', 'Growth'].map((label, i) => {
                      const angle = (i * 60 - 90) * (Math.PI / 180);
                      const x = 50 + 45 * Math.cos(angle);
                      const y = 50 + 45 * Math.sin(angle);
                      
                      return (
                        <div key={i}>
                          {/* Axis line */}
                          <div
                            className="absolute top-1/2 left-1/2 w-0.5 bg-gray-200 origin-left"
                            style={{
                              height: '45%',
                              transform: `rotate(${i * 60}deg)`,
                              transformOrigin: '0 0'
                            }}
                          />
                          {/* Label */}
                          <div
                            className="absolute text-xs font-medium text-gray-700 whitespace-nowrap"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              transform: 'translate(-50%, -50%)'
                            }}
                          >
                            {label}
                          </div>
                        </div>
                      );
                    })}

                    {/* Data polygon - Portfolio Average */}
                    <svg className="absolute inset-0 w-full h-full">
                      <polygon
                        points="160,60 220,120 200,200 160,220 100,200 80,120"
                        fill={brandColors.electricBlue}
                        fillOpacity="0.2"
                        stroke={brandColors.electricBlue}
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Engagement Metrics */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Response Rate */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-100">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">78%</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4">Response Rate</div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Avg response time:</span>
                <span className="font-bold">4.2 hours</span>
              </div>
              <div className="flex justify-between">
                <span>Messages sent:</span>
                <span className="font-bold">67</span>
              </div>
              <div className="flex justify-between">
                <span>Replies received:</span>
                <span className="font-bold">52</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                <span>Above platform avg (65%)</span>
              </div>
            </div>
          </div>

          {/* Meeting Conversion */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-100">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">45%</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4">Meeting → Investment</div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Meetings held:</span>
                <span className="font-bold">15</span>
              </div>
              <div className="flex justify-between">
                <span>Led to investments:</span>
                <span className="font-bold">2</span>
              </div>
              <div className="flex justify-between">
                <span>Avg meetings per deal:</span>
                <span className="font-bold">3.5</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Requested:</span>
                  <span className="font-bold">20</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Held:</span>
                  <span className="font-bold">15 (75%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-100">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">127</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4">Platform Actions This Month</div>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Profile views:</span>
                <span className="font-bold">89</span>
              </div>
              <div className="flex justify-between">
                <span>Messages:</span>
                <span className="font-bold">23</span>
              </div>
              <div className="flex justify-between">
                <span>Pipeline updates:</span>
                <span className="font-bold">15</span>
              </div>
            </div>
            <div className="mt-4 h-16">
              <div className="flex items-end gap-1 h-full">
                {[40, 60, 45, 70, 55, 80, 90, 75, 85, 95, 100, 90, 85, 80].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-green-500 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Industry Intelligence */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Market Intelligence</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  Powered by Ignisha AI
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveIntelligenceTab('trends')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeIntelligenceTab === 'trends'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Industry Trends
              </button>
              <button
                onClick={() => setActiveIntelligenceTab('funding')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeIntelligenceTab === 'funding'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Funding Activity
              </button>
              <button
                onClick={() => setActiveIntelligenceTab('competitor')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeIntelligenceTab === 'competitor'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Competitor Analysis
              </button>
            </div>
          </div>

          {activeIntelligenceTab === 'trends' && (
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Top Growing Industries */}
              <div className="lg:col-span-1">
                <h3 className="font-bold text-gray-900 mb-4">Top Growing Industries</h3>
                <div className="space-y-3">
                  {industryTrends.map((industry, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-700">{i + 1}.</span>
                        <span className="font-medium text-gray-900">{industry.name}</span>
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-bold ${industry.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {industry.direction === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {industry.trend > 0 ? '+' : ''}{industry.trend}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deal Activity Chart */}
              <div className="lg:col-span-2">
                <h3 className="font-bold text-gray-900 mb-4">Deal Activity Over Time</h3>
                <div className="h-64 flex items-end gap-2">
                  {[30, 45, 40, 60, 55, 70, 65, 80, 75, 90, 85, 95].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full space-y-0.5">
                        <div className="w-full bg-blue-500 rounded-t" style={{ height: `${height * 0.4}px` }} />
                        <div className="w-full bg-green-500" style={{ height: `${height * 0.3}px` }} />
                        <div className="w-full bg-orange-500" style={{ height: `${height * 0.2}px` }} />
                        <div className="w-full bg-purple-500 rounded-b" style={{ height: `${height * 0.1}px` }} />
                      </div>
                      <span className="text-xs text-gray-500">M{i + 1}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-xs text-gray-600">AI/ML</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="text-xs text-gray-600">FinTech</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                    <span className="text-xs text-gray-600">HealthTech</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <span className="text-xs text-gray-600">Other</span>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="lg:col-span-1">
                <h3 className="font-bold text-gray-900 mb-4">AI Insights</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="text-2xl mb-2">🔥</div>
                    <div className="text-sm font-bold text-orange-900 mb-1">Hot Sector Alert</div>
                    <div className="text-xs text-orange-700">AI/ML startups raising 45% more this Q</div>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-2xl mb-2">💡</div>
                    <div className="text-sm font-bold text-blue-900 mb-1">Opportunity</div>
                    <div className="text-xs text-blue-700">Only 8% of investors active in HealthTech</div>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm font-bold text-gray-900 mb-1">Benchmark</div>
                    <div className="text-xs text-gray-700">Avg Seed deal: ₹2.8 Cr</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeIntelligenceTab === 'funding' && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Funding activity heatmap and analysis coming soon</p>
            </div>
          )}

          {activeIntelligenceTab === 'competitor' && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Competitor analysis and co-investment insights coming soon</p>
            </div>
          )}
        </div>

        {/* Section 7: Saved Lists & Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Saved Searches & Lists</h2>
            <button 
              onClick={() => setShowCreateSearchModal(true)}
              className="px-4 py-2 rounded-lg font-medium text-white flex items-center gap-2"
              style={{ background: brandColors.electricBlue }}>
              <Plus className="w-4 h-4" />
              Create New Search
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {savedSearches.map((search) => (
              <motion.div
                key={search.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{search.icon}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                    {search.count}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{search.name}</h3>
                <p className="text-xs text-gray-500 mb-2">Last updated: {search.updated}</p>
                <p className="text-xs text-gray-600 mb-3">{search.filters}</p>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                    style={{ background: brandColors.electricBlue }}>
                    View
                  </button>
                  <button className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50">
                    Edit
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Export Analytics Report</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Report Type</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="reportType" defaultChecked />
                    <div>
                      <div className="font-medium text-gray-900">Summary Report</div>
                      <div className="text-xs text-gray-600">1-page overview of key metrics</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="reportType" />
                    <div>
                      <div className="font-medium text-gray-900">Detailed Report</div>
                      <div className="text-xs text-gray-600">All sections with full data</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="reportType" />
                    <div>
                      <div className="font-medium text-gray-900">Custom Report</div>
                      <div className="text-xs text-gray-600">Select specific sections</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Export Format</label>
                <div className="grid grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm font-medium">PDF</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" />
                    <span className="text-sm font-medium">Excel</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" />
                    <span className="text-sm font-medium">CSV</span>
                  </label>
                </div>
              </div>

              {/* Include Options */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Include in Report</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" defaultChecked />
                    <span>Charts & visualizations</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" defaultChecked />
                    <span>Raw data tables</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" defaultChecked />
                    <span>AI insights</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" />
                    <span>Portfolio details</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" />
                    <span>Activity log</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="px-6 py-2.5 rounded-lg font-bold text-white"
                style={{ background: brandColors.electricBlue }}
              >
                Generate Report
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create Search Modal */}
      {showCreateSearchModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create New Saved Search</h2>
              <p className="text-sm text-gray-600 mt-1">Define your criteria to quickly find relevant startups</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Search Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Search Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., FinTech Seed Deals"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Choose Icon</label>
                <div className="grid grid-cols-8 gap-2">
                  {['📁', '⭐', '🎯', '🔥', '💼', '🚀', '💎', '⚡'].map((icon, i) => (
                    <button
                      key={i}
                      className="aspect-square text-2xl border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Industry Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Industry</label>
                <div className="flex flex-wrap gap-2">
                  {['AI/ML', 'FinTech', 'HealthTech', 'SaaS', 'E-commerce', 'EdTech', 'ClimateTech', 'Web3'].map((industry, i) => (
                    <label key={i} className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{industry}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Funding Stage Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Funding Stage</label>
                <div className="flex flex-wrap gap-2">
                  {['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+'].map((stage, i) => (
                    <label key={i} className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{stage}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Funding Amount Range */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Funding Amount Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Min Amount</label>
                    <input
                      type="text"
                      placeholder="₹1 Cr"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Max Amount</label>
                    <input
                      type="text"
                      placeholder="₹5 Cr"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* AI Score Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Minimum AI Score</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    defaultValue="75"
                    className="flex-1"
                  />
                  <span className="px-4 py-2 bg-gray-100 rounded-lg font-bold text-gray-900 min-w-[60px] text-center">75</span>
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                <div className="flex flex-wrap gap-2">
                  {['Mumbai', 'Bangalore', 'Delhi', 'Remote', 'US', 'Singapore'].map((location, i) => (
                    <label key={i} className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{location}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="border-t border-gray-200 pt-6">
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <div>
                    <div className="font-bold text-sm text-gray-900">Enable notifications</div>
                    <div className="text-xs text-gray-600">Get alerted when new startups match this search</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setShowCreateSearchModal(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreateSearchModal(false);
                  // Here you would normally save the search
                }}
                className="px-6 py-2.5 rounded-lg font-bold text-white"
                style={{ background: brandColors.electricBlue }}
              >
                Create Search
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}