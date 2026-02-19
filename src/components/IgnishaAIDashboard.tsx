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
import { analyzePitchDeck, aiChat, runQuickAction, matchCofounders, matchExperts, matchClients, fetchDeckInsights } from '../services/aiService';

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

type AnalysisResult = {
  summary?: string;
  executiveSummary?: string;
  highlights?: string[] | string;
  keyHighlights?: string[] | string;
  insights?: string[] | string;
  strengths?: string[] | string;
  gaps?: string[] | string;
  investorReadinessScore?: number | string;
  [key: string]: any;
};

type ScoreMetric = {
  label: string;
  score: number;
  note: string;
};

const normalizeList = (raw: unknown): string[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean);
  }
  if (typeof raw === 'string') {
    return raw
      .split('\n')
      .map((line) => line.replace(/^[-•\s]+/, '').trim())
      .filter(Boolean);
  }
  return [];
};

const hasAnyKeyword = (text: string, keywords: string[]) => keywords.some((keyword) => text.includes(keyword));

const clampScore = (score: number) => Math.max(0, Math.min(10, Math.round(score * 10) / 10));

const computePitchDeckScoreMetrics = (analysis: AnalysisResult): ScoreMetric[] => {
  const summaryText = analysis.summary || analysis.executiveSummary || '';
  const highlights = normalizeList(analysis.highlights || analysis.keyHighlights || analysis.insights);
  const strengths = normalizeList(analysis.strengths);
  const gaps = normalizeList(analysis.gaps);

  const fullText = [summaryText, ...highlights, ...strengths, ...gaps].join(' ').toLowerCase();
  const readinessRaw = Number(analysis.investorReadinessScore);
  const hasReadiness = Number.isFinite(readinessRaw);

  const problemScore = clampScore(
    (hasAnyKeyword(fullText, ['problem']) ? 2 : 0) +
    (hasAnyKeyword(fullText, ['solution']) ? 2 : 0) +
    Math.min(3, highlights.length) +
    (summaryText.length > 120 ? 3 : summaryText.length > 60 ? 2 : 1)
  );

  const marketScore = clampScore(
    (hasAnyKeyword(fullText, ['market', 'tam', 'sam', 'som', 'positioning']) ? 4 : 1) +
    (hasAnyKeyword(fullText, ['growth', 'opportunity', 'segment']) ? 2 : 0) +
    (highlights.length >= 3 ? 2 : highlights.length >= 1 ? 1 : 0) +
    (gaps.length >= 3 && hasAnyKeyword(fullText, ['market validation']) ? 1 : 2)
  );

  const businessModelScore = clampScore(
    (hasAnyKeyword(fullText, ['revenue', 'subscription', 'monetization', 'pricing']) ? 5 : 1.5) +
    (hasAnyKeyword(fullText, ['gtm', 'go-to-market', 'customer']) ? 2 : 0) +
    Math.min(2, strengths.length * 0.8) +
    (hasAnyKeyword(fullText, ['unit economics', 'ltv', 'cac']) ? 1 : 0.5)
  );

  const teamScore = clampScore(
    (hasAnyKeyword(fullText, ['team', 'founder', 'advisor', 'hiring']) ? 5 : 2) +
    Math.min(3, strengths.length) +
    (hasAnyKeyword(fullText, ['experience', 'credibility']) ? 2 : 0)
  );

  const overallScore = clampScore(
    hasReadiness
      ? readinessRaw / 10
      : (problemScore + marketScore + businessModelScore + teamScore) / 4 - Math.min(1.5, gaps.length * 0.25)
  );

  return [
    { label: 'Problem & Solution', score: problemScore, note: 'Clarity of pain point and solution fit' },
    { label: 'Market Opportunity', score: marketScore, note: 'Market size, demand, and positioning signals' },
    { label: 'Business Model', score: businessModelScore, note: 'Monetization and go-to-market strength' },
    { label: 'Team Readiness', score: teamScore, note: 'Founder credibility and execution confidence' },
    { label: 'Overall Deck Score', score: overallScore, note: 'Investor readiness snapshot from AI output' },
  ];
};

const useMockData = (import.meta.env.VITE_USE_MOCK_AI ?? 'true') === 'true';
const useMockChat = (import.meta.env.VITE_USE_MOCK_AI_CHAT ?? 'false') === 'true';

const mockPitchDeckAnalysis: AnalysisResult = {
  executiveSummary: 'AI-powered mental wellness app addressing anxiety with CBT exercises and a subscription model.',
  highlights: ['Clear problem-solution fit', 'Large market opportunity', 'Recurring revenue model'],
  strengths: ['Strong user pain point', 'Scalable distribution', 'Clear monetization'],
  gaps: ['Go-to-market details', 'Traction metrics', 'Differentiation proof'],
  investorReadinessScore: 46,
};

const mockCofounders = [
  {
    name: 'Aarav Mehta',
    role: 'CTO / Full-stack',
    location: 'Bengaluru',
    matchScore: 9.1,
    skills: ['React', 'Node.js', 'GenAI'],
    reason: 'Built 2 SaaS products and shipped AI copilots in production.',
  },
  {
    name: 'Neha Kapoor',
    role: 'Growth & GTM',
    location: 'Mumbai',
    matchScore: 8.6,
    skills: ['B2B SaaS', 'Growth loops', 'Pricing'],
    reason: 'Scaled ARR from $0 to $1.2M in 14 months at a startup.',
  },
  {
    name: 'Karan Iyer',
    role: 'Product / UX',
    location: 'Remote',
    matchScore: 8.3,
    skills: ['Product strategy', 'User research', 'Design systems'],
    reason: 'Deep product validation experience with early-stage teams.',
  },
];

const mockExperts = [
  {
    name: 'Dr. Riya Shah',
    specialty: 'Fundraising Strategy',
    rating: 4.8,
    location: 'Delhi NCR',
    highlights: ['Former VC associate', '50+ pitch deck reviews'],
  },
  {
    name: 'Vikram Rao',
    specialty: 'Growth Marketing',
    rating: 4.7,
    location: 'Bengaluru',
    highlights: ['Paid acquisition expert', 'Scaled 10M+ users'],
  },
  {
    name: 'Sara Lobo',
    specialty: 'Product & GTM',
    rating: 4.9,
    location: 'Remote',
    highlights: ['Ex-Stripe PM', 'B2B SaaS GTM'],
  },
];

const mockClients = [
  {
    name: 'NovaHealth',
    stage: 'Seed',
    location: 'Hyderabad',
    budget: '$4k/mo',
    need: 'Growth strategy and onboarding optimization',
  },
  {
    name: 'FinOrbit',
    stage: 'Pre-seed',
    location: 'Remote',
    budget: '$2k/mo',
    need: 'Product positioning and GTM roadmap',
  },
  {
    name: 'SupplySync',
    stage: 'Seed',
    location: 'Pune',
    budget: '$3k/mo',
    need: 'Sales playbook and funnel optimization',
  },
];

const mockValidator = {
  score: 7.8,
  verdict: 'Promising with clear differentiation',
  strengths: ['Clear pain point', 'Large market tailwinds', 'Subscription-friendly model'],
  risks: ['Go-to-market specifics are thin', 'Early differentiation not fully proven'],
  nextSteps: ['Run 10 founder interviews', 'Validate pricing with 5 buyers', 'Ship a 2-week MVP'],
};

const mockFinancials = {
  assumptions: ['$49 avg monthly subscription', '3% monthly churn', '7% MoM user growth'],
  projections: [
    { year: 'Year 1', revenue: '$120k', expenses: '$280k', runway: '12 months' },
    { year: 'Year 2', revenue: '$520k', expenses: '$640k', runway: '8 months' },
    { year: 'Year 3', revenue: '$1.8M', expenses: '$1.4M', runway: '18 months' },
  ],
};

const mockCompetitors = [
  { name: 'MindEase', focus: 'Meditation + CBT', edge: 'Strong brand, weaker B2B offering' },
  { name: 'CalmWorks', focus: 'Enterprise wellness', edge: 'Great distribution, average personalization' },
  { name: 'CBTNow', focus: 'Self-serve CBT', edge: 'Solid content, minimal AI tailoring' },
];

const mockContentDraft = {
  title: 'How founders can design mental wellness into remote-first teams',
  hook: 'Burnout is a revenue leak. Here is how to fix it without bloated programs.',
  outline: [
    'Define the cost of burnout with one metric',
    'Embed micro-wellness rituals into product and culture',
    'Measure outcomes with a simple weekly pulse',
  ],
  cta: 'Want the checklist? I can share a plug-and-play template.',
};

const mockTemplatePack = [
  { name: 'Investor Pitch Deck', type: 'Pitch Deck', tier: 'Free' },
  { name: 'Business Plan Lite', type: 'Business Plan', tier: 'Free' },
  { name: 'Financial Model Starter', type: 'Financial', tier: 'Pro' },
  { name: 'Fundraising Email Sequence', type: 'Email', tier: 'Free' },
];

const createMockActionResponse = (action: string) => {
  switch (action) {
    case 'validator':
      return { type: 'businessValidator', data: mockValidator, summary: mockValidator.verdict };
    case 'financial':
      return { type: 'financialProjection', data: mockFinancials, summary: 'Starter projections ready.' };
    case 'competitor':
      return { type: 'competitorAnalysis', data: { competitors: mockCompetitors }, summary: 'Competitor map ready.' };
    case 'content':
      return { type: 'contentDraft', data: mockContentDraft, summary: mockContentDraft.title };
    case 'template':
      return { type: 'templatePack', data: { templates: mockTemplatePack }, summary: 'Template pack generated.' };
    default:
      return { type: 'generic', data: {}, summary: 'Action completed.' };
  }
};

const createMockDeckInsights = () => ({
  summary: 'Generated insights from your pitch deck.',
  cards: [
    { type: 'businessValidator', data: mockValidator },
    { type: 'financialProjection', data: mockFinancials },
    { type: 'competitorAnalysis', data: { competitors: mockCompetitors } },
    { type: 'contentDraft', data: mockContentDraft },
    { type: 'templatePack', data: { templates: mockTemplatePack } },
  ],
});

const createMockChatResponse = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes('validate') || lower.includes('viability')) return 'Your idea looks promising. Focus on validating pricing and GTM.';
  if (lower.includes('financial')) return 'I can draft projections once we lock your pricing and churn assumptions.';
  if (lower.includes('competitor')) return 'I can map competitors across product, pricing, and distribution.';
  if (lower.includes('content')) return 'Here is a post angle: customer pain to ROI, then a CTA for a demo.';
  return 'I can help with strategy, fundraising, and execution. Ask me anything.';
};

const getActionPrompt = (action: string) => {
  const map: Record<string, string> = {
    validator: 'Can you validate my startup idea?',
    financial: 'Build a financial projection model for my startup.',
    competitor: 'Analyze competitors in my space.',
    content: 'Draft a founder LinkedIn post for my product update.',
    template: 'Generate a startup template pack for me.',
  };
  return map[action] || 'Run the selected AI action.';
};

const getActionSummary = (type: string, data: any) => {
  if (type === 'businessValidator') return data?.verdict || 'Here is your business validator summary.';
  if (type === 'financialProjection') return 'Here is a financial projection based on your profile.';
  if (type === 'competitorAnalysis') return 'Competitor analysis ready.';
  if (type === 'contentDraft') return data?.title || 'Content draft ready.';
  if (type === 'templatePack') return 'Template pack generated.';
  return 'AI output ready.';
};

export function IgnishaAIDashboard({ userRole }: IgnishaAIDashboardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCofounderModal, setShowCofounderModal] = useState(false);
  const [matchMode, setMatchMode] = useState<'cofounder' | 'experts' | 'client'>('cofounder');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [responseStyle, setResponseStyle] = useState('detailed');
  const [aiPersonality, setAiPersonality] = useState('professional');
  const [showInsights, setShowInsights] = useState(true);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [savedConversations, setSavedConversations] = useState<number[]>([]);
  const [showShareToast, setShowShareToast] = useState(false);
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

  const handleQuickAction = async (action: string) => {
    if (action === 'pitch-deck') {
      setShowUploadModal(true);
      return;
    } else if (action === 'cofounder' || action === 'client-match') {
      setMatchMode(action === 'client-match' ? 'client' : 'cofounder');
      setShowCofounderModal(true);
      return;
    } else if (action === 'experts') {
      setMatchMode('experts');
      setShowCofounderModal(true);
      return;
    } else {
      const userMessage: Message = {
        id: Date.now(),
        type: 'user',
        content: getActionPrompt(action),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setActiveConversation(1);
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      try {
        const response = useMockData ? createMockActionResponse(action) : await runQuickAction(action);
        const aiMessage: Message = {
          id: Date.now() + 1,
          type: 'ai',
          content: useMockData ? response.summary : getActionSummary(response?.type, response?.data),
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          cardData: response?.data ? { type: response.type, ...response.data } : undefined,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error: any) {
        const aiMessage: Message = {
          id: Date.now() + 2,
          type: 'ai',
          content: error?.response?.data?.message || 'Unable to run this AI action right now.',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } finally {
        setIsTyping(false);
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
      // Build conversation history from previous messages
      const conversationHistory = messages.map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content
      }));

      // Call backend AI with OpenRouter
      const data = useMockChat ? { response: createMockChatResponse(messageText) } : await aiChat(messageText, conversationHistory);
      const aiResponse = data.response || data.summary;
      if (!aiResponse || !String(aiResponse).trim()) {
        throw new Error('AI provider returned an empty response.');
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: error?.response?.data?.message || error?.message || 'Sorry, I encountered an error processing your request.',
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
    if (!uploadedFile) return;

    const fileToAnalyze = uploadedFile;
    setShowUploadModal(false);
    setActiveConversation(1);

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: `Analyze my pitch deck: ${fileToAnalyze.name}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const analysisRequest = useMockData ? Promise.resolve(mockPitchDeckAnalysis) : analyzePitchDeck(fileToAnalyze);

    analysisRequest
      .then((data) => {
        const analysis = (data || {}) as AnalysisResult;
        const summaryText = analysis.summary || analysis.executiveSummary || 'Analysis completed.';
        const highlights = normalizeList(analysis.highlights || analysis.keyHighlights || analysis.insights);
        const strengths = normalizeList(analysis.strengths);
        const gaps = normalizeList(analysis.gaps);
        const scoreMetrics = computePitchDeckScoreMetrics(analysis);

        const aiMessage: Message = {
          id: Date.now() + 1,
          type: 'ai',
          content: summaryText,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          cardData: {
            type: 'pitchDeckAnalysis',
            summaryText,
            highlights,
            strengths,
            gaps,
            scoreMetrics,
          },
        };

        setMessages((prev) => [...prev, aiMessage]);
      })
      .catch((error: any) => {
        const aiErrorMessage: Message = {
          id: Date.now() + 2,
          type: 'ai',
          content: error?.response?.data?.message || 'Unable to analyze this pitch deck right now.',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiErrorMessage]);
      })
      .finally(() => {
        setIsTyping(false);
        setUploadedFile(null);
      });
  };

  const handleMatchResults = () => {
    const userPrompt =
      matchMode === 'experts'
        ? 'Find experts for my startup.'
        : matchMode === 'client'
          ? 'Find client matches based on my criteria.'
          : 'Find co-founder matches based on my criteria.';

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: userPrompt,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setActiveConversation(1);
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setShowCofounderModal(false);

    const request = matchMode === 'experts'
      ? matchExperts({})
      : matchMode === 'client'
        ? matchClients({})
        : matchCofounders({});

    const mockResponse = matchMode === 'experts'
      ? { type: 'expertMatches', matches: mockExperts, summary: 'Here are expert matches based on your criteria.' }
      : matchMode === 'client'
        ? { type: 'clientMatches', matches: mockClients, summary: 'Here are client opportunities aligned to your profile.' }
        : { type: 'cofounderMatches', matches: mockCofounders, summary: 'Found co-founder matches based on your profile.' };

    const finalRequest = useMockData ? Promise.resolve(mockResponse) : request;

    finalRequest
      .then((response) => {
        const aiMessage: Message = {
          id: Date.now() + 1,
          type: 'ai',
          content: response?.summary || 'Here are your matches.',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          cardData: response ? { type: response.type, matches: response.matches } : undefined,
        };
        setMessages((prev) => [...prev, aiMessage]);
      })
      .catch((error: any) => {
        const aiMessage: Message = {
          id: Date.now() + 2,
          type: 'ai',
          content: error?.response?.data?.message || 'Unable to fetch matches right now.',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  const handleUseDeckInsights = () => {
    setIsTyping(true);
    const deckRequest = useMockData ? Promise.resolve(createMockDeckInsights()) : fetchDeckInsights();
    deckRequest
      .then((response) => {
        const aiMessage: Message = {
          id: Date.now(),
          type: 'ai',
          content: response?.summary || 'Generated insights from your pitch deck.',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          cardData: response ? { type: 'deckInsights', cards: response.cards } : undefined,
        };
        setMessages((prev) => [...prev, aiMessage]);
      })
      .catch((error: any) => {
        const aiMessage: Message = {
          id: Date.now() + 1,
          type: 'ai',
          content: error?.response?.data?.message || 'Unable to derive deck insights right now.',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMessage]);
      })
      .finally(() => {
        setIsTyping(false);
      });
  };

  const handleSaveSession = () => {
    if (activeConversation) {
      setSavedConversations(prev => 
        prev.includes(activeConversation) ? prev : [...prev, activeConversation]
      );
    }
  };

  const handleExportChat = () => {
    const chatText = messages.map(m => `${m.type === 'user' ? 'You' : 'Ignisha'} (${m.timestamp}): ${m.content}`).join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ignisha-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareChat = async () => {
    const chatSummary = messages.slice(0, 3).map(m => m.content.substring(0, 50)).join(' | ');
    const shareText = `Check out my conversation with Ignisha AI:\n${chatSummary}...\n\nvia NextIgnition`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Ignisha AI Chat', text: shareText });
      } catch {
        // User cancelled or failed
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
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
                    <button 
                      onClick={handleSaveSession}
                      className={`hidden md:block p-2 hover:bg-gray-100 rounded-lg transition-colors ${savedConversations.includes(activeConversation || 0) ? 'text-purple-600' : ''}`} 
                      title="Save Session"
                    >
                      <Bookmark className={`w-5 h-5 ${savedConversations.includes(activeConversation || 0) ? 'fill-purple-600' : 'text-gray-600'}`} />
                    </button>
                    <button 
                      onClick={handleExportChat}
                      className="hidden md:block p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                      title="Export Chat"
                    >
                      <Download className="w-5 h-5 text-gray-600" />
                    </button>
                    <button 
                      onClick={handleShareChat}
                      className="hidden md:block p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                      title="Share"
                    >
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

                          {message.type === 'ai' && message.cardData?.type === 'pitchDeckAnalysis' && (
                            <div className="mt-4 space-y-4">
                              <div className="flex items-center justify-end">
                                <button
                                  onClick={handleUseDeckInsights}
                                  className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:bg-gray-50"
                                  style={{ color: brandColors.navyBlue }}
                                >
                                  Use deck insights
                                </button>
                              </div>
                              {Array.isArray(message.cardData?.scoreMetrics) && message.cardData.scoreMetrics.length > 0 && (
                                <div className="rounded-xl border border-gray-200 bg-white p-3">
                                  <h4 className="text-sm font-bold mb-3">Pitch Deck Score Metrics</h4>
                                  <div className="space-y-2">
                                    {message.cardData.scoreMetrics.map((metric: ScoreMetric) => (
                                      <div key={metric.label} className="rounded-lg border border-gray-200 bg-gray-50 p-2.5">
                                        <div className="flex items-center justify-between gap-2">
                                          <p className="text-xs font-semibold text-gray-900">{metric.label}</p>
                                          <p className="text-xs font-bold" style={{ color: brandColors.navyBlue }}>
                                            {metric.score.toFixed(1)}/10
                                          </p>
                                        </div>
                                        <div className="mt-1.5 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                                          <div
                                            className="h-full rounded-full"
                                            style={{ width: `${Math.min(100, metric.score * 10)}%`, backgroundColor: brandColors.navyBlue }}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {Array.isArray(message.cardData?.highlights) && message.cardData.highlights.length > 0 && (
                                <div className="rounded-xl border border-gray-200 bg-white p-3">
                                  <h4 className="text-sm font-bold mb-2">Key Highlights</h4>
                                  <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
                                    {message.cardData.highlights.map((item: string, index: number) => (
                                      <li key={`${item}-${index}`}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {Array.isArray(message.cardData?.strengths) && message.cardData.strengths.length > 0 && (
                                <div className="rounded-xl border border-gray-200 bg-white p-3">
                                  <h4 className="text-sm font-bold mb-2">Strengths</h4>
                                  <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
                                    {message.cardData.strengths.map((item: string, index: number) => (
                                      <li key={`${item}-${index}`}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {Array.isArray(message.cardData?.gaps) && message.cardData.gaps.length > 0 && (
                                <div className="rounded-xl border border-gray-200 bg-white p-3">
                                  <h4 className="text-sm font-bold mb-2">Gaps</h4>
                                  <ul className="list-disc pl-5 space-y-1 text-xs text-gray-700">
                                    {message.cardData.gaps.map((item: string, index: number) => (
                                      <li key={`${item}-${index}`}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          {message.type === 'ai' && message.cardData?.type === 'businessValidator' && (
                            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3 space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold">Business Validator</h4>
                                <span className="text-xs font-bold" style={{ color: brandColors.navyBlue }}>
                                  {message.cardData.score}/10
                                </span>
                              </div>
                              <p className="text-xs text-gray-700">{message.cardData.verdict}</p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                                <div>
                                  <p className="font-semibold text-gray-900 mb-1">Strengths</p>
                                  <ul className="list-disc pl-4 text-gray-700 space-y-1">
                                    {message.cardData.strengths?.map((item: string, index: number) => (
                                      <li key={`${item}-${index}`}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 mb-1">Risks</p>
                                  <ul className="list-disc pl-4 text-gray-700 space-y-1">
                                    {message.cardData.risks?.map((item: string, index: number) => (
                                      <li key={`${item}-${index}`}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 mb-1">Next Steps</p>
                                  <ul className="list-disc pl-4 text-gray-700 space-y-1">
                                    {message.cardData.nextSteps?.map((item: string, index: number) => (
                                      <li key={`${item}-${index}`}>{item}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}

                          {message.type === 'ai' && message.cardData?.type === 'cofounderMatches' && (
                            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3">
                              <h4 className="text-sm font-bold mb-3">Co-founder Matches</h4>
                              <div className="space-y-2">
                                {message.cardData.matches?.map((match: any) => (
                                  <div key={match.name} className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="text-xs font-semibold text-gray-900">{match.name}</p>
                                        <p className="text-xs text-gray-600">{match.role} · {match.location}</p>
                                      </div>
                                      <span className="text-xs font-bold" style={{ color: brandColors.navyBlue }}>{match.matchScore}/10</span>
                                    </div>
                                    <p className="text-xs text-gray-700 mt-2">{match.reason}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {match.skills?.map((skill: string) => (
                                        <span key={skill} className="px-2 py-0.5 bg-white border border-gray-200 rounded-full text-[10px] text-gray-700">{skill}</span>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {message.type === 'ai' && message.cardData?.type === 'expertMatches' && (
                            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3">
                              <h4 className="text-sm font-bold mb-3">Expert Matches</h4>
                              <div className="space-y-2">
                                {message.cardData.matches?.map((match: any) => (
                                  <div key={match.name} className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="text-xs font-semibold text-gray-900">{match.name}</p>
                                        <p className="text-xs text-gray-600">{match.specialty} · {match.location}</p>
                                      </div>
                                      <span className="text-xs font-bold" style={{ color: brandColors.navyBlue }}>{match.rating}/5</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {match.highlights?.map((item: string) => (
                                        <span key={item} className="px-2 py-0.5 bg-white border border-gray-200 rounded-full text-[10px] text-gray-700">{item}</span>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {message.type === 'ai' && message.cardData?.type === 'clientMatches' && (
                            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3">
                              <h4 className="text-sm font-bold mb-3">Client Matches</h4>
                              <div className="space-y-2">
                                {message.cardData.matches?.map((match: any) => (
                                  <div key={match.name} className="rounded-lg border border-gray-200 p-3 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="text-xs font-semibold text-gray-900">{match.name}</p>
                                        <p className="text-xs text-gray-600">{match.stage} · {match.location}</p>
                                      </div>
                                      <span className="text-xs font-bold" style={{ color: brandColors.navyBlue }}>{match.budget}</span>
                                    </div>
                                    <p className="text-xs text-gray-700 mt-2">Need: {match.need}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {message.type === 'ai' && message.cardData?.type === 'financialProjection' && (
                            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3 space-y-3">
                              <h4 className="text-sm font-bold">Financial Projection</h4>
                              <div className="text-xs text-gray-700">
                                <p className="font-semibold mb-1">Assumptions</p>
                                <ul className="list-disc pl-4 space-y-1">
                                  {message.cardData.assumptions?.map((item: string, index: number) => (
                                    <li key={`${item}-${index}`}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                  <thead>
                                    <tr className="text-gray-500">
                                      <th className="py-1">Year</th>
                                      <th className="py-1">Revenue</th>
                                      <th className="py-1">Expenses</th>
                                      <th className="py-1">Runway</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {message.cardData.projections?.map((row: any) => (
                                      <tr key={row.year} className="text-gray-700 border-t border-gray-100">
                                        <td className="py-1">{row.year}</td>
                                        <td className="py-1">{row.revenue}</td>
                                        <td className="py-1">{row.expenses}</td>
                                        <td className="py-1">{row.runway}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {message.type === 'ai' && message.cardData?.type === 'competitorAnalysis' && (
                            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3 space-y-2">
                              <h4 className="text-sm font-bold">Competitor Analysis</h4>
                              <div className="space-y-2">
                                {message.cardData.competitors?.map((competitor: any) => (
                                  <div key={competitor.name} className="rounded-lg border border-gray-200 bg-gray-50 p-2">
                                    <p className="text-xs font-semibold text-gray-900">{competitor.name}</p>
                                    <p className="text-[11px] text-gray-600">Focus: {competitor.focus}</p>
                                    <p className="text-[11px] text-gray-700">Edge: {competitor.edge}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {message.type === 'ai' && message.cardData?.type === 'contentDraft' && (
                            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3 space-y-2">
                              <h4 className="text-sm font-bold">Content Draft</h4>
                              <p className="text-xs font-semibold text-gray-900">{message.cardData.title}</p>
                              <p className="text-xs text-gray-700">{message.cardData.hook}</p>
                              <ul className="list-disc pl-4 text-xs text-gray-700 space-y-1">
                                {message.cardData.outline?.map((item: string, index: number) => (
                                  <li key={`${item}-${index}`}>{item}</li>
                                ))}
                              </ul>
                              <p className="text-xs text-gray-600">CTA: {message.cardData.cta}</p>
                            </div>
                          )}

                          {message.type === 'ai' && message.cardData?.type === 'templatePack' && (
                            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3 space-y-2">
                              <h4 className="text-sm font-bold">Template Pack</h4>
                              <div className="space-y-2">
                                {message.cardData.templates?.map((template: any) => (
                                  <div key={template.name} className="rounded-lg border border-gray-200 bg-gray-50 p-2 flex items-center justify-between">
                                    <div>
                                      <p className="text-xs font-semibold text-gray-900">{template.name}</p>
                                      <p className="text-[11px] text-gray-600">{template.type}</p>
                                    </div>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-700">{template.tier}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {message.type === 'ai' && message.cardData?.type === 'deckInsights' && (
                            <div className="mt-4 space-y-4">
                              {message.cardData.cards?.map((card: any, index: number) => (
                                <div key={`${card.type}-${index}`}>
                                  {card.type === 'businessValidator' && (
                                    <div className="rounded-xl border border-gray-200 bg-white p-3 space-y-3">
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-bold">Business Validator</h4>
                                        <span className="text-xs font-bold" style={{ color: brandColors.navyBlue }}>
                                          {card.data?.score}/10
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-700">{card.data?.verdict}</p>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                                        <div>
                                          <p className="font-semibold text-gray-900 mb-1">Strengths</p>
                                          <ul className="list-disc pl-4 text-gray-700 space-y-1">
                                            {card.data?.strengths?.map((item: string, idx: number) => (
                                              <li key={`${item}-${idx}`}>{item}</li>
                                            ))}
                                          </ul>
                                        </div>
                                        <div>
                                          <p className="font-semibold text-gray-900 mb-1">Risks</p>
                                          <ul className="list-disc pl-4 text-gray-700 space-y-1">
                                            {card.data?.risks?.map((item: string, idx: number) => (
                                              <li key={`${item}-${idx}`}>{item}</li>
                                            ))}
                                          </ul>
                                        </div>
                                        <div>
                                          <p className="font-semibold text-gray-900 mb-1">Next Steps</p>
                                          <ul className="list-disc pl-4 text-gray-700 space-y-1">
                                            {card.data?.nextSteps?.map((item: string, idx: number) => (
                                              <li key={`${item}-${idx}`}>{item}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {card.type === 'financialProjection' && (
                                    <div className="rounded-xl border border-gray-200 bg-white p-3 space-y-3">
                                      <h4 className="text-sm font-bold">Financial Projection</h4>
                                      <div className="text-xs text-gray-700">
                                        <p className="font-semibold mb-1">Assumptions</p>
                                        <ul className="list-disc pl-4 space-y-1">
                                          {card.data?.assumptions?.map((item: string, idx: number) => (
                                            <li key={`${item}-${idx}`}>{item}</li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                          <thead>
                                            <tr className="text-gray-500">
                                              <th className="py-1">Year</th>
                                              <th className="py-1">Revenue</th>
                                              <th className="py-1">Expenses</th>
                                              <th className="py-1">Runway</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {card.data?.projections?.map((row: any) => (
                                              <tr key={row.year} className="text-gray-700 border-t border-gray-100">
                                                <td className="py-1">{row.year}</td>
                                                <td className="py-1">{row.revenue}</td>
                                                <td className="py-1">{row.expenses}</td>
                                                <td className="py-1">{row.runway}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}

                                  {card.type === 'competitorAnalysis' && (
                                    <div className="rounded-xl border border-gray-200 bg-white p-3 space-y-2">
                                      <h4 className="text-sm font-bold">Competitor Analysis</h4>
                                      <div className="space-y-2">
                                        {card.data?.competitors?.map((competitor: any) => (
                                          <div key={competitor.name} className="rounded-lg border border-gray-200 bg-gray-50 p-2">
                                            <p className="text-xs font-semibold text-gray-900">{competitor.name}</p>
                                            <p className="text-[11px] text-gray-600">Focus: {competitor.focus}</p>
                                            <p className="text-[11px] text-gray-700">Edge: {competitor.edge}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {card.type === 'contentDraft' && (
                                    <div className="rounded-xl border border-gray-200 bg-white p-3 space-y-2">
                                      <h4 className="text-sm font-bold">Content Draft</h4>
                                      <p className="text-xs font-semibold text-gray-900">{card.data?.title}</p>
                                      <p className="text-xs text-gray-700">{card.data?.hook}</p>
                                      <ul className="list-disc pl-4 text-xs text-gray-700 space-y-1">
                                        {card.data?.outline?.map((item: string, idx: number) => (
                                          <li key={`${item}-${idx}`}>{item}</li>
                                        ))}
                                      </ul>
                                      <p className="text-xs text-gray-600">CTA: {card.data?.cta}</p>
                                    </div>
                                  )}

                                  {card.type === 'templatePack' && (
                                    <div className="rounded-xl border border-gray-200 bg-white p-3 space-y-2">
                                      <h4 className="text-sm font-bold">Template Pack</h4>
                                      <div className="space-y-2">
                                        {card.data?.templates?.map((template: any) => (
                                          <div key={template.name} className="rounded-lg border border-gray-200 bg-gray-50 p-2 flex items-center justify-between">
                                            <div>
                                              <p className="text-xs font-semibold text-gray-900">{template.name}</p>
                                              <p className="text-[11px] text-gray-600">{template.type}</p>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-700">{template.tier}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
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

      {/* Co-founder/Expert Matching Modal */}
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
                  {matchMode === 'experts'
                    ? 'Find Expert Advisors'
                    : matchMode === 'client'
                      ? 'Find Ideal Clients'
                      : 'Find Your Perfect Co-founder'}
                </h2>
                <button onClick={() => setShowCofounderModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {matchMode === 'experts' ? 'Expertise Needed' : matchMode === 'client' ? 'Industry Focus' : 'Skills Needed'}
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
                    {matchMode === 'client' ? 'Client Stage' : 'Commitment Level'}
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
                  onClick={handleMatchResults}
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