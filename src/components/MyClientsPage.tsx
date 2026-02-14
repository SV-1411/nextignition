import { motion } from 'motion/react';
import { 
  Sparkles, 
  Users, 
  TrendingUp, 
  Calendar,
  MessageCircle,
  Video,
  ChevronLeft,
  ChevronRight,
  Target,
  Award,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react';
import { useState } from 'react';
import { brandColors } from '../utils/colors';
import { ScheduleMeetingModal } from './ScheduleMeetingModal';

interface Client {
  id: number;
  name: string;
  startup: string;
  industry: string;
  stage: string;
  matchScore: number;
  status: 'active' | 'pending' | 'completed';
  sessionsCompleted: number;
  nextSession?: string;
  avatar: string;
}

interface AIMatchedStartup {
  id: number;
  startup: string;
  founder: string;
  industry: string;
  stage: string;
  matchScore: number;
  matchReason: string;
  avatar: string;
  needsHelp: string;
}

export function MyClientsPage() {
  const [aiCarouselIndex, setAiCarouselIndex] = useState(0);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'completed'>('all');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const aiMatchedStartups: AIMatchedStartup[] = [
    {
      id: 1,
      startup: 'TechFlow AI',
      founder: 'Sarah Chen',
      industry: 'AI/ML',
      stage: 'Seed',
      matchScore: 95,
      matchReason: 'Needs growth marketing help',
      avatar: 'SC',
      needsHelp: 'Looking for expert guidance on SaaS growth strategies and user acquisition'
    },
    {
      id: 2,
      startup: 'GreenScale',
      founder: 'Marcus Williams',
      industry: 'Climate Tech',
      stage: 'Pre-Seed',
      matchScore: 92,
      matchReason: 'Needs product strategy advice',
      avatar: 'MW',
      needsHelp: 'Seeking mentorship on product-market fit and go-to-market planning'
    },
    {
      id: 3,
      startup: 'HealthSync',
      founder: 'Jennifer Park',
      industry: 'HealthTech',
      stage: 'Seed',
      matchScore: 88,
      matchReason: 'Needs fundraising guidance',
      avatar: 'JP',
      needsHelp: 'Looking for support with investor pitch and fundraising strategy'
    },
    {
      id: 4,
      startup: 'DataVault',
      founder: 'David Kim',
      industry: 'Enterprise SaaS',
      stage: 'Series A',
      matchScore: 85,
      matchReason: 'Needs scaling advice',
      avatar: 'DK',
      needsHelp: 'Seeking guidance on team building and operational scaling'
    },
    {
      id: 5,
      startup: 'EduConnect',
      founder: 'Lisa Martinez',
      industry: 'EdTech',
      stage: 'Seed',
      matchScore: 83,
      matchReason: 'Needs growth marketing help',
      avatar: 'LM',
      needsHelp: 'Looking for expertise in B2B marketing and customer acquisition'
    }
  ];

  const myClients: Client[] = [
    {
      id: 1,
      name: 'Sarah Chen',
      startup: 'TechFlow AI',
      industry: 'AI/ML',
      stage: 'Seed',
      matchScore: 95,
      status: 'active',
      sessionsCompleted: 8,
      nextSession: 'Today, 2:00 PM',
      avatar: 'SC'
    },
    {
      id: 2,
      name: 'Marcus Williams',
      startup: 'GreenScale',
      industry: 'Climate Tech',
      stage: 'Pre-Seed',
      matchScore: 92,
      status: 'active',
      sessionsCompleted: 5,
      nextSession: 'Tomorrow, 10:00 AM',
      avatar: 'MW'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      startup: 'StartupHub',
      industry: 'B2B SaaS',
      stage: 'Seed',
      matchScore: 89,
      status: 'active',
      sessionsCompleted: 12,
      nextSession: 'Friday, 3:30 PM',
      avatar: 'ER'
    },
    {
      id: 4,
      name: 'David Park',
      startup: 'FinanceFlow',
      industry: 'FinTech',
      stage: 'Series A',
      matchScore: 87,
      status: 'active',
      sessionsCompleted: 15,
      avatar: 'DP'
    },
    {
      id: 5,
      name: 'Jennifer Lee',
      startup: 'HealthSync',
      industry: 'HealthTech',
      stage: 'Seed',
      matchScore: 84,
      status: 'pending',
      sessionsCompleted: 0,
      avatar: 'JL'
    },
    {
      id: 6,
      name: 'Michael Brown',
      startup: 'RetailTech Plus',
      industry: 'RetailTech',
      stage: 'Pre-Seed',
      matchScore: 81,
      status: 'completed',
      sessionsCompleted: 20,
      avatar: 'MB'
    }
  ];

  const filteredClients = filterStatus === 'all' 
    ? myClients 
    : myClients.filter(c => c.status === filterStatus);

  const nextStartup = () => {
    setAiCarouselIndex((prev) => (prev + 1) % aiMatchedStartups.length);
  };

  const prevStartup = () => {
    setAiCarouselIndex((prev) => (prev - 1 + aiMatchedStartups.length) % aiMatchedStartups.length);
  };

  const handleReachOut = (startup: AIMatchedStartup) => {
    // Pre-written intro message template
    const template = `Hi ${startup.founder.split(' ')[0]},\n\nI came across ${startup.startup} on NextIgnition and was impressed by your work in ${startup.industry}. With my experience in growth marketing and startup scaling, I believe I could provide valuable guidance as you navigate the ${startup.stage} stage.\n\nI'd love to schedule a quick call to discuss how I can support your journey. Let me know if you're interested!\n\nBest regards`;
    
    alert(`Pre-written message template:\n\n${template}`);
  };

  const handleScheduleMeeting = (client: Client) => {
    setSelectedClient(client);
    setIsScheduleModalOpen(true);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* AI Client Matching Widget */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#6666FF]/10 via-purple-50 to-[#F78405]/10 border-2 border-[#6666FF]/30 rounded-2xl p-6 relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#6666FF]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#F78405]/20 to-transparent rounded-full blur-3xl" />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#6666FF] to-[#F78405] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">New Startups Need Your Expertise</h2>
                <p className="text-sm text-gray-600">AI-matched based on your skills and experience</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="font-medium">{aiMatchedStartups.length} matches found</span>
            </div>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevStartup}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors -ml-5"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={nextStartup}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors -mr-5"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            {/* Startup Cards Carousel */}
            <div className="overflow-hidden px-4 md:px-0 -mx-4 md:mx-0">
              <motion.div
                className="flex gap-4"
                animate={{ x: `-${aiCarouselIndex * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {aiMatchedStartups.map((startup) => (
                  <motion.div
                    key={startup.id}
                    className="min-w-[calc(100%-2rem)] md:min-w-[calc(50%-8px)] lg:min-w-[calc(33.333%-11px)] bg-white/90 backdrop-blur border-2 border-white/50 rounded-xl p-5 shadow-md"
                  >
                    {/* Match Score Badge */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {startup.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900">{startup.startup}</h3>
                        <p className="text-sm text-gray-600 mb-2">{startup.founder}</p>
                        <div className="inline-block px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold rounded-full">
                          {startup.matchScore}% Match
                        </div>
                      </div>
                    </div>

                    {/* Match Reason */}
                    <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-purple-900 mb-1">Why you're a great match:</p>
                          <p className="text-sm text-purple-700">{startup.matchReason}</p>
                        </div>
                      </div>
                    </div>

                    {/* Startup Details */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {startup.industry}
                      </span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        {startup.stage}
                      </span>
                    </div>

                    {/* Needs Help */}
                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">{startup.needsHelp}</p>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleReachOut(startup)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-[#6666FF] to-[#F78405] text-white rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Reach Out
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {aiMatchedStartups.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setAiCarouselIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === aiCarouselIndex ? 'w-8 bg-gradient-to-r from-[#6666FF] to-[#F78405]' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* My Clients Section */}
      <div className="bg-white rounded-2xl shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-7 h-7 text-blue-600" />
                My Clients
              </h2>
              <p className="text-sm text-gray-600 mt-1">{myClients.length} total clients</p>
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === 'pending' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === 'completed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Completed
                </button>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Clients Grid */}
        <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client, idx) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              {/* Client Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {client.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{client.name}</h3>
                    <p className="text-sm text-gray-600">{client.startup}</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Client Details */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                  {client.industry}
                </span>
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                  {client.stage}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{client.sessionsCompleted}</div>
                  <div className="text-xs text-gray-600">Sessions</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900">{client.matchScore}%</div>
                  <div className="text-xs text-gray-600">Match</div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-3">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  client.status === 'active' ? 'bg-green-100 text-green-700' :
                  client.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {client.status.toUpperCase()}
                </span>
              </div>

              {/* Next Session */}
              {client.nextSession && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{client.nextSession}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
                <button 
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-bold text-white transition-opacity flex items-center justify-center gap-1"
                  style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                  onClick={() => handleScheduleMeeting(client)}
                >
                  <Video className="w-4 h-4" />
                  Schedule
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {isScheduleModalOpen && selectedClient && (
        <ScheduleMeetingModal
          client={selectedClient}
          onClose={() => setIsScheduleModalOpen(false)}
        />
      )}
    </div>
  );
}