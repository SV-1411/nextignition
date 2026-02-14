import { motion } from 'motion/react';
import {
  Search,
  SlidersHorizontal,
  Star,
  Calendar,
  DollarSign,
  Award,
  CheckCircle,
  Clock,
  Video,
  MessageCircle,
  Filter,
  Zap,
  TrendingUp,
  Users,
  BookOpen,
  Target,
  Briefcase
} from 'lucide-react';
import { useState } from 'react';
import { brandColors } from '../utils/colors';
import { ProfileViewModal } from './ProfileViewModal';

interface Expert {
  id: number;
  name: string;
  avatar: string;
  title: string;
  specialization: string[];
  rating: number;
  totalReviews: number;
  hourlyRate: string;
  yearsExperience: number;
  sessionsCompleted: number;
  responseTime: string;
  availability: 'Available' | 'Limited' | 'Booked';
  featured: boolean;
  verified: boolean;
  expertise: string;
  topSkills: string[];
}

import { useEffect, useState } from 'react';
import api from '../services/api';

export function DiscoverExperts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await api.get('/auth/users?role=expert');
        // Map backend users to Expert interface
        const realExperts = response.data.map((u: any) => ({
          id: u._id,
          name: u.name,
          avatar: u.avatar || u.name.charAt(0),
          title: u.profile.title || 'Expert Mentor',
          specialization: u.profile.expertise ? [u.profile.expertise] : [],
          rating: 4.8, // Default
          totalReviews: 0,
          hourlyRate: u.profile.hourlyRate ? `₹${u.profile.hourlyRate}` : 'Free',
          yearsExperience: u.profile.experience || 0,
          sessionsCompleted: 0,
          responseTime: '<24 hrs',
          availability: 'Available',
          featured: false,
          verified: true,
          expertise: u.profile.bio || 'Professional expert on NextIgnition',
          topSkills: u.profile.skills || [],
        }));

        // Merge with mock experts for design demo
        setExperts([...realExperts, ...mockExperts]);
      } catch (error) {
        console.error('Failed to fetch experts', error);
        setExperts(mockExperts);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  const [filters, setFilters] = useState({
    expertise: [] as string[],
    experience: [] as string[],
    rating: 0,
    priceRange: { min: 0, max: 1000 },
    availability: [] as string[],
  });

  const expertiseAreas = [
    'Product Strategy',
    'Fundraising',
    'Growth Marketing',
    'Team Building',
    'Sales Strategy',
    'Technical Architecture',
    'UI/UX Design',
    'Legal & Compliance',
  ];

  const experienceLevels = [
    '0-5 years',
    '5-10 years',
    '10-15 years',
    '15+ years',
  ];

  const availabilityOptions = ['Available', 'Limited', 'Booked'];

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'sessions', label: 'Most Sessions' },
  ];

  const mockExperts: Expert[] = [
    {
      id: 1,
      name: 'Dr. Michael Johnson',
      avatar: 'MJ',
      title: 'Former VP of Product at Google',
      specialization: ['Product Strategy', 'Fundraising', 'Team Building'],
      rating: 4.9,
      totalReviews: 127,
      hourlyRate: '$500',
      yearsExperience: 15,
      sessionsCompleted: 248,
      responseTime: '<2 hrs',
      availability: 'Available',
      featured: true,
      verified: true,
      expertise: 'Helped 50+ startups raise $200M+ in funding',
      topSkills: ['Product-Market Fit', 'Fundraising', 'Scaling Teams'],
    },
    {
      id: 2,
      name: 'Sarah Martinez',
      avatar: 'SM',
      title: 'Growth Marketing Expert',
      specialization: ['Growth Marketing', 'Sales Strategy'],
      rating: 4.8,
      totalReviews: 95,
      hourlyRate: '$350',
      yearsExperience: 10,
      sessionsCompleted: 186,
      responseTime: '<3 hrs',
      availability: 'Available',
      featured: true,
      verified: true,
      expertise: 'Scaled 3 startups from 0 to $10M ARR',
      topSkills: ['Growth Hacking', 'SEO/SEM', 'Conversion Optimization'],
    },
    {
      id: 3,
      name: 'James Chen',
      avatar: 'JC',
      title: 'Technical Co-founder & CTO',
      specialization: ['Technical Architecture', 'Team Building'],
      rating: 4.9,
      totalReviews: 142,
      hourlyRate: '$450',
      yearsExperience: 12,
      sessionsCompleted: 203,
      responseTime: '<1 hr',
      availability: 'Limited',
      featured: false,
      verified: true,
      expertise: 'Built engineering teams at 5 successful startups',
      topSkills: ['System Architecture', 'Team Hiring', 'Tech Stack'],
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      avatar: 'ER',
      title: 'UI/UX Design Lead',
      specialization: ['UI/UX Design', 'Product Strategy'],
      rating: 4.7,
      totalReviews: 78,
      hourlyRate: '$300',
      yearsExperience: 8,
      sessionsCompleted: 134,
      responseTime: '<4 hrs',
      availability: 'Available',
      featured: false,
      verified: true,
      expertise: 'Award-winning designer with 100+ product launches',
      topSkills: ['User Research', 'Design Systems', 'Prototyping'],
    },
    {
      id: 5,
      name: 'David Park',
      avatar: 'DP',
      title: 'Legal & Compliance Advisor',
      specialization: ['Legal & Compliance', 'Fundraising'],
      rating: 4.8,
      totalReviews: 89,
      hourlyRate: '$400',
      yearsExperience: 14,
      sessionsCompleted: 156,
      responseTime: '<3 hrs',
      availability: 'Available',
      featured: false,
      verified: true,
      expertise: 'Former startup lawyer at top Silicon Valley firm',
      topSkills: ['Term Sheets', 'IP Protection', 'Compliance'],
    },
    {
      id: 6,
      name: 'Lisa Anderson',
      avatar: 'LA',
      title: 'Sales Strategy Coach',
      specialization: ['Sales Strategy', 'Growth Marketing'],
      rating: 4.9,
      totalReviews: 112,
      hourlyRate: '$380',
      yearsExperience: 11,
      sessionsCompleted: 198,
      responseTime: '<2 hrs',
      availability: 'Limited',
      featured: true,
      verified: true,
      expertise: 'Built sales teams generating $500M+ revenue',
      topSkills: ['B2B Sales', 'Sales Processes', 'Lead Generation'],
    },
  ];

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    if (category === 'expertise' || category === 'experience' || category === 'availability') {
      const current = filters[category];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      setFilters({ ...filters, [category]: updated });
    }
  };

  const clearAllFilters = () => {
    setFilters({
      expertise: [],
      experience: [],
      rating: 0,
      priceRange: { min: 0, max: 1000 },
      availability: [],
    });
  };

  const activeFilterCount =
    filters.expertise.length +
    filters.experience.length +
    filters.availability.length +
    (filters.rating > 0 ? 1 : 0);

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Discover Experts</h1>
              <p className="text-gray-600 mt-1">Connect with mentors who can accelerate your growth</p>
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
                placeholder="Search experts by name, expertise, or skill..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sorting and Results Count */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              <span className="font-bold">{experts.length}</span> experts found
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
            {/* Featured Experts Banner */}
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5" />
                <h3 className="font-bold">Featured Experts</h3>
              </div>
              <p className="text-sm text-blue-100">
                Top-rated mentors with proven track records of helping founders succeed
              </p>
            </div>

            <div className="grid gap-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                experts.map((expert, index) => (
                  <motion.div
                    key={expert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${expert.featured ? 'ring-2 ring-yellow-400' : ''
                      }`}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Left: Avatar and Basic Info */}
                        <div className="flex flex-col items-center md:items-start gap-4 md:w-48 flex-shrink-0">
                          <div className="relative">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                              {expert.avatar}
                            </div>
                            {expert.verified && (
                              <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                                <CheckCircle className="w-5 h-5 text-white" fill="currentColor" />
                              </div>
                            )}
                          </div>

                          {/* Availability Badge */}
                          <div
                            className={`px-4 py-2 rounded-lg text-sm font-bold text-center w-full ${expert.availability === 'Available'
                              ? 'bg-green-100 text-green-700'
                              : expert.availability === 'Limited'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                              }`}
                          >
                            {expert.availability}
                          </div>

                          {/* Price */}
                          <div className="text-center md:text-left w-full">
                            <div className="text-2xl font-bold text-gray-900">{expert.hourlyRate}</div>
                            <div className="text-sm text-gray-500">per hour</div>
                          </div>
                        </div>

                        {/* Right: Details */}
                        <div className="flex-1">
                          {/* Header */}
                          <div className="mb-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{expert.name}</h3>
                                <p className="text-gray-600">{expert.title}</p>
                              </div>
                              {expert.featured && (
                                <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1">
                                  <Star className="w-3 h-3" fill="currentColor" />
                                  Featured
                                </div>
                              )}
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                <span className="font-bold text-gray-900">{expert.rating}</span>
                                <span className="text-sm text-gray-500">({expert.totalReviews} reviews)</span>
                              </div>
                              <div className="h-4 w-px bg-gray-300" />
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Users className="w-4 h-4" />
                                {expert.sessionsCompleted} sessions
                              </div>
                            </div>
                          </div>

                          {/* Expertise Statement */}
                          <p className="text-gray-700 mb-4 flex items-start gap-2">
                            <Zap className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                            {expert.expertise}
                          </p>

                          {/* Specialization Tags */}
                          <div className="mb-4">
                            <div className="text-xs text-gray-500 mb-2">SPECIALIZES IN</div>
                            <div className="flex flex-wrap gap-2">
                              {expert.specialization.map((spec, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Top Skills */}
                          <div className="mb-4">
                            <div className="text-xs text-gray-500 mb-2">TOP SKILLS</div>
                            <div className="flex flex-wrap gap-2">
                              {expert.topSkills.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Stats Row */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 pb-4 border-t border-gray-200 pt-4">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Experience</div>
                              <div className="font-bold text-gray-900">{expert.yearsExperience} years</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Response Time</div>
                              <div className="font-bold text-gray-900">{expert.responseTime}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Sessions</div>
                              <div className="font-bold text-gray-900">{expert.sessionsCompleted}</div>
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
                              <Calendar className="w-5 h-5" />
                              Book Session
                            </button>
                            <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                              <MessageCircle className="w-5 h-5" />
                              Message
                            </button>
                            <button
                              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                              onClick={() => setSelectedProfile(expert)}
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Load More Experts
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

                {/* Expertise Area Filter */}
                <div className="mb-6">
                  <h4 className="font-bold text-sm text-gray-700 mb-3">Expertise Area</h4>
                  <div className="space-y-2">
                    {expertiseAreas.map((area) => (
                      <label key={area} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.expertise.includes(area)}
                          onChange={() => toggleFilter('expertise', area)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Filter */}
                <div className="mb-6">
                  <h4 className="font-bold text-sm text-gray-700 mb-3">Years of Experience</h4>
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

                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="font-bold text-sm text-gray-700 mb-3">Minimum Rating</h4>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.rating === rating}
                          onChange={() => setFilters({ ...filters, rating })}
                          className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-gray-700">{rating}+ stars</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-bold text-sm text-gray-700 mb-3">Hourly Rate</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600">Min</label>
                      <input
                        type="text"
                        placeholder="$0"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Max</label>
                      <input
                        type="text"
                        placeholder="$1000+"
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <h4 className="font-bold text-sm text-gray-700 mb-3">Availability</h4>
                  <div className="space-y-2">
                    {availabilityOptions.map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.availability.includes(option)}
                          onChange={() => toggleFilter('availability', option)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Profile View Modal */}
      {selectedProfile && (
        <ProfileViewModal
          profile={{
            id: selectedProfile.id,
            name: selectedProfile.name,
            role: selectedProfile.title,
            title: selectedProfile.title,
            location: 'San Francisco, CA',
            rating: selectedProfile.rating,
            reviews: selectedProfile.totalReviews,
            hourlyRate: selectedProfile.hourlyRate,
            experience: `${selectedProfile.yearsExperience} years`,
            skills: selectedProfile.topSkills,
            expertise: selectedProfile.specialization,
            bio: selectedProfile.expertise + '. Passionate about helping startups succeed through strategic mentorship and hands-on guidance.',
            availability: selectedProfile.availability,
            responseTime: selectedProfile.responseTime,
            completedProjects: selectedProfile.sessionsCompleted,
            successRate: 95,
            certifications: ['Certified Product Manager', 'Stanford GSB Executive Education'],
            education: ['MBA, Stanford University', 'BS Computer Science, MIT'],
            portfolio: [
              { title: 'Startup A - Series A Fundraising', description: 'Helped raise $5M Series A round' },
              { title: 'Startup B - Product Strategy', description: 'Defined product roadmap leading to 10x growth' }
            ],
            testimonials: [
              { author: 'Jane Doe, CEO at TechCo', text: 'Incredible mentor who helped us navigate our fundraising journey.', rating: 5 },
              { author: 'John Smith, Founder at StartupX', text: 'Strategic insights that transformed our business model.', rating: 5 }
            ],
            linkedin: 'https://linkedin.com/in/example',
            website: 'https://example.com',
            email: 'expert@example.com',
            verified: selectedProfile.verified,
            type: 'expert' as const
          }}
          onClose={() => setSelectedProfile(null)}
        />
      )}
    </div>
  );
}