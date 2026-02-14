import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Calendar,
  Clock,
  Video,
  Phone,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  TrendingUp,
  Target,
  Lightbulb,
  BookOpen
} from 'lucide-react';
import { useState } from 'react';
import { brandColors } from '../utils/colors';

interface Session {
  id: number;
  startup: string;
  founder: string;
  time: string;
  duration: string;
  type: 'video' | 'call' | 'chat';
  status: 'upcoming' | 'pending' | 'completed';
  avatar: string;
  topic: string;
  prepTime: number; // minutes until session
}

interface SessionPrep {
  clientBackground: string;
  previousNotes: string[];
  suggestedTopics: string[];
  relevantResources: { title: string; type: string }[];
}

export function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPrepPanel, setShowPrepPanel] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const sessions: Session[] = [
    {
      id: 1,
      startup: 'TechFlow AI',
      founder: 'Sarah Chen',
      time: 'Today, 2:00 PM',
      duration: '60 min',
      type: 'video',
      status: 'upcoming',
      avatar: 'SC',
      topic: 'Growth Marketing Strategy',
      prepTime: 45 // 45 minutes until session
    },
    {
      id: 2,
      startup: 'GreenScale',
      founder: 'Marcus Williams',
      time: 'Today, 4:30 PM',
      duration: '45 min',
      type: 'call',
      status: 'upcoming',
      avatar: 'MW',
      topic: 'Product Roadmap Planning',
      prepTime: 195
    },
    {
      id: 3,
      startup: 'StartupHub',
      founder: 'Emily Rodriguez',
      time: 'Tomorrow, 10:00 AM',
      duration: '30 min',
      type: 'video',
      status: 'upcoming',
      avatar: 'ER',
      topic: 'Team Building & Culture',
      prepTime: 1260
    }
  ];

  const sessionPrep: SessionPrep = {
    clientBackground: 'TechFlow AI is a B2B SaaS startup in the AI/ML space, currently at Seed stage with $2M raised. They have 234 paying customers and $45K MRR with 35% month-over-month growth. The team is focused on expanding their customer base and improving product-market fit.',
    previousNotes: [
      'Last session (Dec 15): Discussed customer acquisition strategies and CAC optimization. Sarah committed to testing 3 new marketing channels.',
      'Session 2 weeks ago: Reviewed product positioning and messaging. Identified need for clearer value proposition for enterprise customers.',
      'Initial consultation: Covered business model validation and go-to-market strategy. Sarah expressed interest in scaling paid advertising.'
    ],
    suggestedTopics: [
      'Review performance of new marketing channels tested',
      'Discuss enterprise sales process and team structure',
      'Explore content marketing and thought leadership strategy',
      'Address challenges with customer onboarding and activation',
      'Plan Q1 2024 marketing budget allocation'
    ],
    relevantResources: [
      { title: 'SaaS Growth Playbook 2024', type: 'PDF' },
      { title: 'Enterprise Sales Framework', type: 'Presentation' },
      { title: 'Content Marketing Templates', type: 'Document' },
      { title: 'Customer Onboarding Checklist', type: 'Checklist' }
    ]
  };

  // Show prep panel for sessions starting in < 60 minutes
  const upcomingSession = sessions.find(s => s.prepTime < 60);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* AI Session Prep Panel - Auto-appears 1 hour before session */}
      {upcomingSession && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#6666FF]/10 via-purple-50 to-[#F78405]/10 border-2 border-[#6666FF]/30 rounded-2xl p-6 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#6666FF]/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#F78405]/20 to-transparent rounded-full blur-3xl" />
          
          <div className="relative">
            {/* Notification Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#6666FF] to-[#F78405] flex items-center justify-center animate-pulse">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Ignisha Prepared Your Session Brief</h2>
                  <p className="text-sm text-gray-600">Session with {upcomingSession.founder} starts in {upcomingSession.prepTime} minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {upcomingSession.prepTime}min
                </div>
              </div>
            </div>

            {/* Quick Preview */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-white/50">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-sm text-gray-900">Client Overview</h4>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{sessionPrep.clientBackground}</p>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-white/50">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h4 className="font-bold text-sm text-gray-900">Previous Notes</h4>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{sessionPrep.previousNotes[0]}</p>
              </div>

              <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-white/50">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-orange-600" />
                  <h4 className="font-bold text-sm text-gray-900">Suggested Topics</h4>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{sessionPrep.suggestedTopics[0]}</p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                setSelectedSession(upcomingSession);
                setShowPrepPanel(true);
              }}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-[#6666FF] to-[#F78405] text-white rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
            >
              <FileText className="w-5 h-5" />
              Review Full Brief
            </button>
          </div>
        </motion.div>
      )}

      {/* Schedule Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-7 h-7 text-blue-600" />
              My Schedule
            </h2>
            <p className="text-sm text-gray-600 mt-1">{sessions.length} upcoming sessions</p>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="px-4 py-2 bg-gray-100 rounded-lg font-medium text-gray-900">
              {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {sessions.map((session, idx) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <div className="flex items-start gap-4 mb-4 md:mb-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {session.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{session.startup}</h3>
                  <p className="text-sm text-gray-600 mb-2">{session.founder} • {session.topic}</p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {session.time}
                    </span>
                    <span className="text-sm text-gray-500">{session.duration}</span>
                    {session.prepTime < 60 && (
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                        Starting soon
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {session.prepTime < 60 && (
                  <button
                    onClick={() => {
                      setSelectedSession(session);
                      setShowPrepPanel(true);
                    }}
                    className="px-4 py-2 border-2 border-[#6666FF] text-[#6666FF] rounded-lg text-sm font-bold hover:bg-[#6666FF]/5 transition-colors flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    View Prep
                  </button>
                )}
                <button 
                  className="px-5 py-2 rounded-lg text-sm font-bold text-white transition-opacity flex items-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                >
                  {session.type === 'video' ? <Video className="w-4 h-4" /> : 
                   session.type === 'call' ? <Phone className="w-4 h-4" /> : 
                   <MessageSquare className="w-4 h-4" />}
                  Join
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Session Prep Detail Modal */}
      <AnimatePresence>
        {showPrepPanel && selectedSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPrepPanel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#6666FF] to-[#F78405] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  <div>
                    <h2 className="text-xl font-bold">AI Session Brief</h2>
                    <p className="text-sm text-white/80">{selectedSession.startup} • {selectedSession.founder}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPrepPanel(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Client Background */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Client Background Summary
                  </h3>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-gray-800">{sessionPrep.clientBackground}</p>
                  </div>
                </div>

                {/* Previous Session Notes */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Previous Session Notes
                  </h3>
                  <div className="space-y-2">
                    {sessionPrep.previousNotes.map((note, idx) => (
                      <div key={idx} className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                        <p className="text-sm text-gray-800">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Talking Points */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-orange-600" />
                    Suggested Talking Points
                  </h3>
                  <div className="space-y-2">
                    {sessionPrep.suggestedTopics.map((topic, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                        <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-gray-800 flex-1">{topic}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Relevant Resources */}
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    Relevant Resources to Share
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {sessionPrep.relevantResources.map((resource, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">{resource.title}</p>
                          <p className="text-xs text-gray-600">{resource.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowPrepPanel(false)}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    className="px-6 py-2.5 rounded-lg font-bold text-white transition-opacity flex items-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                  >
                    <Video className="w-5 h-5" />
                    Join Session Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}