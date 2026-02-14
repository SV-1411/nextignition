import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Search,
  Mic,
  Settings,
  Clock,
  Info,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCw,
  Paperclip,
  Send,
  X,
  FileText,
  Target,
  Users,
  TrendingUp,
  DollarSign,
  BarChart3,
  FileSpreadsheet,
  Edit3,
  Lightbulb,
  Briefcase,
  PenTool,
  Calendar,
  MessageSquare,
  Download,
  Share2,
  Bookmark,
  Plus,
  ChevronRight,
  Upload,
  CheckCircle,
  AlertCircle,
  Menu,
  ChevronDown,
  ChevronUp,
  Pin,
  Trash2,
  Award,
  Eye,
  Heart,
  Zap
} from 'lucide-react';
import { brandColors } from '../utils/colors';

interface IgnishaAIDashboardProps {
  userRole: 'founder' | 'expert' | 'investor';
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  cardData?: any;
}

interface QuickAction {
  icon: any;
  title: string;
  description: string;
  action: string;
}

interface Conversation {
  id: number;
  title: string;
  preview: string;
  timestamp: string;
  pinned: boolean;
}

import { generateSummary } from '../services/aiService';

export function IgnishaAIDashboard({ userRole }: IgnishaAIDashboardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCofounderModal, setShowCofounderModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [responseStyle, setResponseStyle] = useState('detailed');
  const [aiPersonality, setAiPersonality] = useState('professional');
  const [showInsights, setShowInsights] = useState(true);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Role-specific quick actions
  const getQuickActions = (): QuickAction[] => {
    if (userRole === 'founder') {
      return [
        { icon: FileText, title: 'Pitch Deck Analysis', description: 'Review & improve your deck', action: 'pitch-deck' },
        { icon: Target, title: 'Business Validator', description: 'Check idea viability', action: 'validator' },
        { icon: Users, title: 'Find Co-founders', description: 'AI-powered matching', action: 'cofounder' },
        { icon: Users, title: 'Find Experts', description: 'Get mentor recommendations', action: 'experts' },
        { icon: DollarSign, title: 'Financial Projections', description: 'Build revenue models', action: 'financial' },
        { icon: BarChart3, title: 'Competitor Analysis', description: 'Market research assistant', action: 'competitor' },
        { icon: Edit3, title: 'Content Creator', description: 'Write posts, articles, emails', action: 'content' },
        { icon: FileSpreadsheet, title: 'Template Generator', description: 'Pitch decks, plans, contracts', action: 'template' },
      ];
    } else if (userRole === 'expert') {
      return [
        { icon: Users, title: 'Client Matching', description: 'Find ideal startup clients', action: 'client-match' },
        { icon: Lightbulb, title: 'Content Ideas', description: 'Generate topic ideas', action: 'content-ideas' },
        { icon: Briefcase, title: 'Session Prep', description: 'Prepare for consultations', action: 'session-prep' },
        { icon: DollarSign, title: 'Pricing Calculator', description: 'Optimize your rates', action: 'pricing' },
        { icon: FileText, title: 'Course Creator', description: 'Build course outlines', action: 'course' },
        { icon: PenTool, title: 'LinkedIn Writer', description: 'Craft engaging posts', action: 'linkedin' },
        { icon: MessageSquare, title: 'Email Templates', description: 'Client communication', action: 'email' },
        { icon: FileSpreadsheet, title: 'Resource Library', description: 'Build knowledge base', action: 'resources' },
      ];
    } else {
      return [
        { icon: BarChart3, title: 'Deal Flow Analyzer', description: 'Evaluate opportunities', action: 'deal-flow' },
        { icon: Award, title: 'Startup Scorer', description: 'AI-powered ratings', action: 'scorer' },
        { icon: TrendingUp, title: 'Market Trends', description: 'Industry insights', action: 'trends' },
        { icon: Target, title: 'Portfolio Analytics', description: 'Track investments', action: 'portfolio' },
        { icon: AlertCircle, title: 'Risk Assessment', description: 'Due diligence helper', action: 'risk' },
        { icon: CheckCircle, title: 'DD Checklist', description: 'Generate checklists', action: 'checklist' },
        { icon: FileText, title: 'Term Sheets', description: 'Template library', action: 'termsheet' },
        { icon: Users, title: 'Co-investment', description: 'Find partners', action: 'coinvest' },
      ];
    }
  };

  const quickActions = getQuickActions();

  // Role-specific suggested prompts
  const getSuggestedPrompts = () => {
    if (userRole === 'founder') {
      return [
        { icon: DollarSign, text: 'How do I price my SaaS product?' },
        { icon: Calendar, text: 'Create a 6-month fundraising timeline' },
        { icon: BarChart3, text: 'What metrics do Series A investors look for?' },
        { icon: MessageSquare, text: 'Generate a cold email to investors' },
      ];
    } else if (userRole === 'expert') {
      return [
        { icon: DollarSign, text: 'How do I price my consultation services?' },
        { icon: FileText, text: 'Create an event outline on growth hacking' },
        { icon: Users, text: 'Which startups should I target as clients?' },
        { icon: PenTool, text: 'Write a LinkedIn post about my expertise' },
      ];
    } else {
      return [
        { icon: AlertCircle, text: 'What are red flags in early-stage startups?' },
        { icon: BarChart3, text: 'Analyze this startup\'s traction data' },
        { icon: CheckCircle, text: 'Create a due diligence checklist' },
        { icon: TrendingUp, text: 'Summarize FinTech market trends in India' },
      ];
    }
  };

  const suggestedPrompts = getSuggestedPrompts();

  // Recent activities
  const recentActivities = [
    { id: 1, icon: FileText, title: 'Pitch Deck Analysis - TechFlow_v3.pdf', time: '2 hours ago', status: 'completed' },
    { id: 2, icon: Users, title: 'Co-founder Matching Session', time: '5 hours ago', status: 'completed' },
    { id: 3, icon: DollarSign, title: 'Financial Model Review', time: '1 day ago', status: 'completed' },
    { id: 4, icon: Edit3, title: 'LinkedIn Post Generation', time: '2 days ago', status: 'completed' },
    { id: 5, icon: BarChart3, title: 'Competitor Analysis Report', time: '3 days ago', status: 'completed' },
  ];

  // AI Insights
  const getAIInsights = () => {
    if (userRole === 'founder') {
      return [
        'Your pitch deck is missing a competitive analysis slide',
        '3 new co-founder matches found in your industry',
        'Trending topic: AI regulation - write about it?',
      ];
    } else if (userRole === 'expert') {
      return [
        '5 new startups match your expertise profile',
        'Create content about "fundraising strategies" - high engagement topic',
        'Your consultation rate is 20% below market average',
      ];
    } else {
      return [
        '2 portfolio companies show declining metrics',
        'New FinTech deals in your sector range',
        'Recommended: Review due diligence for StartupX',
      ];
    }
  };

  const aiInsights = getAIInsights();

  // Conversation history
  const [conversations] = useState<Conversation[]>([
    { id: 1, title: 'Pitch Deck Review - Jan 26', preview: 'Can you analyze my pitch deck and...', timestamp: 'Today', pinned: true },
    { id: 2, title: 'Co-founder Search', preview: 'Help me find a technical co-founder...', timestamp: 'Yesterday', pinned: false },
    { id: 3, title: 'Financial Projections', preview: 'Create a 5-year revenue model...', timestamp: 'Jan 24', pinned: false },
    { id: 4, title: 'Competitor Analysis', preview: 'Who are my main competitors in...', timestamp: 'Jan 23', pinned: false },
  ]);

  const handleQuickAction = (action: string) => {
    if (action === 'pitch-deck') {
      setShowUploadModal(true);
    } else if (action === 'cofounder' || action === 'client-match') {
      setShowCofounderModal(true);
    } else if (action === 'template') {
      setShowTemplateModal(true);
    } else {
      // Simulate starting a conversation
      const actionTitles: { [key: string]: string } = {
        'validator': 'Can you help me validate my startup idea?',
        'financial': 'Create a financial projection model for my SaaS startup',
        'competitor': 'Analyze my competitors in the AI customer support space',
        'content': 'Write a LinkedIn post about our latest product launch',
        'experts': 'Find mentors who can help with growth marketing',
      };

      if (actionTitles[action]) {
        handleSendMessage(actionTitles[action]);
      }
    }
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const newMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setActiveConversation(1);

    // AI response
    setIsTyping(true);
    try {
      let aiResponse = '';
      if (messageText.toLowerCase().includes('summary') || messageText.toLowerCase().includes('pitch')) {
        const data = await generateSummary(messageText);
        aiResponse = data.summary;
      } else {
        // Generic AI response for now
        aiResponse = `I'd be happy to help you with that! As your AI strategist, I've analyzed your request: "${messageText}". How would you like me to proceed with the detailed breakdown?`;
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: 'Sorry, I encountered an error processing your request. Please try again or check your API configuration.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleAnalyzeFile = () => {
    if (uploadedFile) {
      setShowUploadModal(false);
      handleSendMessage(`Analyze my pitch deck: ${uploadedFile.name}`);
      setUploadedFile(null);
    }
  };

  return (
    <div className="flex h-full bg-gray-50 overflow-hidden w-full">
      {/* Main AI Workspace - 100% Width (Platform sidebar is handled by parent dashboard) */}
      <div className="flex-1 flex flex-col overflow-hidden w-full min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between gap-4 flex-shrink-0">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Ignisha AI</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">Online</span>
              </div>
            </div>
          </div>

          {/* Center Section - Search Bar (Hidden on mobile) */}
          <div className="hidden lg:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ask Ignisha anything or search past conversations..."
                className="w-full pl-12 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                <Mic className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* AI Credits */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg group relative">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">42 queries left</span>
              <Info className="w-4 h-4 text-purple-400 cursor-help" />
              <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Upgrade to Elite for unlimited AI access
              </div>
            </div>

            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              {/* Settings Dropdown */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50"
                  >
                    <h3 className="font-bold mb-4">AI Settings</h3>

                    {/* Voice Input */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <span className="text-sm">Voice Input</span>
                      <button
                        onClick={() => setVoiceEnabled(!voiceEnabled)}
                        className={`w-12 h-6 rounded-full transition-colors ${voiceEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${voiceEnabled ? 'translate-x-6' : 'translate-x-1'}`}></div>
                      </button>
                    </div>

                    {/* Response Style */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <label className="text-sm font-medium mb-2 block">Response Style</label>
                      <div className="space-y-2">
                        {['concise', 'detailed', 'step-by-step'].map((style) => (
                          <label key={style} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="responseStyle"
                              checked={responseStyle === style}
                              onChange={() => setResponseStyle(style)}
                              className="w-4 h-4 text-blue-500"
                            />
                            <span className="text-sm capitalize">{style.replace('-', ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* AI Personality */}
                    <div className="mb-4">
                      <label className="text-sm font-medium mb-2 block">AI Personality</label>
                      <div className="space-y-2">
                        {['professional', 'casual', 'motivational'].map((personality) => (
                          <label key={personality} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="aiPersonality"
                              checked={aiPersonality === personality}
                              onChange={() => setAiPersonality(personality)}
                              className="w-4 h-4 text-blue-500"
                            />
                            <span className="text-sm capitalize">{personality}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button className="w-full py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                      Clear All History
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* History */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Clock className="w-5 h-5 text-gray-600" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileActions(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT PANEL: AI Tools & Categories (35%) - Hidden on mobile */}
          <div className="hidden lg:flex w-[35%] border-r border-gray-200 bg-white overflow-y-auto relative">
            <div className="w-full p-6">
              {/* Section 1: Quick Actions Grid */}
              <div className="mb-6">
                <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleQuickAction(action.action)}
                      whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(102, 102, 255, 0.2)' }}
                      className="p-4 border border-blue-200 rounded-xl hover:border-blue-400 transition-all text-left h-28 flex flex-col justify-between"
                    >
                      <action.icon className="w-8 h-8 mb-2" style={{ color: brandColors.electricBlue }} />
                      <div>
                        <h3 className="font-bold text-sm mb-0.5">{action.title}</h3>
                        <p className="text-xs text-gray-600 line-clamp-1">{action.description}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Section 2: Recent Activities */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Recent AI Sessions</h2>
                  <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  {recentActivities.length > 0 ? (
                    <div className="space-y-3">
                      {recentActivities.map((activity) => (
                        <button
                          key={activity.id}
                          onClick={() => handleSendMessage(`Resume: ${activity.title}`)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <activity.icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{activity.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">{activity.time}</span>
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                {activity.status}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">Start your first AI session above</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: AI Insights Widget */}
              <div>
                <button
                  onClick={() => setShowInsights(!showInsights)}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <h2 className="text-lg font-bold">💡 AI Insights for You</h2>
                  {showInsights ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <AnimatePresence>
                  {showInsights && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200"
                    >
                      <div className="space-y-3">
                        {aiInsights.map((insight, index) => (
                          <button
                            key={index}
                            onClick={() => handleSendMessage(insight)}
                            className="w-full text-left p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                          >
                            <p className="text-sm text-gray-700">{insight}</p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: AI Chat Interface (65%) */}
          <div className="flex-1 flex flex-col bg-gray-50 relative">
            {activeConversation === null ? (
              /* Welcome Screen */
              <div className="flex-1 overflow-y-auto p-6 flex items-start justify-center">
                <div className="max-w-2xl w-full text-center py-12">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Sparkles className="w-16 h-16 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-3">Hi there, how can I help you today?</h2>
                  <p className="text-gray-600 mb-8">Ask me anything about startups, funding, growth, or use quick actions</p>

                  {/* Suggested Prompts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {suggestedPrompts.map((prompt, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleSendMessage(prompt.text)}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl text-left hover:shadow-lg transition-all border border-blue-100"
                      >
                        <prompt.icon className="w-6 h-6 mb-2" style={{ color: brandColors.electricBlue }} />
                        <p className="text-sm font-medium">{prompt.text}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Active Conversation */
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 px-[24px] md:px-6 py-[16px] flex items-center justify-between flex-shrink-0 gap-2 overflow-x-hidden m-[0px]">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <input
                      type="text"
                      defaultValue="Pitch Deck Review - Jan 26"
                      className="font-bold text-sm md:text-lg bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 flex-1 min-w-0 truncate"
                    />
                    <button className="p-1 hover:bg-gray-100 rounded flex-shrink-0">
                      <Edit3 className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                    <button className="hidden md:block p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Save Session">
                      <Bookmark className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="hidden md:block p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Export Chat">
                      <Download className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="hidden md:block p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Share">
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => {
                        setMessages([]);
                        setActiveConversation(null);
                      }}
                      className="px-2 md:px-3 py-2 bg-blue-500 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-1 md:gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">New Chat</span>
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 md:py-6 pb-[160px] lg:pb-6 space-y-4 relative overflow-x-hidden w-full max-w-full pt-[16px] pr-[24px] pl-[24px]">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} w-full min-w-0 max-w-full`}
                    >
                      {message.type === 'ai' && (
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mr-2 md:mr-3">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className={`min-w-0 flex-1 ${message.type === 'user' ? 'max-w-[85%] md:max-w-[75%]' : 'max-w-[85%] md:max-w-[75%]'}`}>
                        <div
                          className={`px-3 md:px-4 py-3 rounded-2xl break-words overflow-hidden max-w-full ${message.type === 'user'
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-900'
                            }`}
                          style={message.type === 'user' ? {
                            background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})`,
                            borderRadius: '16px 16px 4px 16px',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                            wordWrap: 'break-word',
                            maxWidth: '100%'
                          } : {
                            borderRadius: '16px 16px 16px 4px',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                            wordWrap: 'break-word',
                            maxWidth: '100%'
                          }}
                        >
                          <p className="text-sm leading-relaxed break-words overflow-hidden max-w-full" style={{ overflowWrap: 'break-word', wordBreak: 'break-word', maxWidth: '100%' }}>{message.content}</p>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2 mt-1 px-2 max-w-full overflow-hidden">
                          <span className="text-xs text-gray-500 truncate">{message.timestamp}</span>
                          {message.type === 'ai' && (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Thumbs up">
                                <ThumbsUp className="w-3 h-3 text-gray-400 hover:text-blue-500" />
                              </button>
                              <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Thumbs down">
                                <ThumbsDown className="w-3 h-3 text-gray-400 hover:text-red-500" />
                              </button>
                              <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Copy">
                                <Copy className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                              </button>
                              <button className="p-1 hover:bg-gray-200 rounded transition-colors" title="Regenerate">
                                <RotateCw className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start w-full min-w-0 max-w-full">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mr-2 md:mr-3">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-100 px-3 md:px-4 py-3 rounded-2xl min-w-0 max-w-[85%] md:max-w-[75%]" style={{ borderRadius: '16px 16px 16px 4px' }}>
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-sm text-gray-600">Ignisha is thinking</span>
                          <div className="flex gap-1 flex-shrink-0">
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            />
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            />
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Smart Suggestions (if applicable) */}
                {messages.length > 0 && messages[messages.length - 1].type === 'ai' && (
                  <div className="px-6 py-2 bg-white border-t border-gray-100">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      <button
                        onClick={() => handleSendMessage('Tell me more')}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
                      >
                        Tell me more
                      </button>
                      <button
                        onClick={() => handleSendMessage('Show examples')}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
                      >
                        Show examples
                      </button>
                      <button
                        onClick={() => handleSendMessage('Create a plan')}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
                      >
                        Create a plan
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Chat Input Area (Fixed Bottom) */}
            <div className="bg-white border-t border-gray-200 flex-shrink-0 px-[16px] py-[24px] lg:pb-[24px] pt-[24px] pr-[16px] pb-[36px] pl-[16px] fixed bottom-16 left-0 right-0 lg:static z-40">
              <div className="relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask Ignisha or describe what you need help with..."
                  className="w-full pl-4 pr-24 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.ppt,.pptx,.xlsx,.csv,image/*"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Attach file"
                  >
                    <Paperclip className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Voice input"
                  >
                    <Mic className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim()}
                    className="p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: inputValue.trim() ? `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` : '#E5E7EB'
                    }}
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation History Sidebar (Slide-in from right) */}
      <AnimatePresence>
        {showHistory && (
          <>
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowHistory(false)}
            />
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold">Conversation History</h2>
                <button onClick={() => setShowHistory(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <input
                  type="text"
                  placeholder="Search past conversations..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                    onClick={() => {
                      setActiveConversation(conv.id);
                      setShowHistory(false);
                    }}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-medium text-sm flex-1">{conv.title}</h4>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Pin className="w-3 h-3 text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Trash2 className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-1">{conv.preview}</p>
                    <span className="text-xs text-gray-400">{conv.timestamp}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowUploadModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Upload Your Pitch Deck</h2>
                <button onClick={() => setShowUploadModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors mb-4"
              >
                <Upload className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <p className="text-sm font-medium mb-1">Drag & drop your file or browse</p>
                <p className="text-xs text-gray-500">PDF, PPT, PPTX (max 25MB)</p>
              </div>

              {uploadedFile && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button onClick={() => setUploadedFile(null)}>
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              )}

              <div className="space-y-2 mb-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Analyze structure & flow</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Check for missing slides</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Suggest improvements</span>
                </label>
              </div>

              <button
                onClick={handleAnalyzeFile}
                disabled={!uploadedFile}
                className="w-full py-3 rounded-lg font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
              >
                Analyze Now
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Co-founder/Client Matching Modal */}
      <AnimatePresence>
        {showCofounderModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCofounderModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {userRole === 'founder' ? 'Find Your Perfect Co-founder' : 'Find Ideal Clients'}
                </h2>
                <button onClick={() => setShowCofounderModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {userRole === 'founder' ? 'Skills Needed' : 'Industry Focus'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Technical', 'Marketing', 'Sales', 'Finance', 'Design', 'Operations'].map((skill) => (
                      <button
                        key={skill}
                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location Preference</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>India</option>
                    <option>United States</option>
                    <option>Remote</option>
                    <option>Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {userRole === 'founder' ? 'Commitment Level' : 'Client Stage'}
                  </label>
                  <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Flexible'].map((level) => (
                      <label key={level} className="flex items-center gap-2">
                        <input type="radio" name="commitment" className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowCofounderModal(false);
                    handleSendMessage('Find matches based on my criteria');
                  }}
                  className="w-full py-3 rounded-lg font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                >
                  Find Matches
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Template Library Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowTemplateModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Choose a Template</h2>
                <button onClick={() => setShowTemplateModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <input
                type="text"
                placeholder="Search templates..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
              />

              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'Investor Pitch Deck', type: 'Pitch Deck', tier: 'Free' },
                  { name: 'Business Plan Template', type: 'Business Plan', tier: 'Pro' },
                  { name: 'Financial Model', type: 'Financial', tier: 'Pro' },
                  { name: 'Term Sheet', type: 'Legal', tier: 'Elite' },
                  { name: 'Cold Email to Investors', type: 'Email', tier: 'Free' },
                  { name: 'One-Pager', type: 'Marketing', tier: 'Free' },
                ].map((template, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -4 }}
                    className="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-300 hover:shadow-lg transition-all"
                    onClick={() => {
                      setShowTemplateModal(false);
                      handleSendMessage(`Generate ${template.name} for my startup`);
                    }}
                  >
                    <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-3 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-blue-500" />
                    </div>
                    <h3 className="font-bold text-sm mb-1">{template.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{template.type}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${template.tier === 'Free' ? 'bg-green-100 text-green-700' :
                      template.tier === 'Pro' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                      {template.tier}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Quick Actions Bottom Sheet */}
      <AnimatePresence>
        {showMobileActions && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setShowMobileActions(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 lg:hidden max-h-[80vh] overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold">AI Tools</h2>
                <button onClick={() => setShowMobileActions(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleQuickAction(action.action);
                      setShowMobileActions(false);
                    }}
                    className="p-4 border border-blue-200 rounded-xl hover:border-blue-400 transition-all text-left h-28 flex flex-col justify-between"
                  >
                    <action.icon className="w-8 h-8 mb-2" style={{ color: brandColors.electricBlue }} />
                    <div>
                      <h3 className="font-bold text-sm mb-0.5">{action.title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-1">{action.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}