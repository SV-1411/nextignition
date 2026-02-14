import { motion } from 'motion/react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Briefcase,
  Star,
  Heart,
  MessageCircle,
  Filter,
  Zap,
  Target,
  Code,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Award,
  CheckCircle,
  Sparkles,
  Linkedin,
  ExternalLink,
  X
} from 'lucide-react';
import { useState } from 'react';
import { brandColors } from '../utils/colors';

interface CoFounder {
  id: number;
  name: string;
  avatar: string;
  currentRole: string;
  lookingFor: string;
  skills: string[];
  location: string;
  commitment: 'Full-time' | 'Part-time' | 'Flexible';
  equityExpectation: string;
  yearsExperience: number;
  previousStartups: number;
  availability: string;
  matchScore: number;
  verified: boolean;
  vision: string;
  strengths: string[];
  interests: string[];
  linkedinUrl?: string;
  startupStatus: 'has-startup' | 'wants-to-join' | 'ideal';
}

export function DiscoverCoFounders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('match');
  const [startupStatus, setStartupStatus] = useState<string>('all');
  const [selectedCofounder, setSelectedCofounder] = useState<CoFounder | null>(null);

  const [filters, setFilters] = useState({
    skills: [] as string[],
    location: [] as string[],
    commitment: [] as string[],
    equityFlexibility: [] as string[],
    experience: [] as string[],
  });

  const skillCategories = [
    'Technical/Engineering',
    'Product & Design',
    'Business & Strategy',
    'Marketing & Growth',
    'Sales & BD',
    'Operations',
    'Finance',
    'Legal',
  ];

  const locations = ['San Francisco', 'New York', 'Remote', 'Austin', 'Boston', 'Los Angeles', 'London', 'Berlin'];
  const commitmentLevels = ['Full-time', 'Part-time', 'Flexible'];
  const equityOptions = ['Very Flexible', 'Somewhat Flexible', 'Fixed Range'];
  const experienceLevels = ['First-time Founder', '1-2 Startups', '3+ Startups', 'Exited Founder'];

  const sortOptions = [
    { value: 'match', label: 'Best Match' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'recent', label: 'Recently Active' },
  ];

  const mockCoFounders: CoFounder[] = [
    {
      id: 1,
      name: 'Alex Thompson',
      avatar: 'AT',
      currentRole: 'Senior Full-Stack Engineer at Meta',
      lookingFor: 'Business-minded co-founder for B2B SaaS',
      skills: ['Full-Stack Development', 'System Architecture', 'AI/ML'],
      location: 'San Francisco, CA',
      commitment: 'Full-time',
      equityExpectation: '40-50%',
      yearsExperience: 8,
      previousStartups: 1,
      availability: 'Available in 2 months',
      matchScore: 94,
      verified: true,
      vision: 'Build enterprise-grade infrastructure that scales globally',
      strengths: ['Technical Leadership', 'Product Development', 'Team Building'],
      interests: ['Enterprise SaaS', 'DevOps', 'AI/ML'],
      linkedinUrl: 'https://www.linkedin.com/in/alexthompson',
      startupStatus: 'has-startup'
    },
    {
      id: 2,
      name: 'Maria Garcia',
      avatar: 'MG',
      currentRole: 'Product Manager at Stripe',
      lookingFor: 'Technical co-founder with FinTech experience',
      skills: ['Product Strategy', 'User Research', 'Growth'],
      location: 'New York, NY',
      commitment: 'Full-time',
      equityExpectation: '35-45%',
      yearsExperience: 6,
      previousStartups: 2,
      availability: 'Immediately',
      matchScore: 91,
      verified: true,
      vision: 'Democratize access to financial services for underserved markets',
      strengths: ['Product-Market Fit', 'Go-to-Market', 'Fundraising'],
      interests: ['FinTech', 'Consumer Apps', 'Emerging Markets'],
      linkedinUrl: 'https://www.linkedin.com/in/mariagarcia',
      startupStatus: 'wants-to-join'
    },
    {
      id: 3,
      name: 'James Park',
      avatar: 'JP',
      currentRole: 'Design Lead at Airbnb',
      lookingFor: 'Technical + Business co-founders for consumer app',
      skills: ['UI/UX Design', 'Brand Strategy', 'Product Design'],
      location: 'Remote',
      commitment: 'Flexible',
      equityExpectation: '30-40%',
      yearsExperience: 7,
      previousStartups: 1,
      availability: 'Available now',
      matchScore: 88,
      verified: true,
      vision: 'Create delightful consumer experiences that people love',
      strengths: ['Design Thinking', 'User Experience', 'Brand Building'],
      interests: ['Consumer Apps', 'E-commerce', 'Social Platforms'],
      linkedinUrl: 'https://www.linkedin.com/in/jamespark',
      startupStatus: 'ideal'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      avatar: 'SW',
      currentRole: 'VP of Marketing at HubSpot',
      lookingFor: 'Technical co-founder for MarTech startup',
      skills: ['Growth Marketing', 'Brand Building', 'Content Strategy'],
      location: 'Boston, MA',
      commitment: 'Full-time',
      equityExpectation: '40-50%',
      yearsExperience: 10,
      previousStartups: 2,
      availability: 'Available in 1 month',
      matchScore: 92,
      verified: true,
      vision: 'Build the next generation of marketing automation tools',
      strengths: ['Growth Hacking', 'Content Marketing', 'Community Building'],
      interests: ['MarTech', 'Enterprise SaaS', 'AI/ML'],
      linkedinUrl: 'https://www.linkedin.com/in/sarahwilliams',
      startupStatus: 'has-startup'
    },
    {
      id: 5,
      name: 'David Chen',
      avatar: 'DC',
      currentRole: 'Data Scientist at OpenAI',
      lookingFor: 'Product-focused co-founder for AI startup',
      skills: ['Machine Learning', 'Data Science', 'AI Research'],
      location: 'San Francisco, CA',
      commitment: 'Full-time',
      equityExpectation: '45-50%',
      yearsExperience: 5,
      previousStartups: 0,
      availability: 'Available in 3 months',
      matchScore: 86,
      verified: true,
      vision: 'Apply cutting-edge AI to solve real-world problems',
      strengths: ['AI/ML', 'Research', 'Technical Innovation'],
      interests: ['AI/ML', 'HealthTech', 'Climate Tech'],
      linkedinUrl: 'https://www.linkedin.com/in/davidchen',
      startupStatus: 'wants-to-join'
    },
    {
      id: 6,
      name: 'Emma Rodriguez',
      avatar: 'ER',
      currentRole: 'Sales Director at Salesforce',
      lookingFor: 'Technical + Product co-founders for B2B SaaS',
      skills: ['Enterprise Sales', 'Business Development', 'Revenue Operations'],
      location: 'Austin, TX',
      commitment: 'Full-time',
      equityExpectation: '35-45%',
      yearsExperience: 9,
      previousStartups: 1,
      availability: 'Immediately',
      matchScore: 89,
      verified: true,
      vision: 'Build a sales-led growth engine for enterprise software',
      strengths: ['Enterprise Sales', 'Deal Closing', 'Team Scaling'],
      interests: ['Enterprise SaaS', 'Sales Tech', 'Revenue Operations'],
      linkedinUrl: 'https://www.linkedin.com/in/emmarodriguez',
      startupStatus: 'ideal'
    },
  ];

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    const current = filters[category];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    setFilters({ ...filters, [category]: updated });
  };

  const clearAllFilters = () => {
    setFilters({
      skills: [],
      location: [],
      commitment: [],
      equityFlexibility: [],
      experience: [],
    });
  };

  const activeFilterCount = 
    filters.skills.length + 
    filters.location.length + 
    filters.commitment.length +
    filters.equityFlexibility.length +
    filters.experience.length;

  // Filter co-founders based on startup status
  const filteredCoFounders = mockCoFounders.filter(cf => 
    startupStatus === 'all' || cf.startupStatus === startupStatus
  );

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Discover Co-founders</h1>
              <p className="text-gray-600 mt-1">Find your perfect founding team partner</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-medium">AI-Powered Matching</p>
              <p className="text-xs text-blue-700 mt-1">
                Our algorithm analyzes skill complementarity, vision alignment, and compatibility to show your best matches first
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by skills, interests, or experience..."
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4">
            <p className="text-sm text-gray-600">
              <span className="font-bold">{filteredCoFounders.length}</span> potential co-founders
            </p>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
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
              
              {/* Startup Status Filter */}
              <select
                value={startupStatus}
                onChange={(e) => setStartupStatus(e.target.value)}
                className="px-3 py-2 border-2 border-blue-300 bg-blue-50 text-blue-900 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Founders</option>
                <option value="has-startup">Has Startup</option>
                <option value="wants-to-join">Wants to Join</option>
                <option value="ideal">Ideal (Open to Both)</option>
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
            <div className="grid gap-6">
              {filteredCoFounders.map((cofounder, index) => (
                <motion.div
                  key={cofounder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left: Avatar and Match Score */}
                      <div className="flex flex-col items-center md:items-start gap-4 md:w-48 flex-shrink-0">
                        <div className="relative">
                          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {cofounder.avatar}
                          </div>
                          {cofounder.verified && (
                            <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                              <CheckCircle className="w-5 h-5 text-white" fill="currentColor" />
                            </div>
                          )}
                        </div>

                        {/* Match Score */}
                        <div className="w-full">
                          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Zap className="w-5 h-5 text-green-600" fill="currentColor" />
                              <span className="text-3xl font-bold text-green-600">{cofounder.matchScore}%</span>
                            </div>
                            <div className="text-xs text-green-700 font-medium">Match Score</div>
                          </div>
                        </div>

                        {/* Availability */}
                        <div className="text-center md:text-left w-full">
                          <div className="text-xs text-gray-500 mb-1">AVAILABILITY</div>
                          <div className="text-sm font-bold text-gray-900">{cofounder.availability}</div>
                        </div>
                      </div>

                      {/* Right: Details */}
                      <div className="flex-1">
                        {/* Header */}
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{cofounder.name}</h3>
                          <p className="text-gray-600 mb-2">{cofounder.currentRole}</p>
                          
                          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                            <Target className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs text-blue-600 font-bold mb-1">LOOKING FOR</div>
                              <div className="text-sm text-blue-900">{cofounder.lookingFor}</div>
                            </div>
                          </div>
                        </div>

                        {/* Vision */}
                        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                          <div className="text-xs text-purple-600 font-bold mb-1">VISION</div>
                          <p className="text-sm text-purple-900">{cofounder.vision}</p>
                        </div>

                        {/* Skills */}
                        <div className="mb-4">
                          <div className="text-xs text-gray-500 mb-2">CORE SKILLS</div>
                          <div className="flex flex-wrap gap-2">
                            {cofounder.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Strengths */}
                        <div className="mb-4">
                          <div className="text-xs text-gray-500 mb-2">KEY STRENGTHS</div>
                          <div className="flex flex-wrap gap-2">
                            {cofounder.strengths.map((strength, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                              >
                                {strength}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-t border-gray-200 pt-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Location</div>
                            <div className="font-bold text-gray-900 text-sm flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {cofounder.location.split(',')[0]}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Commitment</div>
                            <div className="font-bold text-gray-900 text-sm">{cofounder.commitment}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Equity Range</div>
                            <div className="font-bold text-gray-900 text-sm">{cofounder.equityExpectation}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Experience</div>
                            <div className="font-bold text-gray-900 text-sm">{cofounder.yearsExperience} years</div>
                          </div>
                        </div>

                        {/* Interests */}
                        <div className="mb-4">
                          <div className="text-xs text-gray-500 mb-2">INTERESTED IN</div>
                          <div className="flex flex-wrap gap-2">
                            {cofounder.interests.map((interest, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                              >
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            className="flex-1 px-6 py-3 bg-gradient-to-r text-white rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            style={{
                              background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})`
                            }}
                          >
                            <MessageCircle className="w-5 h-5" />
                            Connect Now
                          </button>
                          <button className="px-6 py-3 border-2 border-pink-500 text-pink-600 rounded-lg font-bold hover:bg-pink-50 transition-colors flex items-center justify-center gap-2">
                            <Heart className="w-5 h-5" />
                            Save
                          </button>
                          {cofounder.linkedinUrl && (
                            <button
                              onClick={() => window.open(cofounder.linkedinUrl, '_blank')}
                              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                              title="View LinkedIn Profile"
                            >
                              <Linkedin className="w-5 h-5" />
                              LinkedIn
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedCofounder(cofounder)}
                            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                          >
                            View Profile
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Load More Co-founders
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

                {/* Skills Filter */}
                <div className="mb-6">
                  <h4 className="font-bold text-sm text-gray-700 mb-3">Skills Looking For</h4>
                  <div className="space-y-2">
                    {skillCategories.map((skill) => (
                      <label key={skill} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.skills.includes(skill)}
                          onChange={() => toggleFilter('skills', skill)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <h4 className="font-bold text-sm text-gray-700 mb-3">Location Preference</h4>
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <label key={location} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.location.includes(location)}
                          onChange={() => toggleFilter('location', location)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Commitment Filter */}
                <div className="mb-6">
                  <h4 className="font-bold text-sm text-gray-700 mb-3">Commitment Level</h4>
                  <div className="space-y-2">
                    {commitmentLevels.map((level) => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.commitment.includes(level)}
                          onChange={() => toggleFilter('commitment', level)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Equity Flexibility */}
                <div className="mb-6">
                  <h4 className="font-bold text-sm text-gray-700 mb-3">Equity Flexibility</h4>
                  <div className="space-y-2">
                    {equityOptions.map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.equityFlexibility.includes(option)}
                          onChange={() => toggleFilter('equityFlexibility', option)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <h4 className="font-bold text-sm text-gray-700 mb-3">Experience Level</h4>
                  <div className="space-y-2">
                    {experienceLevels.map((level) => (
                      <label key={level} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.experience.includes(level)}
                          onChange={() => toggleFilter('experience', level)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Profile Detail Modal */}
      {selectedCofounder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {selectedCofounder.avatar}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    {selectedCofounder.name}
                    {selectedCofounder.verified && (
                      <CheckCircle className="w-5 h-5 text-blue-500" fill="currentColor" />
                    )}
                  </h2>
                  <p className="text-gray-600">{selectedCofounder.currentRole}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCofounder(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Match Score Banner */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-green-900 mb-1">Compatibility Match</h3>
                    <p className="text-sm text-green-700">Based on AI analysis of skills, vision, and experience</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-8 h-8 text-green-600" fill="currentColor" />
                    <span className="text-5xl font-bold text-green-600">{selectedCofounder.matchScore}%</span>
                  </div>
                </div>
              </div>

              {/* Looking For */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <Target className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-sm font-bold text-blue-600 mb-2">LOOKING FOR</h3>
                    <p className="text-blue-900 text-lg">{selectedCofounder.lookingFor}</p>
                  </div>
                </div>
              </div>

              {/* Vision */}
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h3 className="text-sm font-bold text-purple-600 mb-3">VISION & GOALS</h3>
                <p className="text-purple-900 text-lg leading-relaxed">{selectedCofounder.vision}</p>
              </div>

              {/* Core Skills */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">CORE SKILLS</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCofounder.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Strengths */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">KEY STRENGTHS</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCofounder.strengths.map((strength, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Location</div>
                  <div className="font-bold text-gray-900 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedCofounder.location}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Commitment</div>
                  <div className="font-bold text-gray-900">{selectedCofounder.commitment}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Equity Range</div>
                  <div className="font-bold text-gray-900">{selectedCofounder.equityExpectation}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Experience</div>
                  <div className="font-bold text-gray-900">{selectedCofounder.yearsExperience} years</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Availability</div>
                  <div className="font-bold text-gray-900">{selectedCofounder.availability}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Previous Startups</div>
                  <div className="font-bold text-gray-900">{selectedCofounder.previousStartups}</div>
                </div>
              </div>

              {/* Interests */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">INTERESTED IN</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCofounder.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  className="flex-1 px-6 py-4 bg-gradient-to-r text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-lg"
                  style={{
                    background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})`
                  }}
                >
                  <MessageCircle className="w-6 h-6" />
                  Send Connection Request
                </button>
                {selectedCofounder.linkedinUrl && (
                  <button
                    onClick={() => window.open(selectedCofounder.linkedinUrl, '_blank')}
                    className="px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Linkedin className="w-6 h-6" />
                    View LinkedIn
                  </button>
                )}
                <button className="px-6 py-4 border-2 border-pink-500 text-pink-600 rounded-xl font-bold hover:bg-pink-50 transition-colors flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6" />
                  Save Profile
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}