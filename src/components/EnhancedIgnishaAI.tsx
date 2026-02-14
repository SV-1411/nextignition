import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Minimize2,
  Settings,
  X,
  Sparkles,
  ChevronDown,
  Download,
  FileText,
  Search,
  ExternalLink,
  BookOpen,
  Video,
  Headphones,
  Share2,
  Bookmark,
  Copy,
  Check,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Lightbulb,
  FileSpreadsheet,
  Mail,
  FileSignature,
  ArrowRight,
  Link as LinkIcon,
  Filter,
  CheckCircle
} from 'lucide-react';
import { brandColors } from '../utils/colors';
import { IgnishaAIBrandmark } from './IgnishaAIBrandmark';

type UserRole = 'founder' | 'expert' | 'investor';

interface Message {
  id: number;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  templates?: Template[];
  resources?: Resource[];
  navigationHelp?: NavigationHelp;
}

interface Template {
  id: string;
  title: string;
  type: 'pitch-deck' | 'business-plan' | 'financial' | 'email' | 'agreement';
  icon: any;
  description: string;
  customizable: boolean;
}

interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'podcast';
  source: string;
  duration?: string;
  icon: any;
  url: string;
  saved: boolean;
}

interface NavigationHelp {
  steps: string[];
  targetPage?: string;
  filters?: Record<string, any>;
}

interface QuickAction {
  id: number;
  icon: string;
  label: string;
  role: UserRole;
  category: 'chat' | 'template' | 'navigation' | 'resource';
}

interface EnhancedIgnishaAIProps {
  userRole: UserRole;
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: (page: string, filters?: Record<string, any>) => void;
}

const quickActions: QuickAction[] = [
  // Founder actions
  { id: 1, icon: '💬', label: 'Calculate market size', role: 'founder', category: 'chat' },
  { id: 2, icon: '📊', label: 'Generate pitch deck template', role: 'founder', category: 'template' },
  { id: 3, icon: '🗺️', label: 'How to submit for funding?', role: 'founder', category: 'navigation' },
  { id: 4, icon: '📚', label: 'Show fundraising resources', role: 'founder', category: 'resource' },
  { id: 5, icon: '💡', label: 'Series A pitch tips', role: 'founder', category: 'chat' },
  { id: 6, icon: '📈', label: 'Financial projection template', role: 'founder', category: 'template' },
  
  // Investor actions
  { id: 7, icon: '🔍', label: 'Find healthcare investors in India', role: 'investor', category: 'navigation' },
  { id: 8, icon: '📊', label: 'Summarize SaaS funding trends', role: 'investor', category: 'chat' },
  { id: 9, icon: '📝', label: 'Investor update email template', role: 'investor', category: 'template' },
  { id: 10, icon: '📚', label: 'Due diligence resources', role: 'investor', category: 'resource' },
  
  // Expert actions
  { id: 11, icon: '👥', label: 'Find SaaS experts', role: 'expert', category: 'navigation' },
  { id: 12, icon: '📝', label: 'Generate content ideas', role: 'expert', category: 'template' },
  { id: 13, icon: '📚', label: 'Expert resources library', role: 'expert', category: 'resource' },
  { id: 14, icon: '💡', label: 'Client onboarding tips', role: 'expert', category: 'chat' },
];

export function EnhancedIgnishaAI({ userRole, isOpen = false, onClose, onNavigate }: EnhancedIgnishaAIProps) {
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm Ignisha AI 🚀 I can help you with conversations, generate templates, navigate the platform, and find resources. What would you like to do?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'chat' | 'template' | 'navigation' | 'resource'>('all');
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredActions = quickActions.filter(action => 
    action.role === userRole && (activeCategory === 'all' || action.category === activeCategory)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAIResponse = (userInput: string): Message => {
    const lowerInput = userInput.toLowerCase();
    
    // Template generation responses
    if (lowerInput.includes('template') || lowerInput.includes('generate')) {
      const templates: Template[] = [];
      
      if (lowerInput.includes('pitch') || lowerInput.includes('deck')) {
        templates.push({
          id: 'pitch-deck',
          title: `${userRole === 'founder' ? 'Startup' : userRole === 'investor' ? 'Investment' : 'Expert'} Pitch Deck`,
          type: 'pitch-deck',
          icon: FileText,
          description: 'Professional pitch deck with 15 slides tailored to your needs',
          customizable: true
        });
      }
      
      if (lowerInput.includes('business plan') || lowerInput.includes('template')) {
        templates.push({
          id: 'business-plan',
          title: 'Business Plan Outline',
          type: 'business-plan',
          icon: FileText,
          description: 'Comprehensive business plan structure with sections and prompts',
          customizable: true
        });
      }
      
      if (lowerInput.includes('financial') || lowerInput.includes('projection')) {
        templates.push({
          id: 'financial',
          title: 'Financial Projections Spreadsheet',
          type: 'financial',
          icon: FileSpreadsheet,
          description: '3-year financial model with revenue, expenses, and runway calculations',
          customizable: true
        });
      }
      
      if (lowerInput.includes('email') || lowerInput.includes('update')) {
        templates.push({
          id: 'email',
          title: 'Investor Update Email',
          type: 'email',
          icon: Mail,
          description: 'Monthly investor update template with key metrics and milestones',
          customizable: true
        });
      }
      
      if (lowerInput.includes('agreement') || lowerInput.includes('co-founder')) {
        templates.push({
          id: 'agreement',
          title: 'Co-founder Agreement Draft',
          type: 'agreement',
          icon: FileSignature,
          description: 'Legal framework for co-founder equity and responsibilities',
          customizable: true
        });
      }
      
      if (templates.length === 0) {
        // Default templates
        templates.push(
          {
            id: 'pitch-deck',
            title: 'Pitch Deck Template',
            type: 'pitch-deck',
            icon: FileText,
            description: 'Professional pitch deck with 15 slides',
            customizable: true
          },
          {
            id: 'business-plan',
            title: 'Business Plan',
            type: 'business-plan',
            icon: FileText,
            description: 'Comprehensive business plan outline',
            customizable: true
          },
          {
            id: 'financial',
            title: 'Financial Model',
            type: 'financial',
            icon: FileSpreadsheet,
            description: '3-year financial projections',
            customizable: true
          }
        );
      }
      
      return {
        id: messages.length + 2,
        type: 'ai',
        content: `I've prepared these templates for you. You can customize them in the chat and download when ready:`,
        timestamp: new Date(),
        templates
      };
    }
    
    // Navigation helper responses
    if (lowerInput.includes('how do i') || lowerInput.includes('where') || lowerInput.includes('find')) {
      let navigationHelp: NavigationHelp | undefined;
      
      if (lowerInput.includes('submit') && lowerInput.includes('funding')) {
        navigationHelp = {
          steps: [
            'Go to the Funding Portal from your dashboard',
            'Click "Submit Your Startup" button',
            'Fill in your startup details and pitch',
            'Upload required documents (pitch deck, financials)',
            'Submit for investor review'
          ],
          targetPage: 'funding-portal'
        };
      } else if (lowerInput.includes('saas') || lowerInput.includes('expert')) {
        navigationHelp = {
          steps: [
            'Navigate to the Discover page',
            'Select "Experts" tab',
            'Apply "SaaS" industry filter',
            'Browse expert profiles and book sessions'
          ],
          targetPage: 'discover',
          filters: { type: 'experts', industry: 'SaaS' }
        };
      } else if (lowerInput.includes('investor') && (lowerInput.includes('find') || lowerInput.includes('healthcare') || lowerInput.includes('india'))) {
        navigationHelp = {
          steps: [
            'Open the Discover Investors page',
            'Apply filters: Industry = Healthcare, Location = India',
            'Review investor profiles and investment criteria',
            'Connect with relevant investors'
          ],
          targetPage: 'discover',
          filters: { type: 'investors', industry: 'Healthcare', location: 'India' }
        };
      }
      
      if (navigationHelp) {
        return {
          id: messages.length + 2,
          type: 'ai',
          content: `Here's a step-by-step guide to help you:`,
          timestamp: new Date(),
          navigationHelp
        };
      }
    }
    
    // Resource library responses
    if (lowerInput.includes('resource') || lowerInput.includes('show me') || lowerInput.includes('learn')) {
      const resources: Resource[] = [
        {
          id: 'r1',
          title: 'Complete Guide to Startup Fundraising in 2026',
          type: 'article',
          source: 'NextIgnition Blog',
          icon: BookOpen,
          url: '#',
          saved: false
        },
        {
          id: 'r2',
          title: 'How to Build a Winning Pitch Deck',
          type: 'video',
          source: 'NextIgnition Academy',
          duration: '18 min',
          icon: Video,
          url: '#',
          saved: false
        },
        {
          id: 'r3',
          title: 'Podcast: Series A Secrets with Top VCs',
          type: 'podcast',
          source: 'Startup Voices',
          duration: '45 min',
          icon: Headphones,
          url: '#',
          saved: false
        },
        {
          id: 'r4',
          title: 'Market Sizing Frameworks for Startups',
          type: 'article',
          source: 'TechCrunch',
          icon: BookOpen,
          url: '#',
          saved: false
        },
        {
          id: 'r5',
          title: 'Financial Modeling Best Practices',
          type: 'video',
          source: 'Y Combinator',
          duration: '25 min',
          icon: Video,
          url: '#',
          saved: false
        }
      ];
      
      return {
        id: messages.length + 2,
        type: 'ai',
        content: `I've curated these resources for you based on your query:`,
        timestamp: new Date(),
        resources
      };
    }
    
    // Conversational responses
    const conversationalResponses = [
      {
        keywords: ['market size', 'calculate', 'tam', 'sam'],
        response: `To calculate your market size, follow this framework:\n\n1. **TAM (Total Addressable Market)**: Total market demand for your product/service\n   - Example: All businesses needing project management software globally\n\n2. **SAM (Serviceable Addressable Market)**: Portion you can realistically target\n   - Example: SMBs in North America needing project management\n\n3. **SOM (Serviceable Obtainable Market)**: What you can capture in the near term\n   - Example: 2% of SAM in first 3 years\n\n**Calculation Methods:**\n- Top-down: Start with industry reports and narrow down\n- Bottom-up: Calculate from your pricing × potential customers\n- Value theory: Estimate based on value you provide\n\nWould you like me to generate a market sizing template for your specific industry?`
      },
      {
        keywords: ['series a', 'pitch', 'include'],
        response: `A winning Series A pitch should include:\n\n📊 **Key Slides:**\n1. Problem & Solution (with real customer pain points)\n2. Market Size & Opportunity (TAM/SAM/SOM)\n3. Product Demo (show, don't tell)\n4. Business Model (clear revenue streams)\n5. Traction & Metrics (growth, retention, CAC/LTV)\n6. Go-to-Market Strategy\n7. Competitive Landscape\n8. Team (highlight relevant experience)\n9. Financials (3-year projections)\n10. The Ask (amount, use of funds, milestones)\n\n💡 **Series A Specifics:**\n- Show product-market fit with data\n- Clear path to $10M+ ARR\n- Unit economics that work\n- Demonstrate competitive moats\n\nWould you like me to generate a customized pitch deck template?`
      },
      {
        keywords: ['saas', 'funding', 'trend'],
        response: `📈 **Latest SaaS Funding Trends (2026):**\n\n**Key Insights:**\n- Average Series A: $15-20M at $50-80M valuation\n- Focus on profitability & unit economics (not just growth)\n- Vertical SaaS seeing 40% more investor interest\n- AI-powered SaaS getting 2-3x higher valuations\n\n**Hot Sectors:**\n1. AI/ML integration tools\n2. Cybersecurity platforms\n3. DevOps & infrastructure\n4. Vertical SaaS (healthcare, fintech, legal)\n\n**What Investors Want:**\n✓ Net Revenue Retention > 110%\n✓ CAC Payback < 12 months\n✓ Gross Margin > 70%\n✓ Rule of 40 compliance\n\nWant me to find SaaS-focused investors for you?`
      }
    ];
    
    for (const resp of conversationalResponses) {
      if (resp.keywords.some(keyword => lowerInput.includes(keyword))) {
        return {
          id: messages.length + 2,
          type: 'ai',
          content: resp.response,
          timestamp: new Date()
        };
      }
    }
    
    // Default response
    return {
      id: messages.length + 2,
      type: 'ai',
      content: `I can help you with:\n\n💬 **Conversations** - Ask me anything about startups, fundraising, or growth\n📄 **Templates** - Generate pitch decks, business plans, financial models\n🗺️ **Navigation** - Get step-by-step guides to use the platform\n📚 **Resources** - Find curated articles, videos, and podcasts\n\nWhat would you like to explore?`,
      timestamp: new Date()
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(currentInput);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: QuickAction) => {
    setInputValue(action.label);
  };

  const handleDownloadTemplate = (template: Template) => {
    // In real app, this would generate and download the template
    alert(`Downloading ${template.title}...`);
  };

  const handleCopyTemplate = (templateId: string) => {
    setCopiedTemplate(templateId);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  const handleSaveResource = (resourceId: string) => {
    setSavedResources(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const handleNavigationClick = (help: NavigationHelp) => {
    if (help.targetPage && onNavigate) {
      onNavigate(help.targetPage, help.filters);
      setIsMinimized(true);
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-full shadow-2xl flex items-center justify-center z-[9998] group"
      >
        <Sparkles className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">3</span>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 right-6 w-full max-w-md h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-[9998] overflow-hidden border-2 border-purple-200"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">Ignisha AI</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-white/90">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Minimize2 className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'all', label: 'All', icon: Sparkles },
          { id: 'chat', label: 'Chat', icon: Sparkles },
          { id: 'template', label: 'Templates', icon: FileText },
          { id: 'navigation', label: 'Navigate', icon: Target },
          { id: 'resource', label: 'Resources', icon: BookOpen }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <cat.icon className="w-3.5 h-3.5" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl rounded-br-md'
                  : 'bg-white border border-gray-200 rounded-2xl rounded-bl-md shadow-sm'
              } p-3`}
            >
              <p className={`text-sm whitespace-pre-line ${message.type === 'user' ? 'text-white' : 'text-gray-900'}`}>
                {message.content}
              </p>
              
              {/* Templates */}
              {message.templates && message.templates.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.templates.map(template => (
                    <div
                      key={template.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <template.icon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-gray-900">{template.title}</h4>
                          <p className="text-xs text-gray-600 mt-0.5">{template.description}</p>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleDownloadTemplate(template)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors"
                            >
                              <Download className="w-3 h-3" />
                              Download
                            </button>
                            <button
                              onClick={() => handleCopyTemplate(template.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                            >
                              {copiedTemplate === template.id ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Resources */}
              {message.resources && message.resources.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.resources.map(resource => (
                    <div
                      key={resource.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <resource.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-gray-900 group-hover:text-purple-600 transition-colors">
                            {resource.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-600">{resource.source}</span>
                            {resource.duration && (
                              <>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-600">{resource.duration}</span>
                              </>
                            )}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleSaveResource(resource.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                savedResources.includes(resource.id)
                                  ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <Bookmark className="w-3 h-3" />
                              {savedResources.includes(resource.id) ? 'Saved' : 'Save'}
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                              <Share2 className="w-3 h-3" />
                              Share
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors">
                              <ExternalLink className="w-3 h-3" />
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Navigation Help */}
              {message.navigationHelp && (
                <div className="mt-3 p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="space-y-2">
                    {message.navigationHelp.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700 flex-1">{step}</p>
                      </div>
                    ))}
                  </div>
                  {message.navigationHelp.targetPage && (
                    <button
                      onClick={() => handleNavigationClick(message.navigationHelp!)}
                      className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Take me there
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              <span className={`text-xs mt-2 block ${message.type === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {filteredActions.length > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filteredActions.map(action => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm hover:border-purple-300 hover:shadow-sm transition-all whitespace-nowrap flex-shrink-0"
              >
                <span>{action.icon}</span>
                <span className="text-xs font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-600 focus:outline-none text-sm"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}