import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Mic,
  SlidersHorizontal,
  Sparkles,
  Grid3x3,
  List,
  MapPin,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  MessageCircle,
  Bookmark,
  Share2,
  Eye,
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  Check,
  Building2,
  Briefcase,
  GraduationCap,
  Target,
  BarChart3,
  Award,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  FileText,
  Video,
  Download,
  ThumbsUp,
  Plus,
  UserPlus
} from 'lucide-react';
import { brandColors } from '../utils/colors';

type SearchMode = 'founders' | 'startups' | 'combined';
type ViewMode = 'grid' | 'list';

interface Founder {
  id: number;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  aiScore: number;
  isOnline: boolean;
  isVerified: boolean;
  currentStartup?: {
    name: string;
    logo: string;
    pitch: string;
    stage: string;
  };
  skills: string[];
  metrics: {
    startupsFounded: number;
    fundingRaised: string;
    connections: number;
    exits: number;
  };
  highlights: string[];
  aiInsight: string;
}

interface Startup {
  id: number;
  name: string;
  logo: string;
  pitch: string;
  industry: string[];
  stage: string;
  aiScore: number;
  fundingNeed: string;
  equity: string;
  metrics: {
    users: string;
    growth: string;
    mrr: string;
  };
  traction: string[];
  founders: { name: string; avatar: string; role: string }[];
  investorActivity: {
    views: number;
    interested: number;
    lastUpdated: string;
  };
  aiInsight: string;
  hasPitchDeck: boolean;
  hasPitchVideo: boolean;
}

export function DiscoverInvestor() {
  const [searchMode, setSearchMode] = useState<SearchMode>('founders');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAISearch, setShowAISearch] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [showAIEvaluation, setShowAIEvaluation] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [expandedInsights, setExpandedInsights] = useState<number[]>([]);

  // Mock data
  const founders: Founder[] = [
    {
      id: 1,
      name: 'Rahul Sharma',
      username: '@rahultech',
      avatar: 'RS',
      bio: 'Ex-Google PM building AI-powered invoice automation',
      location: 'Mumbai, India',
      aiScore: 87,
      isOnline: true,
      isVerified: true,
      currentStartup: {
        name: 'InvoiceAI',
        logo: 'IA',
        pitch: 'Automating invoice processing with AI for SMBs',
        stage: 'Growth'
      },
      skills: ['Product Management', 'SaaS', 'B2B', 'AI/ML'],
      metrics: {
        startupsFounded: 2,
        fundingRaised: '₹5Cr',
        connections: 342,
        exits: 1
      },
      highlights: ['Ex-Google PM', 'IIT Delhi', 'Looking for funding'],
      aiInsight: 'Strong product background with proven execution. Startup shows 40% MoM growth.'
    },
    {
      id: 2,
      name: 'Priya Patel',
      username: '@priyafintech',
      avatar: 'PP',
      bio: 'Serial entrepreneur in FinTech space | 2 successful exits',
      location: 'Bangalore, India',
      aiScore: 92,
      isOnline: false,
      isVerified: true,
      currentStartup: {
        name: 'PayFlow',
        logo: 'PF',
        pitch: 'Digital payments for rural India',
        stage: 'Scaling'
      },
      skills: ['FinTech', 'Business Strategy', 'Sales', 'Leadership'],
      metrics: {
        startupsFounded: 3,
        fundingRaised: '₹25Cr',
        connections: 1240,
        exits: 2
      },
      highlights: ['2 Exits', 'Ex-Paytm', 'IIM Ahmedabad'],
      aiInsight: 'Exceptional track record with proven ability to scale. Deep fintech expertise.'
    },
    {
      id: 3,
      name: 'Arjun Mehta',
      username: '@arjundev',
      avatar: 'AM',
      bio: 'Full-stack developer turned founder | Building developer tools',
      location: 'Delhi, India',
      aiScore: 78,
      isOnline: true,
      isVerified: false,
      currentStartup: {
        name: 'DevKit Pro',
        logo: 'DK',
        pitch: 'All-in-one toolkit for modern developers',
        stage: 'MVP'
      },
      skills: ['Full Stack', 'DevTools', 'Open Source', 'Node.js'],
      metrics: {
        startupsFounded: 1,
        fundingRaised: '₹50L',
        connections: 156,
        exits: 0
      },
      highlights: ['Ex-Microsoft', 'Open Source Contributor', 'Looking for co-founder'],
      aiInsight: 'Strong technical skills but limited business experience. Product has good early traction.'
    }
  ];

  const startups: Startup[] = [
    {
      id: 1,
      name: 'InvoiceAI',
      logo: 'IA',
      pitch: 'Automating invoice processing with AI for SMBs',
      industry: ['SaaS', 'FinTech'],
      stage: 'Growth Stage',
      aiScore: 82,
      fundingNeed: '₹2Cr',
      equity: '12%',
      metrics: {
        users: '15K',
        growth: '35% MoM',
        mrr: '₹8L'
      },
      traction: ['500+ paying customers', 'Partnerships with HDFC, ICICI', 'Featured in YourStory'],
      founders: [
        { name: 'Rahul Sharma', avatar: 'RS', role: 'CEO' },
        { name: 'Amit Kumar', avatar: 'AK', role: 'CTO' }
      ],
      investorActivity: {
        views: 42,
        interested: 5,
        lastUpdated: '3 days ago'
      },
      aiInsight: 'Strong product-market fit with impressive growth metrics. Market timing excellent.',
      hasPitchDeck: true,
      hasPitchVideo: true
    },
    {
      id: 2,
      name: 'PayFlow',
      logo: 'PF',
      pitch: 'Digital payments infrastructure for rural India',
      industry: ['FinTech', 'B2C'],
      stage: 'Scaling',
      aiScore: 89,
      fundingNeed: '₹10Cr',
      equity: '8%',
      metrics: {
        users: '250K',
        growth: '45% MoM',
        mrr: '₹35L'
      },
      traction: ['Active in 500+ villages', 'Government partnership signed', 'Break-even achieved'],
      founders: [
        { name: 'Priya Patel', avatar: 'PP', role: 'CEO' },
        { name: 'Vijay Singh', avatar: 'VS', role: 'COO' },
        { name: 'Neha Reddy', avatar: 'NR', role: 'CTO' }
      ],
      investorActivity: {
        views: 128,
        interested: 15,
        lastUpdated: '1 day ago'
      },
      aiInsight: 'Exceptional execution with clear path to profitability. Strong founding team with complementary skills.',
      hasPitchDeck: true,
      hasPitchVideo: true
    },
    {
      id: 3,
      name: 'HealthHub',
      logo: 'HH',
      pitch: 'Telemedicine platform connecting patients with specialists',
      industry: ['HealthTech', 'B2C'],
      stage: 'Growth Stage',
      aiScore: 75,
      fundingNeed: '₹5Cr',
      equity: '15%',
      metrics: {
        users: '50K',
        growth: '28% MoM',
        mrr: '₹12L'
      },
      traction: ['150+ doctors onboarded', 'Average 500 consultations/day', 'Insurance partnerships in progress'],
      founders: [
        { name: 'Dr. Anjali Gupta', avatar: 'AG', role: 'CEO' },
        { name: 'Karan Malhotra', avatar: 'KM', role: 'CTO' }
      ],
      investorActivity: {
        views: 67,
        interested: 8,
        lastUpdated: '5 days ago'
      },
      aiInsight: 'Solid traction in competitive market. Regulatory compliance is a strength. Consider customer acquisition cost.',
      hasPitchDeck: true,
      hasPitchVideo: false
    }
  ];

  const quickFilters = {
    founders: ['Technical Co-founders', 'Ex-YC', 'Based in Mumbai', 'Looking for Funding', 'IIT/IIM Alumni'],
    startups: ['Pre-seed', 'SaaS', 'FinTech', '10K+ Users', 'Revenue ₹5L+', 'Has Pitch Deck'],
    combined: ['High AI Score (80+)', 'Active This Week', 'Mumbai/Bangalore', 'Pre-seed/Seed']
  };

  const getResultsCount = () => {
    if (searchMode === 'founders') return founders.length;
    if (searchMode === 'startups') return startups.length;
    return founders.length + startups.length;
  };

  const getPlaceholder = () => {
    if (searchMode === 'founders') return 'Search founders by name, skills, location, industry...';
    if (searchMode === 'startups') return 'Search startups by name, industry, stage, traction...';
    return 'Search founders or startups...';
  };

  const toggleInsight = (id: number) => {
    setExpandedInsights(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex h-full overflow-hidden relative">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 p-4 lg:p-6 space-y-4">
          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide snap-x snap-mandatory" style={{ WebkitOverflowScrolling: 'touch' }}>
            {[
              { id: 'founders', icon: Briefcase, label: 'Founders', count: '1,247' },
              { id: 'startups', icon: Target, label: 'Startups', count: '583' },
              { id: 'combined', icon: Search, label: 'Combined Search', count: '1,830' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSearchMode(tab.id as SearchMode)}
                className={`flex items-center gap-2 px-3 sm:px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap flex-shrink-0 snap-start ml-[5px] ${
                  searchMode === tab.id
                    ? 'text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                style={searchMode === tab.id ? {
                  backgroundColor: brandColors.electricBlue,
                  borderBottom: `3px solid ${brandColors.atomicOrange}`
                } : {}}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-sm sm:text-base">{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  searchMode === tab.id ? 'bg-white/20' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl">
            <div className="relative">
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 sm:py-4 bg-white border-2 border-gray-200 rounded-full focus-within:border-blue-500 transition-colors">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="flex-1 outline-none text-sm"
                />
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Mic className="w-5 h-5 text-gray-400" />
                  </button>
                  <button 
                    onClick={() => setShowAdvancedSearch(true)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">Advanced</span>
                  </button>
                  <button
                    onClick={() => setShowAISearch(true)}
                    className="px-3 sm:px-4 py-2 text-sm font-bold text-white rounded-full transition-all hover:shadow-lg flex items-center gap-2 flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">Ask Ignisha</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
              {quickFilters[searchMode].map(filter => (
                <button
                  key={filter}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium hover:border-blue-500 hover:text-blue-600 transition-colors whitespace-nowrap flex-shrink-0"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-600">
              <span className="font-bold text-gray-900">{getResultsCount()}</span> {searchMode} match your criteria
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="ai-score">AI Score</option>
              <option value="traction">Highest Traction</option>
              <option value="recent">Recently Active</option>
              <option value="location">Location</option>
            </select>

            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">Filters</span>
              {selectedFilters.length > 0 && (
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold rounded-full">
                  {selectedFilters.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {searchMode === 'founders' && (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {founders.map(founder => (
                <FounderCard
                  key={founder.id}
                  founder={founder}
                  viewMode={viewMode}
                  isInsightExpanded={expandedInsights.includes(founder.id)}
                  onToggleInsight={() => toggleInsight(founder.id)}
                  onViewProfile={() => setSelectedProfile(founder)}
                  onShowAIEvaluation={() => {
                    setSelectedProfile(founder);
                    setShowAIEvaluation(true);
                  }}
                />
              ))}
            </div>
          )}

          {searchMode === 'startups' && (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {startups.map(startup => (
                <StartupCard
                  key={startup.id}
                  startup={startup}
                  viewMode={viewMode}
                  isInsightExpanded={expandedInsights.includes(startup.id)}
                  onToggleInsight={() => toggleInsight(startup.id)}
                  onViewProfile={() => setSelectedProfile(startup)}
                  onShowAIEvaluation={() => {
                    setSelectedProfile(startup);
                    setShowAIEvaluation(true);
                  }}
                />
              ))}
            </div>
          )}

          {searchMode === 'combined' && (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {[...founders.slice(0, 2), ...startups.slice(0, 2)].map((item: any, index) => 
                'username' in item ? (
                  <FounderCard
                    key={`founder-${item.id}`}
                    founder={item}
                    viewMode={viewMode}
                    isInsightExpanded={expandedInsights.includes(item.id)}
                    onToggleInsight={() => toggleInsight(item.id)}
                    onViewProfile={() => setSelectedProfile(item)}
                    onShowAIEvaluation={() => {
                      setSelectedProfile(item);
                      setShowAIEvaluation(true);
                    }}
                  />
                ) : (
                  <StartupCard
                    key={`startup-${item.id}`}
                    startup={item}
                    viewMode={viewMode}
                    isInsightExpanded={expandedInsights.includes(item.id)}
                    onToggleInsight={() => toggleInsight(item.id)}
                    onViewProfile={() => setSelectedProfile(item)}
                    onShowAIEvaluation={() => {
                      setSelectedProfile(item);
                      setShowAIEvaluation(true);
                    }}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filter Sidebar - Slides from Right */}
      <AnimatePresence>
        {showFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            
            {/* Sidebar */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0 z-50 shadow-2xl"
            >
              <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">
                    {searchMode === 'founders' ? 'Filter Founders' : searchMode === 'startups' ? 'Filter Startups' : 'Filter Results'}
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <button className="text-sm text-blue-600 hover:underline">Clear All</button>
                  {selectedFilters.length > 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                      {selectedFilters.length} active
                    </span>
                  )}
                </div>
              </div>

              {/* Filter Sections */}
              <div className="p-4 space-y-4">
                {/* Location Filter */}
                <FilterSection title="Location" icon={<MapPin className="w-4 h-4" />}>
                  <input
                    type="text"
                    placeholder="City or country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Remote OK</span>
                    </label>
                  </div>
                </FilterSection>

                {/* Stage Filter (for startups) */}
                {searchMode !== 'founders' && (
                  <FilterSection title="Stage" icon={<TrendingUp className="w-4 h-4" />}>
                    <div className="space-y-2">
                      {['Idea', 'MVP', 'Growth', 'Scaling'].map(stage => (
                        <label key={stage} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{stage}</span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>
                )}

                {/* Industry Filter */}
                <FilterSection title="Industry" icon={<Building2 className="w-4 h-4" />}>
                  <div className="space-y-2">
                    {['SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'AI/ML'].map(industry => (
                      <label key={industry} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{industry}</span>
                      </label>
                    ))}
                  </div>
                </FilterSection>

                {/* Funding Filter */}
                <FilterSection title="Funding" icon={<DollarSign className="w-4 h-4" />}>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Funding Need</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Min"
                          className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Max"
                          className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      {['Bootstrapped', 'Pre-seed', 'Seed', 'Series A+'].map(stage => (
                        <label key={stage} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{stage}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </FilterSection>

                {/* Traction Filter */}
                <FilterSection title="Traction" icon={<BarChart3 className="w-4 h-4" />}>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Users</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option>Any</option>
                        <option>1K+</option>
                        <option>10K+</option>
                        <option>50K+</option>
                        <option>100K+</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Growth Rate (MoM)</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option>Any</option>
                        <option>10%+</option>
                        <option>20%+</option>
                        <option>50%+</option>
                        <option>100%+</option>
                      </select>
                    </div>
                  </div>
                </FilterSection>

                {/* AI Score Filter */}
                <FilterSection title="AI Match Score" icon={<Sparkles className="w-4 h-4" />}>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-600 block">Minimum Score: 70%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="70"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0</span>
                      <span>50</span>
                      <span>100</span>
                    </div>
                  </div>
                </FilterSection>

                {/* Credentials (for founders) */}
                {searchMode !== 'startups' && (
                  <FilterSection title="Credentials" icon={<GraduationCap className="w-4 h-4" />}>
                    <div className="space-y-2">
                      {['IIT', 'IIM', 'YC Alumni', 'Ex-FAANG', 'Previous Exit'].map(cred => (
                        <label key={cred} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{cred}</span>
                        </label>
                      ))}
                    </div>
                  </FilterSection>
                )}

                {/* Apply Button */}
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-3 rounded-lg text-white font-bold transition-colors"
                  style={{ backgroundColor: brandColors.electricBlue }}
                >
                  Apply Filters
                </button>

                <button className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  Save Search
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Advanced Search Modal */}
      <AnimatePresence>
        {showAdvancedSearch && (
          <AdvancedSearchModal 
            searchMode={searchMode}
            onClose={() => setShowAdvancedSearch(false)} 
          />
        )}
      </AnimatePresence>

      {/* AI Search Modal */}
      <AnimatePresence>
        {showAISearch && (
          <AISearchModal onClose={() => setShowAISearch(false)} />
        )}
      </AnimatePresence>

      {/* AI Evaluation Panel */}
      <AnimatePresence>
        {showAIEvaluation && selectedProfile && (
          <AIEvaluationPanel
            profile={selectedProfile}
            type={'username' in selectedProfile ? 'founder' : 'startup'}
            onClose={() => {
              setShowAIEvaluation(false);
              setSelectedProfile(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Filter Section Component
function FilterSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-bold text-sm">{title}</span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isExpanded && (
        <div className="p-3 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}

// Founder Card Component
function FounderCard({ founder, viewMode, isInsightExpanded, onToggleInsight, onViewProfile, onShowAIEvaluation }: {
  founder: Founder;
  viewMode: ViewMode;
  isInsightExpanded: boolean;
  onToggleInsight: () => void;
  onViewProfile: () => void;
  onShowAIEvaluation: () => void;
}) {
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all flex items-center gap-4"
      >
        <div className="relative flex-shrink-0">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: brandColors.electricBlue }}
          >
            {founder.avatar}
          </div>
          {founder.isOnline && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{founder.name}</h3>
                {founder.isVerified && (
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <p className="text-sm text-gray-600">{founder.username}</p>
            </div>
            <button
              onClick={onShowAIEvaluation}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                founder.aiScore >= 80 ? 'bg-green-100 text-green-700' :
                founder.aiScore >= 60 ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              AI: {founder.aiScore}%
            </button>
          </div>
          
          <p className="text-sm text-gray-700 mb-2 line-clamp-1">{founder.bio}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {founder.location}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {founder.skills.slice(0, 3).map(skill => (
              <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                {skill}
              </span>
            ))}
            {founder.skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                +{founder.skills.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={onViewProfile}
            className="px-4 py-2 rounded-lg text-white font-bold text-sm transition-colors"
            style={{ backgroundColor: brandColors.electricBlue }}
          >
            View Profile
          </button>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
    >
      {/* Header */}
      <div className="p-6 pb-4 relative">
        <button
          onClick={onShowAIEvaluation}
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
            founder.aiScore >= 80 ? 'bg-green-100 text-green-700' :
            founder.aiScore >= 60 ? 'bg-orange-100 text-orange-700' :
            'bg-gray-100 text-gray-700'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          AI: {founder.aiScore}%
        </button>

        <div className="flex flex-col items-center mb-4">
          <div className="relative mb-3">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: brandColors.electricBlue }}
            >
              {founder.avatar}
            </div>
            {founder.isOnline && (
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-3 border-white rounded-full" />
            )}
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h3 className="font-bold text-lg">{founder.name}</h3>
              {founder.isVerified && (
                <CheckCircle className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{founder.username}</p>
            <p className="text-sm text-gray-700 line-clamp-2">{founder.bio}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{founder.location}</span>
        </div>

        {/* Current Startup */}
        {founder.currentStartup && (
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: brandColors.atomicOrange }}
              >
                {founder.currentStartup.logo}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm">{founder.currentStartup.name}</h4>
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                  {founder.currentStartup.stage}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 line-clamp-1 mb-2">{founder.currentStartup.pitch}</p>
            <button
              className="text-xs font-medium flex items-center gap-1"
              style={{ color: brandColors.electricBlue }}
            >
              View Startup Profile
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {founder.skills.slice(0, 3).map(skill => (
            <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
              {skill}
            </span>
          ))}
          {founder.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
              +{founder.skills.length - 3} more
            </span>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Startups</p>
              <p className="font-bold text-sm">{founder.metrics.startupsFounded}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Raised</p>
              <p className="font-bold text-sm">{founder.metrics.fundingRaised}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Network</p>
              <p className="font-bold text-sm">{founder.metrics.connections}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Exits</p>
              <p className="font-bold text-sm">{founder.metrics.exits}</p>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="space-y-1 mb-3">
          {founder.highlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{highlight}</span>
            </div>
          ))}
        </div>

        {/* AI Insight */}
        <div className="border-t border-gray-200 pt-3">
          <button
            onClick={onToggleInsight}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <span className="flex items-center gap-1">
              <Lightbulb className="w-4 h-4" style={{ color: brandColors.atomicOrange }} />
              AI Insights
            </span>
            {isInsightExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {isInsightExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 text-xs text-gray-600 bg-blue-50 p-3 rounded-lg"
            >
              {founder.aiInsight}
            </motion.div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50 space-y-2">
        <button
          onClick={onViewProfile}
          className="w-full py-3 rounded-lg text-white font-bold transition-colors"
          style={{ backgroundColor: brandColors.electricBlue }}
        >
          View Full Profile
        </button>
        <div className="grid grid-cols-4 gap-2">
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-white transition-colors flex items-center justify-center">
            <MessageCircle className="w-4 h-4" />
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-white transition-colors flex items-center justify-center">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-white transition-colors flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-white transition-colors flex items-center justify-center">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Startup Card Component
function StartupCard({ startup, viewMode, isInsightExpanded, onToggleInsight, onViewProfile, onShowAIEvaluation }: {
  startup: Startup;
  viewMode: ViewMode;
  isInsightExpanded: boolean;
  onToggleInsight: () => void;
  onViewProfile: () => void;
  onShowAIEvaluation: () => void;
}) {
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-lg transition-all flex items-center gap-4"
      >
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ backgroundColor: brandColors.atomicOrange }}
        >
          {startup.logo}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="font-bold text-lg">{startup.name}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {startup.industry.map(ind => (
                  <span key={ind} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                    {ind}
                  </span>
                ))}
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold">
                  {startup.stage}
                </span>
              </div>
            </div>
            <button
              onClick={onShowAIEvaluation}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                startup.aiScore >= 80 ? 'bg-green-100 text-green-700' :
                startup.aiScore >= 60 ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              AI: {startup.aiScore}%
            </button>
          </div>
          
          <p className="text-sm text-gray-700 mb-2 line-clamp-1">{startup.pitch}</p>
          
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-gray-500">Users:</span>
              <span className="font-bold ml-1">{startup.metrics.users}</span>
            </div>
            <div>
              <span className="text-gray-500">Growth:</span>
              <span className="font-bold ml-1 text-green-600">{startup.metrics.growth}</span>
            </div>
            <div>
              <span className="text-gray-500">MRR:</span>
              <span className="font-bold ml-1">{startup.metrics.mrr}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={onViewProfile}
            className="px-4 py-2 rounded-lg text-white font-bold text-sm transition-colors"
            style={{ backgroundColor: brandColors.electricBlue }}
          >
            View Profile
          </button>
          <div className="flex gap-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
    >
      {/* Header */}
      <div className="p-6 pb-4 relative">
        <button
          onClick={onShowAIEvaluation}
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
            startup.aiScore >= 80 ? 'bg-green-100 text-green-700' :
            startup.aiScore >= 60 ? 'bg-orange-100 text-orange-700' :
            'bg-gray-100 text-gray-700'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          AI: {startup.aiScore}%
        </button>

        <div className="flex flex-col items-center mb-4">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-2xl mb-3"
            style={{ backgroundColor: brandColors.atomicOrange }}
          >
            {startup.logo}
          </div>

          <div className="text-center">
            <h3 className="font-bold text-lg mb-1">{startup.name}</h3>
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              {startup.industry.map(ind => (
                <span key={ind} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                  {ind}
                </span>
              ))}
            </div>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
              {startup.stage}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-700 text-center mb-4">{startup.pitch}</p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Stage</p>
            <p className="font-bold text-sm">{startup.stage}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Need</p>
            <p className="font-bold text-sm">{startup.fundingNeed}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Equity</p>
            <p className="font-bold text-sm">{startup.equity}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Users</p>
            <p className="font-bold text-sm">{startup.metrics.users}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Growth</p>
            <p className="font-bold text-sm text-green-600">{startup.metrics.growth}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">MRR</p>
            <p className="font-bold text-sm">{startup.metrics.mrr}</p>
          </div>
        </div>

        {/* Traction */}
        <div className="space-y-1 mb-4">
          {startup.traction.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>

        {/* Founders */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex -space-x-2">
            {startup.founders.map((founder, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: brandColors.electricBlue }}
                title={`${founder.name} - ${founder.role}`}
              >
                {founder.avatar}
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-600">
            {startup.founders.length > 1 && `+${startup.founders.length - 1} more`}
          </div>
        </div>

        {/* Investor Activity */}
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {startup.investorActivity.views} views
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" />
              {startup.investorActivity.interested} interested
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Updated {startup.investorActivity.lastUpdated}</p>
        </div>

        {/* Documents */}
        <div className="flex gap-2 mb-3">
          {startup.hasPitchDeck && (
            <div className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 rounded text-xs font-medium text-blue-700">
              <FileText className="w-3 h-3" />
              Pitch Deck
            </div>
          )}
          {startup.hasPitchVideo && (
            <div className="flex-1 flex items-center justify-center gap-1 py-2 bg-purple-50 rounded text-xs font-medium text-purple-700">
              <Video className="w-3 h-3" />
              Video
            </div>
          )}
        </div>

        {/* AI Insight */}
        <div className="border-t border-gray-200 pt-3">
          <button
            onClick={onToggleInsight}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <span className="flex items-center gap-1">
              <Lightbulb className="w-4 h-4" style={{ color: brandColors.atomicOrange }} />
              AI Insights
            </span>
            {isInsightExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {isInsightExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 text-xs text-gray-600 bg-blue-50 p-3 rounded-lg"
            >
              {startup.aiInsight}
            </motion.div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-gray-50 space-y-2">
        <button
          onClick={onViewProfile}
          className="w-full py-3 rounded-lg text-white font-bold transition-colors"
          style={{ backgroundColor: brandColors.electricBlue }}
        >
          View Full Profile
        </button>
        <div className="grid grid-cols-4 gap-2">
          <button
            className="p-2 border border-gray-300 rounded-lg hover:bg-white transition-colors flex items-center justify-center"
            title="Message Founder"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <button
            className="p-2 border border-gray-300 rounded-lg hover:bg-white transition-colors flex items-center justify-center"
            title="Express Interest"
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button
            className="p-2 border border-gray-300 rounded-lg hover:bg-white transition-colors flex items-center justify-center"
            title="Request Meeting"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button
            className="p-2 border border-gray-300 rounded-lg hover:bg-white transition-colors flex items-center justify-center"
            title="Save"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// AI Search Modal
function AISearchModal({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState('');

  const examplePrompts = [
    'Find SaaS founders in Mumbai who\'ve raised seed funding and are growing >30% MoM',
    'Show me FinTech startups with >50K users, looking for ₹2-5Cr, with technical founders',
    'Founders from IIT/IIM working on healthcare problems, pre-revenue, team of 2-3'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Find with Ignisha AI</h2>
              <p className="text-sm text-gray-600">Describe what you're looking for in natural language</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Find technical founders from Bangalore working on AI/ML startups, looking for seed funding..."
            className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        <div className="mb-6">
          <p className="text-sm font-bold text-gray-700 mb-3">Quick Examples:</p>
          <div className="space-y-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full py-3 rounded-xl text-white font-bold transition-all hover:shadow-lg flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
        >
          <Search className="w-5 h-5" />
          Search with AI
        </button>
      </motion.div>
    </motion.div>
  );
}

// Advanced Search Modal
function AdvancedSearchModal({ searchMode, onClose }: { searchMode: SearchMode; onClose: () => void }) {
  const [filters, setFilters] = useState({
    location: '',
    remoteOk: false,
    stages: [] as string[],
    industries: [] as string[],
    fundingMin: '',
    fundingMax: '',
    fundingStages: [] as string[],
    usersMin: '',
    growthRate: '',
    aiScoreMin: 70,
    credentials: [] as string[],
    teamSize: '',
    revenue: '',
    dateRange: 'all'
  });

  const handleApplyFilters = () => {
    // Here you would apply the filters to your search results
    console.log('Applying filters:', filters);
    onClose();
  };

  const handleClearAll = () => {
    setFilters({
      location: '',
      remoteOk: false,
      stages: [],
      industries: [],
      fundingMin: '',
      fundingMax: '',
      fundingStages: [],
      usersMin: '',
      growthRate: '',
      aiScoreMin: 70,
      credentials: [],
      teamSize: '',
      revenue: '',
      dateRange: 'all'
    });
  };

  const toggleArrayFilter = (key: keyof typeof filters, value: string) => {
    const currentArray = filters[key] as string[];
    if (currentArray.includes(value)) {
      setFilters({ ...filters, [key]: currentArray.filter(item => item !== value) });
    } else {
      setFilters({ ...filters, [key]: [...currentArray, value] });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: brandColors.electricBlue }}
              >
                <SlidersHorizontal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Advanced Search</h2>
                <p className="text-sm text-gray-600">
                  {searchMode === 'founders' ? 'Find founders with specific criteria' : 
                   searchMode === 'startups' ? 'Find startups with specific criteria' : 
                   'Search both founders and startups'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleClearAll}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location
              </label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                placeholder="City or country (e.g., Mumbai, India)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={filters.remoteOk}
                  onChange={(e) => setFilters({ ...filters, remoteOk: e.target.checked })}
                  className="rounded" 
                />
                <span className="text-sm text-gray-700">Remote OK</span>
              </label>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Active Within
              </label>
              <select
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>

            {/* Stage (for startups) */}
            {searchMode !== 'founders' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Stage
                </label>
                <div className="space-y-2">
                  {['Idea', 'MVP', 'Growth', 'Scaling'].map(stage => (
                    <label key={stage} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={filters.stages.includes(stage)}
                        onChange={() => toggleArrayFilter('stages', stage)}
                        className="rounded" 
                      />
                      <span className="text-sm">{stage}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Industry */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Building2 className="w-4 h-4 inline mr-2" />
                Industry
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {['SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'AI/ML', 'Enterprise Software', 'Consumer Apps'].map(industry => (
                  <label key={industry} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={filters.industries.includes(industry)}
                      onChange={() => toggleArrayFilter('industries', industry)}
                      className="rounded" 
                    />
                    <span className="text-sm">{industry}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Funding Range */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Funding Need (₹)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={filters.fundingMin}
                  onChange={(e) => setFilters({ ...filters, fundingMin: e.target.value })}
                  placeholder="Min (e.g., 50L)"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={filters.fundingMax}
                  onChange={(e) => setFilters({ ...filters, fundingMax: e.target.value })}
                  placeholder="Max (e.g., 5Cr)"
                  className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                {['Bootstrapped', 'Pre-seed', 'Seed', 'Series A+'].map(stage => (
                  <label key={stage} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={filters.fundingStages.includes(stage)}
                      onChange={() => toggleArrayFilter('fundingStages', stage)}
                      className="rounded" 
                    />
                    <span className="text-sm">{stage}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Traction Metrics */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Traction Metrics
              </label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Minimum Users</label>
                  <select
                    value={filters.usersMin}
                    onChange={(e) => setFilters({ ...filters, usersMin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any</option>
                    <option value="1000">1K+</option>
                    <option value="10000">10K+</option>
                    <option value="50000">50K+</option>
                    <option value="100000">100K+</option>
                    <option value="500000">500K+</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Growth Rate (MoM)</label>
                  <select
                    value={filters.growthRate}
                    onChange={(e) => setFilters({ ...filters, growthRate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any</option>
                    <option value="10">10%+</option>
                    <option value="20">20%+</option>
                    <option value="30">30%+</option>
                    <option value="50">50%+</option>
                    <option value="100">100%+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* AI Match Score */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Sparkles className="w-4 h-4 inline mr-2" />
                AI Match Score: {filters.aiScoreMin}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.aiScoreMin}
                onChange={(e) => setFilters({ ...filters, aiScoreMin: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>

            {/* Credentials (for founders) */}
            {searchMode !== 'startups' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <GraduationCap className="w-4 h-4 inline mr-2" />
                  Credentials
                </label>
                <div className="space-y-2">
                  {['IIT', 'IIM', 'YC Alumni', 'Ex-FAANG', 'Previous Exit', 'Serial Entrepreneur'].map(cred => (
                    <label key={cred} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={filters.credentials.includes(cred)}
                        onChange={() => toggleArrayFilter('credentials', cred)}
                        className="rounded" 
                      />
                      <span className="text-sm">{cred}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Team Size (for startups) */}
            {searchMode !== 'founders' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Team Size
                </label>
                <select
                  value={filters.teamSize}
                  onChange={(e) => setFilters({ ...filters, teamSize: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  <option value="1-5">1-5 people</option>
                  <option value="6-10">6-10 people</option>
                  <option value="11-25">11-25 people</option>
                  <option value="26-50">26-50 people</option>
                  <option value="51+">51+ people</option>
                </select>
              </div>
            )}

            {/* Revenue (for startups) */}
            {searchMode !== 'founders' && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Monthly Revenue
                </label>
                <select
                  value={filters.revenue}
                  onChange={(e) => setFilters({ ...filters, revenue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  <option value="pre">Pre-revenue</option>
                  <option value="1-5">₹1-5L</option>
                  <option value="5-10">₹5-10L</option>
                  <option value="10-25">₹10-25L</option>
                  <option value="25-50">₹25-50L</option>
                  <option value="50+">₹50L+</option>
                </select>
              </div>
            )}
          </div>

          {/* Active Filters Summary */}
          {(filters.location || filters.industries.length > 0 || filters.stages.length > 0 || filters.credentials.length > 0 || filters.fundingStages.length > 0) && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-bold text-gray-700 mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {filters.location && (
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-medium flex items-center gap-1">
                    Location: {filters.location}
                    <button onClick={() => setFilters({ ...filters, location: '' })}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.industries.map(ind => (
                  <span key={ind} className="px-3 py-1 bg-white rounded-full text-xs font-medium flex items-center gap-1">
                    {ind}
                    <button onClick={() => toggleArrayFilter('industries', ind)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.stages.map(stage => (
                  <span key={stage} className="px-3 py-1 bg-white rounded-full text-xs font-medium flex items-center gap-1">
                    {stage}
                    <button onClick={() => toggleArrayFilter('stages', stage)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.credentials.map(cred => (
                  <span key={cred} className="px-3 py-1 bg-white rounded-full text-xs font-medium flex items-center gap-1">
                    {cred}
                    <button onClick={() => toggleArrayFilter('credentials', cred)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.fundingStages.map(stage => (
                  <span key={stage} className="px-3 py-1 bg-white rounded-full text-xs font-medium flex items-center gap-1">
                    {stage}
                    <button onClick={() => toggleArrayFilter('fundingStages', stage)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-6 py-3 rounded-lg text-white font-bold transition-all hover:shadow-lg"
              style={{ backgroundColor: brandColors.electricBlue }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// AI Evaluation Panel
function AIEvaluationPanel({ profile, type, onClose }: { profile: any; type: 'founder' | 'startup'; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ml-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: brandColors.electricBlue }}
              >
                {type === 'founder' ? profile.avatar : profile.logo}
              </div>
              <div>
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-sm text-gray-600">AI Evaluation Report</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Overall Score */}
          <div className="text-center">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold ${
                profile.aiScore >= 80 ? 'bg-green-100 text-green-700' :
                profile.aiScore >= 60 ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}
            >
              {profile.aiScore}
            </div>
            <p className="text-sm text-gray-600 mt-2">Overall AI Score</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Score Breakdown */}
          <div>
            <h3 className="font-bold text-lg mb-4">Score Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: type === 'founder' ? 'Experience & Background' : 'Team Quality', score: 90 },
                { label: type === 'founder' ? 'Startup Viability' : 'Product-Market Fit', score: 85 },
                { label: type === 'founder' ? 'Execution Capability' : 'Traction & Growth', score: 88 },
                { label: 'Market Opportunity', score: 80 },
                { label: type === 'founder' ? 'Team Strength' : 'Competitive Position', score: 75 }
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm font-bold">{item.score}/100</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.score}%`,
                        backgroundColor: item.score >= 80 ? '#22c55e' : item.score >= 60 ? '#f59e0b' : '#6b7280'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Strengths
            </h3>
            <div className="space-y-2">
              {[
                'Strong technical background with proven execution',
                'Clear value proposition with market validation',
                'Impressive growth metrics and user engagement',
                'Well-positioned in growing market segment'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Areas of Concern */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Areas of Concern
            </h3>
            <div className="space-y-2">
              {[
                'Limited fundraising experience',
                'Customer concentration risk',
                'Competitive landscape intensifying'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" style={{ color: brandColors.atomicOrange }} />
              Opportunities
            </h3>
            <div className="space-y-2">
              {[
                'Market timing excellent with regulatory tailwinds',
                'Potential synergy with existing portfolio companies',
                'Strong network effects as user base grows'
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: brandColors.atomicOrange }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-bold text-lg mb-2">AI Recommendation</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-bold">Suggested Action:</span> Schedule introductory call within 1 week</p>
              <p><span className="font-bold">Investment Fit:</span> High (85% match with your thesis)</p>
              <p><span className="font-bold">Risk Level:</span> Moderate</p>
              <p><span className="font-bold">Timeline:</span> Strong candidate for immediate engagement</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
