import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Activity,
  Users,
  BarChart3,
  Download,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  MessageSquare,
  Calendar,
  Mail,
  Share2,
  CheckSquare,
  Square,
  Plus,
  X,
  Send,
  Highlighter,
  Edit3,
  Eye,
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  Paperclip,
  MoreVertical,
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  FileDown
} from 'lucide-react';
import { brandColors } from '../utils/colors';
import { AIDocumentAnalyzer } from './AIDocumentAnalyzer';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'ppt' | 'doc';
  category: string;
  uploadedBy: string;
  uploadedAt: string;
  views: number;
  size: string;
}

interface ActivityItem {
  id: string;
  type: 'document' | 'view' | 'comment' | 'meeting' | 'status';
  user: string;
  action: string;
  timestamp: string;
  document?: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  team: 'startup' | 'investor' | 'advisor';
}

interface Comment {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  mentions?: string[];
}

interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  completed: boolean;
  dueDate: string;
}

export function DealRoomPage() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [dealStage, setDealStage] = useState('under-review');
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activeTab, setActiveTab] = useState<'documents' | 'discussion' | 'team'>('documents');
  const [messageInput, setMessageInput] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['pitch-deck', 'financials']);
  const [ndaSigned, setNdaSigned] = useState(true);
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(true);
  const [isActionItemsOpen, setIsActionItemsOpen] = useState(true);
  const [selectedStartupId, setSelectedStartupId] = useState('techstartup');

  // Startup data
  const startups = {
    techstartup: {
      name: 'TechStartup Inc.',
      logo: 'TS',
      stage: 'Series A',
      dealStage: 'under-review',
    },
    greenscale: {
      name: 'GreenScale',
      logo: 'GS',
      stage: 'Seed',
      dealStage: 'negotiating',
    },
    healthai: {
      name: 'HealthAI',
      logo: 'HA',
      stage: 'Pre-seed',
      dealStage: 'interested',
    },
  };

  const startup = startups[selectedStartupId as keyof typeof startups];

  // Document trees for each startup
  const documentTrees = {
    techstartup: [
      {
        id: 'pitch-deck',
        name: 'Pitch Deck',
        icon: FileText,
        children: [
          { id: 'pitch-main', name: 'Company Pitch Deck.pdf', type: 'pdf' as const, size: '2.4 MB', views: 15 },
          { id: 'pitch-summary', name: 'Executive Summary.pdf', type: 'pdf' as const, size: '1.1 MB', views: 8 },
        ],
      },
      {
        id: 'financials',
        name: 'Financials',
        icon: BarChart3,
        children: [
          { id: 'fin-proj', name: 'Financial Projections 2026-2028.xlsx', type: 'doc' as const, size: '890 KB', views: 12 },
          { id: 'fin-current', name: 'Current Financial Statements.pdf', type: 'pdf' as const, size: '1.8 MB', views: 10 },
          { id: 'fin-cap', name: 'Cap Table.pdf', type: 'pdf' as const, size: '654 KB', views: 18 },
        ],
      },
      {
        id: 'legal',
        name: 'Legal Documents',
        icon: Shield,
        children: [
          { id: 'legal-inc', name: 'Certificate of Incorporation.pdf', type: 'pdf' as const, size: '1.2 MB', views: 5 },
          { id: 'legal-ip', name: 'IP Assignment Agreements.pdf', type: 'pdf' as const, size: '2.1 MB', views: 7 },
        ],
      },
      {
        id: 'due-diligence',
        name: 'Due Diligence',
        icon: FolderOpen,
        children: [
          { id: 'dd-tech', name: 'Technical Due Diligence Report.pdf', type: 'pdf' as const, size: '3.2 MB', views: 9 },
          { id: 'dd-market', name: 'Market Analysis.pdf', type: 'pdf' as const, size: '2.8 MB', views: 11 },
        ],
      },
    ],
    greenscale: [
      {
        id: 'pitch-deck',
        name: 'Pitch Deck',
        icon: FileText,
        children: [
          { id: 'pitch-main', name: 'GreenScale Pitch.pdf', type: 'pdf' as const, size: '3.1 MB', views: 22 },
          { id: 'pitch-product', name: 'Product Demo Deck.pdf', type: 'pdf' as const, size: '4.2 MB', views: 18 },
        ],
      },
      {
        id: 'financials',
        name: 'Financials',
        icon: BarChart3,
        children: [
          { id: 'fin-proj', name: 'Revenue Model.xlsx', type: 'doc' as const, size: '1.2 MB', views: 15 },
          { id: 'fin-current', name: 'Q4 2025 Financials.pdf', type: 'pdf' as const, size: '920 KB', views: 12 },
        ],
      },
      {
        id: 'legal',
        name: 'Legal Documents',
        icon: Shield,
        children: [
          { id: 'legal-inc', name: 'Incorporation Docs.pdf', type: 'pdf' as const, size: '1.5 MB', views: 8 },
        ],
      },
    ],
    healthai: [
      {
        id: 'pitch-deck',
        name: 'Pitch Deck',
        icon: FileText,
        children: [
          { id: 'pitch-main', name: 'HealthAI Overview.pdf', type: 'pdf' as const, size: '2.8 MB', views: 10 },
        ],
      },
      {
        id: 'financials',
        name: 'Financials',
        icon: BarChart3,
        children: [
          { id: 'fin-proj', name: 'Financial Plan.xlsx', type: 'doc' as const, size: '750 KB', views: 8 },
        ],
      },
      {
        id: 'legal',
        name: 'Legal Documents',
        icon: Shield,
        children: [
          { id: 'legal-inc', name: 'Formation Documents.pdf', type: 'pdf' as const, size: '980 KB', views: 4 },
          { id: 'legal-patent', name: 'Patent Application.pdf', type: 'pdf' as const, size: '3.5 MB', views: 6 },
        ],
      },
    ],
  };

  const documentTree = documentTrees[selectedStartupId as keyof typeof documentTrees];

  const activities: ActivityItem[] = [
    { id: '1', type: 'document', user: 'Sarah Chen', action: 'uploaded Financial Projections', timestamp: '2 hours ago', document: 'Financial Projections 2026-2028.xlsx' },
    { id: '2', type: 'view', user: 'Michael Park', action: 'viewed Cap Table', timestamp: '3 hours ago', document: 'Cap Table.pdf' },
    { id: '3', type: 'comment', user: 'Emily Davis', action: 'commented on Pitch Deck', timestamp: '5 hours ago', document: 'Company Pitch Deck.pdf' },
    { id: '4', type: 'meeting', user: 'Sarah Chen', action: 'scheduled a meeting', timestamp: '1 day ago' },
    { id: '5', type: 'status', user: 'You', action: 'changed deal stage to Under Review', timestamp: '2 days ago' },
  ];

  const teamMembers: TeamMember[] = [
    { id: '1', name: 'Sarah Chen', role: 'CEO', avatar: 'SC', team: 'startup' },
    { id: '2', name: 'Michael Park', role: 'CTO', avatar: 'MP', team: 'startup' },
    { id: '3', name: 'Emily Davis', role: 'CFO', avatar: 'ED', team: 'startup' },
    { id: '4', name: 'You', role: 'Lead Investor', avatar: 'ME', team: 'investor' },
    { id: '5', name: 'John Smith', role: 'Investment Analyst', avatar: 'JS', team: 'investor' },
    { id: '6', name: 'Dr. Lisa Wang', role: 'Technical Advisor', avatar: 'LW', team: 'advisor' },
  ];

  const messages: Comment[] = [
    { id: '1', user: 'Sarah Chen', message: 'Hi team! All the requested documents have been uploaded. Let me know if you need anything else.', timestamp: '9:30 AM' },
    { id: '2', user: 'You', message: 'Thanks Sarah! The financials look good. Could you provide more details on the customer acquisition cost breakdown?', timestamp: '10:15 AM' },
    { id: '3', user: 'Emily Davis', message: 'Sure! I\'ll prepare a detailed CAC analysis and upload it by EOD.', timestamp: '10:45 AM' },
    { id: '4', user: 'John Smith', message: '@Sarah Chen The technical due diligence report mentions scaling concerns. Can we schedule a technical deep dive?', timestamp: '2:30 PM', mentions: ['Sarah Chen'] },
  ];

  const [actionItems, setActionItems] = useState<ActionItem[]>([
    { id: '1', text: 'Review financial projections', assignee: 'You', completed: true, dueDate: 'Jan 20' },
    { id: '2', text: 'Technical due diligence call', assignee: 'John Smith', completed: false, dueDate: 'Jan 25' },
    { id: '3', text: 'Legal review of IP agreements', assignee: 'Legal Team', completed: false, dueDate: 'Jan 28' },
    { id: '4', text: 'Prepare term sheet', assignee: 'You', completed: false, dueDate: 'Feb 1' },
  ]);

  const dealStages = [
    { value: 'interested', label: 'Interested', color: '#6B7280' },
    { value: 'under-review', label: 'Under Review', color: brandColors.electricBlue },
    { value: 'negotiating', label: 'Negotiating', color: brandColors.atomicOrange },
    { value: 'invested', label: 'Invested', color: '#10B981' },
  ];

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev =>
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const toggleActionItem = (itemId: string) => {
    setActionItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const totalDocuments = documentTree.reduce((sum, folder) => sum + folder.children.length, 0);
  const currentStage = dealStages.find(s => s.value === dealStage);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Startup Selector Bar - Top */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3 z-10">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Viewing Deal Room:</span>
          <select
            value={selectedStartupId}
            onChange={(e) => {
              setSelectedStartupId(e.target.value);
              setSelectedDocument(null);
              setDealStage(startups[e.target.value as keyof typeof startups].dealStage);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}15, ${brandColors.atomicOrange}15)` }}
          >
            {Object.entries(startups).map(([id, startup]) => (
              <option key={id} value={id}>
                {startup.name} ({startup.stage})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Deal Room Sidebar - Desktop */}
        <aside className="hidden lg:block w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
        <div className="p-6">
          {/* Deal Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
              >
                {startup.logo}
              </div>
              <div className="flex-1">
                <h2 className="font-bold">{startup.name}</h2>
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                  {startup.stage}
                </span>
              </div>
            </div>

            {/* Stage Selector */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Deal Stage</label>
              <select
                value={dealStage}
                onChange={(e) => setDealStage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ color: currentStage?.color }}
              >
                {dealStages.map(stage => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="space-y-6">
            {/* Documents Tree */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-gray-600" />
                <h3 className="font-bold text-sm">Documents</h3>
                <span className="ml-auto text-xs text-gray-500">{totalDocuments}</span>
              </div>
              <div className="space-y-1">
                {documentTree.map(folder => (
                  <div key={folder.id}>
                    <button
                      onClick={() => toggleFolder(folder.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      {expandedFolders.includes(folder.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                      <folder.icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium flex-1">{folder.name}</span>
                      <span className="text-xs text-gray-500">{folder.children.length}</span>
                    </button>
                    {expandedFolders.includes(folder.id) && (
                      <div className="ml-6 space-y-1 mt-1">
                        {folder.children.map(doc => (
                          <button
                            key={doc.id}
                            onClick={() => setSelectedDocument({
                              id: doc.id,
                              name: doc.name,
                              type: doc.type,
                              category: folder.name,
                              uploadedBy: 'Sarah Chen',
                              uploadedAt: '2 days ago',
                              views: doc.views,
                              size: doc.size,
                            })}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                              selectedDocument?.id === doc.id
                                ? 'bg-blue-50 text-blue-700'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span className="text-xs flex-1 truncate">{doc.name}</span>
                            <span className="text-xs text-gray-400">{doc.views}</span>
                            <Eye className="w-3 h-3 text-gray-400" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-gray-600" />
                <h3 className="font-bold text-sm">Activity Feed</h3>
              </div>
              <div className="space-y-3">
                {activities.slice(0, 5).map(activity => (
                  <div key={activity.id} className="flex gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      activity.type === 'document' ? 'bg-blue-500' :
                      activity.type === 'view' ? 'bg-gray-400' :
                      activity.type === 'comment' ? 'bg-green-500' :
                      activity.type === 'meeting' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900">
                        <span className="font-medium">{activity.user}</span>{' '}
                        {activity.action}
                      </p>
                      {activity.document && (
                        <p className="text-xs text-gray-500 truncate">{activity.document}</p>
                      )}
                      <p className="text-xs text-gray-400">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Members */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-gray-600" />
                <h3 className="font-bold text-sm">Team Members</h3>
              </div>
              <div className="space-y-2">
                {['startup', 'investor', 'advisor'].map(team => (
                  <div key={team}>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                      {team === 'startup' ? 'Startup Team' : team === 'investor' ? 'Investor Team' : 'Advisors'}
                    </p>
                    <div className="space-y-1 mb-3">
                      {teamMembers.filter(m => m.team === team).map(member => (
                        <div key={member.id} className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ background: team === 'startup' ? brandColors.electricBlue : team === 'investor' ? brandColors.atomicOrange : '#6B7280' }}
                          >
                            {member.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Analytics */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-gray-600" />
                <h3 className="font-bold text-sm">Analytics</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Total Document Views</p>
                  <p className="text-xl font-bold">127</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Average Time per Doc</p>
                  <p className="text-xl font-bold">4.5min</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Engagement Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <span className="text-sm font-bold">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
        {/* Security Banner */}
        {ndaSigned ? (
          <div className="bg-green-50 border-b border-green-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-900">NDA Signed on Jan 15, 2026</span>
              <span className="text-green-700 ml-4">
                <Shield className="w-3.5 h-3.5 inline mr-1" />
                Your actions are logged for security
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="font-medium text-yellow-900">Sign NDA to access documents</span>
            </div>
            <button className="px-4 py-1.5 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700">
              Sign NDA
            </button>
          </div>
        )}

        {/* Quick Actions Bar */}
        <div className="hidden lg:flex items-center gap-3 px-6 py-4 bg-white border-b border-gray-200">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Schedule Meeting</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Mail className="w-4 h-4" />
            <span className="text-sm font-medium">Request Docs</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Share Link</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Download All</span>
          </button>
        </div>

        {/* Document Viewer & Discussion Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Discussion Panel - Desktop */}
          <aside className="flex-1 bg-white border-l border-gray-200 flex flex-col">
            {/* AI Document Analyzer - Shows when document is selected */}
            {selectedDocument && selectedDocument.category === 'Financials' && (
              <div className="p-4 border-b border-gray-200">
                <AIDocumentAnalyzer 
                  documentName={selectedDocument.name}
                  documentCategory={selectedDocument.category}
                />
              </div>
            )}

            {/* Discussion Header with Toggle */}
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={() => setIsDiscussionOpen(!isDiscussionOpen)}
                className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isDiscussionOpen ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                  <h3 className="font-bold">Discussion</h3>
                </div>
                <p className="text-xs text-gray-600">{messages.length} messages</p>
              </button>
            </div>

            {/* Messages - Collapsible */}
            {isDiscussionOpen && (
              <>
                <div className="overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-80 overscroll-contain">
                  {messages.map(message => (
                    <div key={message.id} className="flex gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: message.user === 'You' ? brandColors.atomicOrange : brandColors.electricBlue }}
                      >
                        {message.user.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm">{message.user}</span>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message... Use @ to mention"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Action Items Header with Toggle */}
            <div className="border-t border-gray-200 p-4">
              <button
                onClick={() => setIsActionItemsOpen(!isActionItemsOpen)}
                className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors mb-3"
              >
                <div className="flex items-center gap-2">
                  {isActionItemsOpen ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                  <h4 className="font-bold text-sm">Action Items</h4>
                </div>
                <button 
                  className="p-1 hover:bg-gray-200 rounded z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add new action item logic here
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </button>
              
              {/* Action Items List - Collapsible */}
              {isActionItemsOpen && (
                <div className="space-y-2 mb-4">
                  {actionItems.map(item => (
                    <label key={item.id} className="flex items-start gap-2 cursor-pointer group">
                      <button
                        onClick={() => toggleActionItem(item.id)}
                        className="mt-0.5 flex-shrink-0"
                      >
                        {item.completed ? (
                          <CheckSquare className="w-4 h-4 text-green-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {item.text}
                        </p>
                        <p className="text-xs text-gray-500">{item.assignee} • {item.dueDate}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Footer Toolbar - Desktop */}
        <div className="hidden lg:flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200 text-sm text-gray-600">
          <span>{totalDocuments} documents</span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Updated 2h ago by Sarah Chen
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs">Deal Room Status:</span>
            <span className="font-bold" style={{ color: currentStage?.color }}>
              {currentStage?.label}
            </span>
          </div>
        </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 ${
            activeTab === 'documents' ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-xs font-medium">Documents</span>
        </button>
        <button
          onClick={() => setActiveTab('discussion')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 ${
            activeTab === 'discussion' ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs font-medium">Discussion</span>
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`flex-1 flex flex-col items-center gap-1 py-3 ${
            activeTab === 'team' ? 'text-blue-600' : 'text-gray-600'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-xs font-medium">Team</span>
        </button>
      </div>

      {/* Mobile Content Overlay */}
      {activeTab !== 'documents' && (
        <div className="lg:hidden fixed inset-0 bg-white z-40 pt-16 pb-20 overflow-y-auto">
          <div className="p-4">
            {activeTab === 'discussion' && (
              <>
                <h2 className="text-xl font-bold mb-4">Discussion</h2>
                <div className="space-y-4 mb-20">
                  {messages.map(message => (
                    <div key={message.id} className="flex gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: message.user === 'You' ? brandColors.atomicOrange : brandColors.electricBlue }}
                      >
                        {message.user.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold">{message.user}</span>
                          <span className="text-sm text-gray-500">{message.timestamp}</span>
                        </div>
                        <p className="text-gray-700">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="p-3 bg-blue-600 text-white rounded-lg">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'team' && (
              <>
                <h2 className="text-xl font-bold mb-4">Team Members</h2>
                <div className="space-y-6">
                  {['startup', 'investor', 'advisor'].map(team => (
                    <div key={team}>
                      <h3 className="font-bold text-sm text-gray-500 uppercase mb-3">
                        {team === 'startup' ? 'Startup Team' : team === 'investor' ? 'Investor Team' : 'Advisors'}
                      </h3>
                      <div className="space-y-3">
                        {teamMembers.filter(m => m.team === team).map(member => (
                          <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                              style={{ background: team === 'startup' ? brandColors.electricBlue : team === 'investor' ? brandColors.atomicOrange : '#6B7280' }}
                            >
                              {member.avatar}
                            </div>
                            <div>
                              <p className="font-bold">{member.name}</p>
                              <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}