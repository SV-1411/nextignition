import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  LayoutGrid,
  Table as TableIcon,
  Calendar as CalendarIcon,
  Settings,
  Plus,
  MoreVertical,
  MessageCircle,
  ExternalLink,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Check,
  X,
  GripVertical,
  ChevronRight,
  Filter,
  Download,
  Clock,
  AlertCircle,
  Building2,
  Sparkles,
  FileText,
  Video,
  Share2,
  Trash2,
  ChevronLeft,
  ChevronDown,
  ArrowRight,
  CheckCircle,
  Briefcase,
  MapPin,
  TrendingDown,
  Edit,
  Eye,
  Bell
} from 'lucide-react';
import { brandColors } from '../utils/colors';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

interface Startup {
  id: string;
  name: string;
  logo: string;
  pitch: string;
  funding: string;
  equity: string;
  stage: string;
  team: number;
  industry: string[];
  aiScore: number;
  addedDate: string;
  founder: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  progress?: number;
  nextAction?: string;
  lastActivity?: string;
  expectedClose?: string;
  investedAmount?: string;
  investmentDate?: string;
  location?: string;
}

interface Column {
  id: string;
  title: string;
  emoji: string;
  color: string;
  count: number;
}

const ITEM_TYPE = 'STARTUP_CARD';

const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

function StartupCard({ startup, columnId, onMove, onQuickAction }: { 
  startup: Startup; 
  columnId: string;
  onMove: (startupId: string, fromColumn: string, toColumn: string) => void;
  onQuickAction: (action: string, startup: Startup) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { startupId: startup.id, fromColumn: columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  return (
    <motion.div
      ref={dragPreview}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0, scale: isDragging ? 0.95 : 1 }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 16px rgba(0,0,0,0.12)' }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 cursor-move relative group"
      style={{ touchAction: 'none' }}
    >
      {/* Drag Handle */}
      <div ref={drag} className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-lg flex-shrink-0" style={{ color: brandColors.electricBlue }}>
            {startup.logo}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-base truncate">{startup.name}</h3>
            </div>
            <p className="text-xs text-gray-500 truncate">{startup.addedDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <span className="px-2 py-1 rounded-lg text-xs font-bold text-white whitespace-nowrap" style={{ backgroundColor: brandColors.electricBlue }}>
            {startup.aiScore}/10
          </span>
          <div ref={menuRef} className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation();
                    setShowMenu(false);
                    const note = window.prompt(`Add a note about ${startup.name}:`);
                    if (note && note.trim()) {
                      onQuickAction('notes', startup);
                    }
                  }} 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4 text-gray-600" /> 
                  <span>Add Notes</span>
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation();
                    setShowMenu(false);
                    const meetingDate = window.prompt(`Schedule a meeting with ${startup.founder.name} from ${startup.name}.\n\nEnter date (e.g., "Jan 30, 2026 at 2:00 PM"):`);
                    if (meetingDate && meetingDate.trim()) {
                      onQuickAction('meeting', startup);
                    }
                  }} 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <CalendarIcon className="w-4 h-4 text-gray-600" /> 
                  <span>Schedule Meeting</span>
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation();
                    setShowMenu(false);
                    if (window.confirm(`Generate AI analysis for ${startup.name}?\n\nThis will analyze:\n• Pitch deck content\n• Market potential\n• Team strength\n• Financial projections\n• Risk assessment`)) {
                      onQuickAction('ai', startup);
                    }
                  }} 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-purple-50 flex items-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-purple-600" /> 
                  <span className="text-purple-700 font-medium">AI Analysis</span>
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation();
                    setShowMenu(false);
                    if (window.confirm(`Create a secure deal room for ${startup.name}?\n\nThis will:\n• Set up document sharing\n• Enable team collaboration\n• Track activity and engagement\n• Provide secure access to ${startup.founder.name}`)) {
                      onQuickAction('dealroom', startup);
                    }
                  }} 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 flex items-center gap-2 transition-colors"
                >
                  <Briefcase className="w-4 h-4 text-blue-600" /> 
                  <span className="text-blue-700 font-medium">Create Deal Room</span>
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation();
                    setShowMenu(false);
                    const message = window.prompt(`Send a message to ${startup.founder.name} (${startup.name}):`);
                    if (message && message.trim()) {
                      onQuickAction('message', startup);
                    }
                  }} 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-gray-600" /> 
                  <span>Message Founder</span>
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation();
                    setShowMenu(false);
                    const email = window.prompt(`Share ${startup.name} deal with team member.\n\nEnter their email address:`);
                    if (email && email.trim() && email.includes('@')) {
                      onQuickAction('share', startup);
                    } else if (email && email.trim()) {
                      alert('Please enter a valid email address');
                    }
                  }} 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <Share2 className="w-4 h-4 text-gray-600" /> 
                  <span>Share Deal</span>
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation();
                    setShowMenu(false);
                    if (window.confirm(`Are you sure you want to pass on ${startup.name}?\n\nThis will remove them from your active pipeline.`)) {
                      onMove(startup.id, columnId, 'passed');
                    }
                  }} 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4" /> 
                  <span className="font-medium">Pass</span>
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation();
                    setShowMenu(false);
                    if (window.confirm(`Are you sure you want to remove ${startup.name}?\n\nThis action cannot be undone.`)) {
                      onMove(startup.id, columnId, 'removed');
                    }
                  }} 
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> 
                  <span className="font-medium">Remove</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pitch */}
      <p className="text-sm text-gray-700 mb-3 line-clamp-2">{startup.pitch}</p>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-2 text-xs">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{startup.funding}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <TrendingUp className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{startup.equity}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Target className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{startup.stage}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{startup.team}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {startup.industry.slice(0, 3).map((tag, idx) => (
          <span key={idx} className="px-2 py-1 text-xs rounded-full border" style={{ borderColor: brandColors.electricBlue, color: brandColors.electricBlue }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Column-specific content */}
      {columnId === 'underReview' && startup.progress && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Due diligence</span>
            <span>{startup.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${startup.progress}%` }}></div>
          </div>
          {startup.nextAction && (
            <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {startup.nextAction}
            </p>
          )}
        </div>
      )}

      {columnId === 'negotiating' && startup.lastActivity && (
        <div className="mb-3 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-700 mb-1">{startup.lastActivity}</p>
          {startup.expectedClose && (
            <p className="text-xs font-medium" style={{ color: brandColors.navyBlue }}>
              Expected close: {startup.expectedClose}
            </p>
          )}
        </div>
      )}

      {columnId === 'invested' && startup.investedAmount && (
        <div className="mb-3 p-2 bg-green-50 rounded-lg">
          <p className="text-sm font-bold text-green-700">{startup.investedAmount} invested</p>
          <p className="text-xs text-gray-600">
            {startup.investmentDate} · {startup.equity} equity
          </p>
        </div>
      )}

      {/* Founder */}
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
          {startup.founder.avatar}
        </div>
        <span className="text-xs text-gray-700">{startup.founder.name}</span>
        {startup.founder.verified && (
          <CheckCircle className="w-3 h-3 text-blue-500" />
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onQuickAction('view', startup);
          }}
          className="flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-blue-50"
          style={{ borderColor: brandColors.electricBlue, color: brandColors.electricBlue }}
        >
          View Profile
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onQuickAction('message', startup);
          }}
          className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function DroppableColumn({ 
  column, 
  startups, 
  onMove,
  onQuickAction 
}: { 
  column: Column; 
  startups: Startup[];
  onMove: (startupId: string, fromColumn: string, toColumn: string) => void;
  onQuickAction: (action: string, startup: Startup) => void;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { startupId: string; fromColumn: string }) => {
      if (item.fromColumn !== column.id) {
        onMove(item.startupId, item.fromColumn, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div
      ref={drop}
      className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] px-2 sm:px-3 md:px-4"
      style={{ minHeight: 'calc(100vh - 240px)' }}
    >
      <div
        className={`rounded-xl transition-all ${
          isOver && canDrop ? 'border-2 border-dashed' : 'border-t-4'
        }`}
        style={{
          borderTopColor: isOver && canDrop ? brandColors.electricBlue : column.color,
          borderColor: isOver && canDrop ? brandColors.electricBlue : 'transparent',
          backgroundColor: isOver && canDrop ? 'rgba(102, 102, 255, 0.05)' : 'transparent',
        }}
      >
        {/* Column Header */}
        <div className="mb-4 sticky top-0 bg-gray-50 py-2 z-10">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <span>{column.emoji}</span>
              <span>{column.title}</span>
            </h2>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
              {startups.length} {startups.length === 1 ? 'startup' : 'startups'}
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-0">
          {startups.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">No startups in this stage</p>
              <button className="text-sm font-medium" style={{ color: brandColors.electricBlue }}>
                Browse opportunities
              </button>
            </div>
          ) : (
            startups.map((startup) => (
              <StartupCard
                key={startup.id}
                startup={startup}
                columnId={column.id}
                onMove={onMove}
                onQuickAction={onQuickAction}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function DealFlowPipeline() {
  const [view, setView] = useState<'kanban' | 'table' | 'calendar'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [activeStage, setActiveStage] = useState('interested'); // For mobile tabs
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  // Detect mobile on mount
  useState(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  });

  const columns: Column[] = [
    { id: 'interested', title: 'Interested', emoji: '💡', color: brandColors.electricBlue, count: 12 },
    { id: 'underReview', title: 'Under Review', emoji: '🔍', color: brandColors.atomicOrange, count: 6 },
    { id: 'negotiating', title: 'Negotiating', emoji: '💬', color: brandColors.navyBlue, count: 4 },
    { id: 'invested', title: 'Invested', emoji: '✅', color: '#10B981', count: 2 },
  ];

  const [startupsByColumn, setStartupsByColumn] = useState<Record<string, Startup[]>>({
    interested: [
      {
        id: '1',
        name: 'TechFlow AI',
        logo: 'TF',
        pitch: 'AI-powered workflow automation for enterprise teams',
        funding: '₹2Cr',
        equity: '15%',
        stage: 'MVP',
        team: 8,
        industry: ['AI/ML', 'SaaS', 'Enterprise'],
        aiScore: 8.2,
        addedDate: 'Added 3 days ago',
        founder: { name: 'Sarah Chen', avatar: 'SC', verified: true },
        location: 'Bangalore'
      },
      {
        id: '2',
        name: 'GreenScale',
        logo: 'GS',
        pitch: 'Sustainable packaging solutions for e-commerce brands',
        funding: '₹1.5Cr',
        equity: '12%',
        stage: 'Pre-revenue',
        team: 5,
        industry: ['Sustainability', 'E-commerce', 'B2B'],
        aiScore: 7.8,
        addedDate: 'Added 5 days ago',
        founder: { name: 'Marcus Williams', avatar: 'MW', verified: true },
        location: 'Mumbai'
      },
      {
        id: '3',
        name: 'HealthBridge',
        logo: 'HB',
        pitch: 'Telemedicine platform connecting rural patients with specialists',
        funding: '₹3Cr',
        equity: '18%',
        stage: 'Early Traction',
        team: 12,
        industry: ['Healthcare', 'Telemedicine', 'Social Impact'],
        aiScore: 8.7,
        addedDate: 'Added 1 week ago',
        founder: { name: 'Dr. Priya Sharma', avatar: 'PS', verified: true },
        location: 'Delhi'
      },
    ],
    underReview: [
      {
        id: '4',
        name: 'FinTech Pro',
        logo: 'FP',
        pitch: 'Digital banking for gig economy workers and freelancers',
        funding: '₹5Cr',
        equity: '20%',
        stage: 'Scaling',
        team: 25,
        industry: ['FinTech', 'Banking', 'B2C'],
        aiScore: 9.1,
        addedDate: 'Added 2 weeks ago',
        founder: { name: 'David Park', avatar: 'DP', verified: true },
        progress: 60,
        nextAction: 'Awaiting financial docs (Due: Jan 28)',
        location: 'Pune'
      },
      {
        id: '5',
        name: 'EduTech Solutions',
        logo: 'ES',
        pitch: 'Interactive learning platform for K-12 students with AI tutors',
        funding: '₹2.5Cr',
        equity: '16%',
        stage: 'Growth',
        team: 18,
        industry: ['EdTech', 'AI/ML', 'Education'],
        aiScore: 8.5,
        addedDate: 'Added 3 weeks ago',
        founder: { name: 'Lisa Zhang', avatar: 'LZ', verified: false },
        progress: 40,
        nextAction: 'Customer reference calls pending',
        location: 'Hyderabad'
      },
    ],
    negotiating: [
      {
        id: '6',
        name: 'CloudSync',
        logo: 'CS',
        pitch: 'Multi-cloud data orchestration and security platform',
        funding: '₹8Cr',
        equity: '22%',
        stage: 'Series A',
        team: 35,
        industry: ['Cloud', 'DevOps', 'Enterprise'],
        aiScore: 9.3,
        addedDate: 'Added 1 month ago',
        founder: { name: 'James Miller', avatar: 'JM', verified: true },
        lastActivity: 'Term sheet sent 2 days ago',
        expectedClose: 'Feb 15',
        location: 'Bangalore'
      },
      {
        id: '7',
        name: 'FoodChain',
        logo: 'FC',
        pitch: 'Farm-to-table supply chain optimization using blockchain',
        funding: '₹4Cr',
        equity: '18%',
        stage: 'Pre-Series A',
        team: 22,
        industry: ['AgriTech', 'Blockchain', 'Supply Chain'],
        aiScore: 8.9,
        addedDate: 'Added 1 month ago',
        founder: { name: 'Anita Desai', avatar: 'AD', verified: true },
        lastActivity: 'Negotiating board seat terms',
        expectedClose: 'Feb 20',
        location: 'Chennai'
      },
    ],
    invested: [
      {
        id: '8',
        name: 'RetailOS',
        logo: 'RO',
        pitch: 'Operating system for modern retail stores with inventory AI',
        funding: '₹10Cr',
        equity: '12%',
        stage: 'Series B',
        team: 45,
        industry: ['Retail Tech', 'AI/ML', 'B2B'],
        aiScore: 9.5,
        addedDate: 'Invested Dec 2025',
        founder: { name: 'Raj Malhotra', avatar: 'RM', verified: true },
        investedAmount: '₹50L',
        investmentDate: 'Dec 15, 2025',
        location: 'Mumbai'
      },
      {
        id: '9',
        name: 'MobiPay',
        logo: 'MP',
        pitch: 'Mobile payments and digital wallet for tier 2/3 cities',
        funding: '₹6Cr',
        equity: '15%',
        stage: 'Series A',
        team: 28,
        industry: ['FinTech', 'Payments', 'Mobile'],
        aiScore: 8.8,
        addedDate: 'Invested Nov 2025',
        founder: { name: 'Neha Kapoor', avatar: 'NK', verified: true },
        investedAmount: '₹75L',
        investmentDate: 'Nov 20, 2025',
        location: 'Jaipur'
      },
    ],
  });

  const handleMove = (startupId: string, fromColumn: string, toColumn: string) => {
    // Find the startup
    const startup = startupsByColumn[fromColumn].find(s => s.id === startupId);
    if (!startup) return;

    // Update state
    setStartupsByColumn(prev => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter(s => s.id !== startupId),
      [toColumn]: [...prev[toColumn], startup],
    }));

    // Show toast
    const columnName = columns.find(c => c.id === toColumn)?.title || toColumn;
    setToastMessage(`Moved to ${columnName}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleQuickAction = (action: string, startup: Startup) => {
    setSelectedStartup(startup);
    setActionType(action);
    setShowActionModal(true);

    // Auto-close modal after 2 seconds for demo
    setTimeout(() => {
      setShowActionModal(false);
      setToastMessage(`Action "${action}" completed for ${startup.name}`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 2000);
  };

  const Backend = isTouchDevice() ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={Backend}>
      <div className="min-h-screen bg-gray-50">
        {/* Top Control Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-5 sticky top-0 z-20">
          <div className="flex flex-col gap-4">
            {/* Title Section - Always on top */}
            <div>
              <h1 className="text-3xl font-bold mb-1">Deal Flow Pipeline</h1>
              <p className="text-sm text-gray-600">
                {Object.values(startupsByColumn).flat().length} active opportunities
              </p>
            </div>

            {/* Controls Section - Below title on mobile, beside on desktop */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search startups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-60 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* View Toggle & Action Buttons Row */}
              <div className="flex items-center gap-3 justify-between sm:justify-start">
                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 flex-shrink-0">
                  <button
                    onClick={() => setView('kanban')}
                    className={`p-2 rounded-lg transition-colors ${
                      view === 'kanban' ? 'text-white' : 'text-gray-600'
                    }`}
                    style={{ backgroundColor: view === 'kanban' ? brandColors.electricBlue : 'transparent' }}
                    title="Kanban View"
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setView('table')}
                    className={`p-2 rounded-lg transition-colors ${
                      view === 'table' ? 'text-white' : 'text-gray-600'
                    }`}
                    style={{ backgroundColor: view === 'table' ? brandColors.electricBlue : 'transparent' }}
                    title="Table View"
                  >
                    <TableIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setView('calendar')}
                    className={`p-2 rounded-lg transition-colors ${
                      view === 'calendar' ? 'text-white' : 'text-gray-600'
                    }`}
                    style={{ backgroundColor: view === 'calendar' ? brandColors.electricBlue : 'transparent' }}
                    title="Calendar View"
                  >
                    <CalendarIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Settings */}
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>

                {/* Add Startup */}
                <button
                  className="px-4 py-2 rounded-lg text-white font-bold flex items-center gap-2 transition-transform hover:scale-105 flex-shrink-0"
                  style={{ backgroundColor: brandColors.atomicOrange }}
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Add Startup</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board View */}
        {view === 'kanban' && (
          <div className="relative">
            {/* Scroll Navigation Buttons */}
            <div className="flex items-center justify-end gap-2 px-6 pt-4 pb-2">
              <button
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                className={`p-2 rounded-lg border transition-all ${
                  canScrollLeft
                    ? 'border-gray-300 hover:bg-gray-100 text-gray-700'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
                title="Scroll Left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                disabled={!canScrollRight}
                className={`p-2 rounded-lg border transition-all ${
                  canScrollRight
                    ? 'border-gray-300 hover:bg-gray-100 text-gray-700'
                    : 'border-gray-200 text-gray-300 cursor-not-allowed'
                }`}
                title="Scroll Right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div 
              ref={scrollContainerRef}
              onScroll={checkScrollButtons}
              className="overflow-x-auto pb-8"
            >
              <div className="flex gap-0 px-2 sm:px-2 pt-2 -mx-2 sm:mx-0" style={{ minWidth: 'max-content', paddingLeft: '8px', paddingRight: '8px' }}>
                {columns.map((column) => (
                  <DroppableColumn
                    key={column.id}
                    column={column}
                    startups={startupsByColumn[column.id] || []}
                    onMove={handleMove}
                    onQuickAction={handleQuickAction}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Table View */}
        {view === 'table' && (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Filters Bar */}
              <div className="border-b border-gray-200 p-4 flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase sticky left-0 bg-gray-50 z-10">
                          <input type="checkbox" className="rounded" />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase w-60 sticky left-12 bg-gray-50 z-10">
                          Startup
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase w-36">
                          Stage
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase w-24">
                          AI Score
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase w-28">
                          Funding Ask
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase w-20">
                          Equity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase w-40">
                          Industry
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase w-28">
                          Added Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase w-24">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {Object.entries(startupsByColumn).flatMap(([columnId, startups]) =>
                        startups.map((startup) => (
                          <tr key={startup.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 sticky left-0 bg-white z-10">
                              <input type="checkbox" className="rounded" />
                            </td>
                            <td className="px-4 py-3 sticky left-12 bg-white z-10">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold flex-shrink-0" style={{ color: brandColors.electricBlue }}>
                                  {startup.logo}
                                </div>
                                <div className="min-w-[120px]">
                                  <div className="font-medium text-sm whitespace-nowrap">{startup.name}</div>
                                  <div className="text-xs text-gray-500 whitespace-nowrap">{startup.founder.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <select className="text-sm border border-gray-300 rounded-lg px-2 py-1 min-w-[140px]">
                                <option value="interested">💡 Interested</option>
                                <option value="underReview">🔍 Under Review</option>
                                <option value="negotiating">💬 Negotiating</option>
                                <option value="invested">✅ Invested</option>
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-1 rounded-lg text-xs font-bold text-white whitespace-nowrap" style={{ backgroundColor: brandColors.electricBlue }}>
                                {startup.aiScore}/10
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">{startup.funding}</td>
                            <td className="px-4 py-3 text-sm whitespace-nowrap">{startup.equity}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1 min-w-[150px]">
                                {startup.industry.slice(0, 2).map((tag, idx) => (
                                  <span key={idx} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 whitespace-nowrap">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{startup.addedDate}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <Eye className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <MessageCircle className="w-4 h-4 text-gray-600" />
                                </button>
                                <button className="p-1 hover:bg-gray-100 rounded">
                                  <MoreVertical className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {Object.values(startupsByColumn).flat().length} results
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 text-white rounded-lg text-sm" style={{ backgroundColor: brandColors.electricBlue }}>
                    1
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    2
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calendar View */}
        {view === 'calendar' && (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">January 2026</h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                    Today
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-bold text-gray-600 py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 2;
                  const isToday = day === 25;
                  return (
                    <div
                      key={i}
                      className={`border border-gray-200 rounded-lg p-2 min-h-24 ${
                        day < 1 || day > 31 ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      {day >= 1 && day <= 31 && (
                        <>
                          <div className={`text-sm font-medium mb-2 ${isToday ? 'text-white bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
                            {day}
                          </div>
                          {day === 25 && (
                            <div className="space-y-1">
                              <div className="text-xs px-2 py-1 rounded text-white" style={{ backgroundColor: brandColors.electricBlue }}>
                                Meeting: TechFlow
                              </div>
                            </div>
                          )}
                          {day === 28 && (
                            <div className="text-xs px-2 py-1 rounded text-white" style={{ backgroundColor: brandColors.atomicOrange }}>
                              Doc deadline
                            </div>
                          )}
                          {day === 15 && (
                            <div className="text-xs px-2 py-1 rounded text-white bg-green-600">
                              Deal close
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Modal */}
        {showActionModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8" style={{ color: brandColors.electricBlue }} />
                </div>
                <h3 className="text-xl font-bold mb-2">Processing Action</h3>
                <p className="text-gray-600 mb-4">
                  {actionType} for {selectedStartup?.name}
                </p>
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
              >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: brandColors.electricBlue + '20' }}>
                      <Settings className="w-5 h-5" style={{ color: brandColors.electricBlue }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Pipeline Settings</h2>
                      <p className="text-sm text-gray-600">Customize your deal flow experience</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {/* Display Settings */}
                    <div>
                      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <Eye className="w-5 h-5" style={{ color: brandColors.electricBlue }} />
                        Display Settings
                      </h3>
                      <div className="space-y-3 ml-7">
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                          <span className="text-sm font-medium">Show AI Scores</span>
                          <input type="checkbox" defaultChecked className="rounded" style={{ accentColor: brandColors.electricBlue }} />
                        </label>
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                          <span className="text-sm font-medium">Show Founder Avatars</span>
                          <input type="checkbox" defaultChecked className="rounded" style={{ accentColor: brandColors.electricBlue }} />
                        </label>
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                          <span className="text-sm font-medium">Compact Card View</span>
                          <input type="checkbox" className="rounded" style={{ accentColor: brandColors.electricBlue }} />
                        </label>
                      </div>
                    </div>

                    {/* Column Customization */}
                    <div>
                      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5" style={{ color: brandColors.electricBlue }} />
                        Column Customization
                      </h3>
                      <div className="space-y-2 ml-7">
                        {columns.map((column) => (
                          <label key={column.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex items-center gap-2">
                              <span>{column.emoji}</span>
                              <span className="text-sm font-medium">{column.title}</span>
                            </div>
                            <input type="checkbox" defaultChecked className="rounded" style={{ accentColor: brandColors.electricBlue }} />
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Notifications */}
                    <div>
                      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <Bell className="w-5 h-5" style={{ color: brandColors.electricBlue }} />
                        Notifications
                      </h3>
                      <div className="space-y-3 ml-7">
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                          <span className="text-sm font-medium">New startup added</span>
                          <input type="checkbox" defaultChecked className="rounded" style={{ accentColor: brandColors.electricBlue }} />
                        </label>
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                          <span className="text-sm font-medium">Stage changes</span>
                          <input type="checkbox" defaultChecked className="rounded" style={{ accentColor: brandColors.electricBlue }} />
                        </label>
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                          <span className="text-sm font-medium">Task reminders</span>
                          <input type="checkbox" defaultChecked className="rounded" style={{ accentColor: brandColors.electricBlue }} />
                        </label>
                      </div>
                    </div>

                    {/* Sorting & Filtering */}
                    <div>
                      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <Filter className="w-5 h-5" style={{ color: brandColors.electricBlue }} />
                        Default Sorting
                      </h3>
                      <div className="ml-7">
                        <select className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option>Most Recent First</option>
                          <option>Highest AI Score</option>
                          <option>Funding Amount (High to Low)</option>
                          <option>Funding Amount (Low to High)</option>
                          <option>Alphabetical (A-Z)</option>
                        </select>
                      </div>
                    </div>

                    {/* Data Export */}
                    <div>
                      <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <Download className="w-5 h-5" style={{ color: brandColors.electricBlue }} />
                        Export Options
                      </h3>
                      <div className="space-y-2 ml-7">
                        <button className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-between">
                          <span>Export as CSV</span>
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-between">
                          <span>Export as PDF Report</span>
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowSettings(false);
                      setToastMessage('Settings saved successfully!');
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 3000);
                    }}
                    className="px-6 py-2 rounded-lg text-white text-sm font-bold hover:scale-105 transition-transform"
                    style={{ backgroundColor: brandColors.electricBlue }}
                  >
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
  );
}