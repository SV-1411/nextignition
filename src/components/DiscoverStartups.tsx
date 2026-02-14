import { motion } from 'motion/react';
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  TrendingUp,
  MapPin,
  Users,
  DollarSign,
  Target,
  Star,
  Eye,
  ChevronDown,
  X,
  Filter,
  Save,
  Clock,
  Zap,
  Award,
  Building,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { brandColors } from '../utils/colors';
import { AIAnalysisModal } from './AIAnalysisModal';

interface Startup {
  id: number;
  name: string;
  logo: string;
  tagline: string;
  industry: string[];
  stage: string;
  location: string;
  fundingGoal: string;
  raised: string;
  equity: string;
  teamSize: number;
  mrr: string;
  growth: string;
  featured: boolean;
  saved: boolean;
  views: number;
  matchScore?: number;
}

export function DiscoverStartups() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [savedSearchName, setSavedSearchName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedStartupForAI, setSelectedStartupForAI] = useState<Startup | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    industries: [] as string[],
    stages: [] as string[],
    locations: [] as string[],
    fundingRange: { min: 0, max: 10000000 },
    equityRange: { min: 0, max: 100 },
  });

  const industries = [
    'Enterprise SaaS',
    'FinTech',
    'HealthTech',
    'Climate Tech',
    'AI/ML',
    'E-commerce',
    'EdTech',
    'MarketPlace'
  ];

  const stages = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+'];
  const locations = ['San Francisco', 'New York', 'Austin', 'Remote', 'Boston', 'Los Angeles'];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'newest', label: 'Newest First' },
    { value: 'funding', label: 'Highest Funding Goal' },
    { value: 'traction', label: 'Best Traction' },
    { value: 'match', label: 'Best Match' },
  ];

  const savedSearches = [
    { name: 'Early Stage SaaS', filters: 'Seed, Series A • Enterprise SaaS', count: 24 },
    { name: 'FinTech Series A', filters: 'Series A • FinTech', count: 12 },
    { name: 'Climate Tech', filters: 'All Stages • Climate Tech', count: 18 },
  ];

  const mockStartups: Startup[] = [
    {
      id: 1,
      name: 'TechFlow AI',
      logo: '🚀',
      tagline: 'AI-powered workflow automation for enterprise teams',
      industry: ['Enterprise SaaS', 'AI/ML'],
      stage: 'Series A',
      location: 'San Francisco, CA',
      fundingGoal: '$5M',
      raised: '$2.3M',
      equity: '15-20%',
      teamSize: 12,
      mrr: '$45K',
      growth: '+240%',
      featured: true,
      saved: false,
      views: 1420,
      matchScore: 94,
    },
    {
      id: 2,
      name: 'HealthSync',
      logo: '💊',
      tagline: 'Connecting patients with healthcare providers seamlessly',
      industry: ['HealthTech'],
      stage: 'Seed',
      location: 'New York, NY',
      fundingGoal: '$2M',
      raised: '$800K',
      equity: '10-15%',
      teamSize: 8,
      mrr: '$22K',
      growth: '+180%',
      featured: false,
      saved: true,
      views: 890,
      matchScore: 88,
    },
    {
      id: 3,
      name: 'GreenScale',
      logo: '🌱',
      tagline: 'Carbon footprint tracking for supply chains',
      industry: ['Climate Tech'],
      stage: 'Seed',
      location: 'Austin, TX',
      fundingGoal: '$3M',
      raised: '$1.2M',
      equity: '12-18%',
      teamSize: 10,
      mrr: '$30K',
      growth: '+200%',
      featured: true,
      saved: false,
      views: 1150,
      matchScore: 91,
    },
    {
      id: 4,
      name: 'PayFlow',
      logo: '💳',
      tagline: 'Next-gen payment infrastructure for SMBs',
      industry: ['FinTech'],
      stage: 'Series A',
      location: 'San Francisco, CA',
      fundingGoal: '$8M',
      raised: '$3.5M',
      equity: '15-20%',
      teamSize: 15,
      mrr: '$65K',
      growth: '+310%',
      featured: false,
      saved: false,
      views: 1680,
      matchScore: 86,
    },
    {
      id: 5,
      name: 'EduNova',
      logo: '📚',
      tagline: 'Personalized learning platform powered by AI',
      industry: ['EdTech', 'AI/ML'],
      stage: 'Seed',
      location: 'Remote',
      fundingGoal: '$2.5M',
      raised: '$900K',
      equity: '10-15%',
      teamSize: 7,
      mrr: '$18K',
      growth: '+150%',
      featured: false,
      saved: true,
      views: 720,
      matchScore: 82,
    },
    {
      id: 6,
      name: 'CloudBridge',
      logo: '☁️',
      tagline: 'Multi-cloud management for enterprises',
      industry: ['Enterprise SaaS'],
      stage: 'Series A',
      location: 'Boston, MA',
      fundingGoal: '$6M',
      raised: '$2.8M',
      equity: '12-18%',
      teamSize: 14,
      mrr: '$52K',
      growth: '+220%',
      featured: false,
      saved: false,
      views: 1320,
      matchScore: 89,
    },
  ];

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    if (category === 'industries' || category === 'stages' || category === 'locations') {
      const current = filters[category];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      setFilters({ ...filters, [category]: updated });
    }
  };

  const clearAllFilters = () => {
    setFilters({
      industries: [],
      stages: [],
      locations: [],
      fundingRange: { min: 0, max: 10000000 },
      equityRange: { min: 0, max: 100 },
    });
  };

  const activeFilterCount = 
    filters.industries.length + 
    filters.stages.length + 
    filters.locations.length;

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Discover Startups</h1>
              <p className="text-gray-600 mt-1">Find your next investment opportunity</p>
            </div>
            <button
              onClick={() => setShowSaveModal(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 self-start md:self-auto"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save Search</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search startups by name, industry, or keyword..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden px-4 py-3 bg-gray-900 text-white rounded-lg flex items-center gap-2 relative"
            >
              <Filter className="w-5 h-5" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Sorting and Results Count */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              <span className="font-bold">{mockStartups.length}</span> startups found
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors relative"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Results Grid */}
          <main className={showFilters ? 'lg:col-span-9' : 'lg:col-span-12'}>
            <div className="grid md:grid-cols-2 gap-6">
              {mockStartups.map((startup, index) => (
                <motion.div
                  key={startup.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group relative"
                >
                  {/* Featured Badge */}
                  {startup.featured && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3" fill="currentColor" />
                        Featured
                      </div>
                    </div>
                  )}

                  {/* Match Score */}
                  {startup.matchScore && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3" fill="currentColor" />
                        {startup.matchScore}% Match
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                        {startup.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg mb-1">{startup.name}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{startup.tagline}</p>
                      </div>
                      <button
                        className={`p-2 rounded-lg transition-colors ${
                          startup.saved
                            ? 'bg-blue-50 text-blue-600'
                            : 'hover:bg-gray-100 text-gray-400'
                        }`}
                      >
                        <Bookmark
                          className="w-5 h-5"
                          fill={startup.saved ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>

                    {/* Industry Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {startup.industry.map((ind, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                        >
                          {ind}
                        </span>
                      ))}
                      <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">
                        {startup.stage}
                      </span>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Funding Goal</div>
                        <div className="font-bold text-gray-900">{startup.fundingGoal}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Raised</div>
                        <div className="font-bold text-green-600">{startup.raised}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">MRR</div>
                        <div className="font-bold text-gray-900">{startup.mrr}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Growth</div>
                        <div className="font-bold text-blue-600 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {startup.growth}
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {startup.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {startup.teamSize} team members
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Target className="w-4 h-4" />
                        Seeking {startup.equity} equity
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Eye className="w-4 h-4" />
                        {startup.views.toLocaleString()} profile views
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        className="flex-1 px-4 py-2 bg-gradient-to-r text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                        style={{
                          background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})`
                        }}
                        onClick={() => {
                          setSelectedStartupForAI(startup);
                          setShowAIModal(true);
                        }}
                      >
                        View Details
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Load More Startups
              </button>
            </div>
          </main>

          {/* Filter Sidebar */}
          {showFilters && (
            <aside className="lg:col-span-3">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters
                  </h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Industry Filter */}
                <div className="mb-6">
                  <h4 className="font-bold text-sm text-gray-700 mb-3">Industry</h4>
                  <div className="space-y-2">
                    {industries.map((industry) => (
                      <label key={industry} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.industries.includes(industry)}
                          onChange={() => toggleFilter('industries', industry)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{industry}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Stage Filter */}
                <div className="mb-6">
                  <h4 className="font-bold text-sm text-gray-700 mb-3">Stage</h4>
                  <div className="space-y-2">
                    {stages.map((stage) => (
                      <label key={stage} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.stages.includes(stage)}
                          onChange={() => toggleFilter('stages', stage)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{stage}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <h4 className="font-bold text-sm text-gray-700 mb-3">Location</h4>
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <label key={location} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.locations.includes(location)}
                          onChange={() => toggleFilter('locations', location)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Funding Range */}
                <div className="mb-6">
                  <h4 className="font-bold text-sm text-gray-700 mb-3">Funding Goal</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600">Min ($)</label>
                      <input
                        type="text"
                        placeholder="0"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Max ($)</label>
                      <input
                        type="text"
                        placeholder="10,000,000+"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Equity Range */}
                <div>
                  <h4 className="font-bold text-sm text-gray-700 mb-3">Equity Offered (%)</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600">Min</label>
                      <input
                        type="text"
                        placeholder="0"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Max</label>
                      <input
                        type="text"
                        placeholder="100"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Save Search Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Save Search</h3>
              <button onClick={() => setShowSaveModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Save your current search filters and get notified when new matching startups are added.
            </p>
            <input
              type="text"
              value={savedSearchName}
              onChange={(e) => setSavedSearchName(e.target.value)}
              placeholder="Enter search name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-3 bg-gradient-to-r text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                style={{
                  background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})`
                }}
              >
                Save Search
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* AI Modal */}
      {showAIModal && selectedStartupForAI && (
        <AIAnalysisModal
          startup={selectedStartupForAI}
          onClose={() => setShowAIModal(false)}
        />
      )}
    </div>
  );
}