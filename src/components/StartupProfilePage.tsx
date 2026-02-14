import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  MapPin,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  ExternalLink,
  Mail,
  Linkedin,
  Twitter,
  Globe,
  Star,
  Heart,
  Bookmark,
  Share2,
  Download,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  Zap,
  Award,
  FileText,
  BarChart3,
  MessageCircle,
  Phone,
  Video,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingDown,
  Rocket,
  Briefcase,
  Camera,
  UserPlus,
  Send,
  Play
} from 'lucide-react';
import { brandColors } from '../utils/colors';
import { AIDueDiligenceAssistant } from './AIDueDiligenceAssistant';
import { EditStartupProfileModal } from './EditStartupProfileModal';

interface StartupProfileProps {
  viewerType?: 'founder' | 'investor' | 'mentor' | 'talent';
  isOwnProfile?: boolean;
  showBackToGateway?: boolean;
  onBackToGateway?: () => void;
  profileId?: string | null;
}

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  linkedin?: string;
}

interface Update {
  id: number;
  title: string;
  date: string;
  content: string;
}

export function StartupProfilePage({ viewerType = 'investor', isOwnProfile = false, showBackToGateway = false, onBackToGateway, profileId }: StartupProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isSavedOrInterested, setIsSavedOrInterested] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Mock startup data
  const startupData = {
    name: 'TechFlow AI',
    tagline: 'Empowering businesses with intelligent automation solutions',
    logo: '🚀',
    coverImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    industry: ['AI/ML', 'B2B SaaS', 'Enterprise'],
    location: 'San Francisco, CA',
    foundedDate: 'Jan 2023',
    stage: 'Seed',
    fundingAsk: '$2M',
    equityOffered: '10%',
    teamSize: 12,
    website: 'techflow.ai',
    social: {
      linkedin: 'techflow-ai',
      twitter: '@techflowai'
    },
    mission: 'To democratize AI automation and make it accessible for businesses of all sizes, helping them streamline operations and boost productivity.',
    problem: 'Small and medium businesses struggle with manual, repetitive tasks that drain resources and limit growth potential. Current automation solutions are either too complex or too expensive for SMBs.',
    solution: 'TechFlow AI provides an intuitive, affordable automation platform powered by advanced AI that learns from business processes and implements intelligent workflows without requiring technical expertise.',
    businessModel: 'SaaS subscription model with three tiers: Starter ($99/mo), Professional ($299/mo), and Enterprise (custom pricing). Revenue streams include monthly subscriptions, professional services, and API usage fees.',
    marketSize: '$50B TAM in business automation software, targeting the $15B SMB segment with 8% annual growth rate.',
    currentRevenue: '$45K MRR',
    growth: '+35% MoM',
    customers: 234,
    retention: '94%'
  };

  const teamMembers: TeamMember[] = [
    { name: 'Sarah Chen', role: 'CEO & Co-founder', avatar: 'SC' },
    { name: 'Marcus Williams', role: 'CTO & Co-founder', avatar: 'MW' },
    { name: 'Emily Rodriguez', role: 'Head of Product', avatar: 'ER' },
    { name: 'David Park', role: 'Lead Engineer', avatar: 'DP' },
    { name: 'Lisa Thompson', role: 'Head of Sales', avatar: 'LT' },
    { name: 'James Wilson', role: 'Head of Marketing', avatar: 'JW' }
  ];

  const traction = [
    { metric: 'Monthly Revenue', value: '$45K', growth: '+35%' },
    { metric: 'Active Users', value: '2,341', growth: '+28%' },
    { metric: 'Customers', value: '234', growth: '+42%' },
    { metric: 'Retention Rate', value: '94%', growth: '+5%' },
    { metric: 'NPS Score', value: '72', growth: '+8' },
    { metric: 'Runway', value: '18 months', growth: 'Stable' }
  ];

  const milestones = [
    { title: 'Product Launch', date: 'Jan 2023', status: 'completed' },
    { title: 'First 100 Customers', date: 'Apr 2023', status: 'completed' },
    { title: 'Seed Funding Closed', date: 'Aug 2023', status: 'completed' },
    { title: 'Break Even', date: 'Q2 2024', status: 'in-progress' },
    { title: 'Series A', date: 'Q4 2024', status: 'upcoming' }
  ];

  const updates: Update[] = [
    {
      id: 1,
      title: 'Closed $500K in pre-seed funding',
      date: '2 weeks ago',
      content: 'Excited to announce we\'ve closed our pre-seed round led by Accel Partners. This capital will help us expand our team and accelerate product development.'
    },
    {
      id: 2,
      title: 'Launched new enterprise features',
      date: '1 month ago',
      content: 'We\'ve released advanced security features including SSO, role-based access control, and audit logs based on enterprise customer feedback.'
    },
    {
      id: 3,
      title: 'Hit 200 paying customers milestone',
      date: '2 months ago',
      content: 'Grateful to reach 200 paying customers with 94% retention rate. Thank you to our amazing community for the continued support!'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Rocket },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'pitch', label: 'Pitch', icon: FileText },
    { id: 'traction', label: 'Traction', icon: TrendingUp },
    { id: 'journey', label: 'Funding Journey', icon: DollarSign },
    { id: 'updates', label: 'Updates', icon: Calendar }
  ];

  const getCTAButton = () => {
    if (isOwnProfile) {
      return (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsEditModalOpen(true)}
          className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#f78405] to-[#ff9933] text-white rounded-lg font-medium flex items-center justify-center gap-2"
        >
          <Camera className="w-5 h-5" />
          Edit Profile
        </motion.button>
      );
    }

    switch (viewerType) {
      case 'investor':
        return (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsSavedOrInterested(!isSavedOrInterested)}
            className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
              isSavedOrInterested 
                ? 'bg-green-500 text-white' 
                : 'bg-gradient-to-r from-[#f78405] to-[#ff9933] text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isSavedOrInterested ? 'fill-white' : ''}`} />
            {isSavedOrInterested ? 'Interested' : 'Express Interest'}
          </motion.button>
        );
      case 'talent':
        return (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#6666ff] to-[#8888ff] text-white rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            Join Our Team
          </motion.button>
        );
      case 'mentor':
        return (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#242b64] to-[#3a4280] text-white rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Offer Mentorship
          </motion.button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-white overflow-y-auto relative">
      {/* Back to Gateway Button */}
      {showBackToGateway && onBackToGateway && (
        <div className="bg-gradient-to-r from-orange-50 to-blue-50 border-b border-gray-200 px-4 md:px-6 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <h3 className="font-bold text-gray-900">Profile Created Successfully!</h3>
                  <p className="text-sm text-gray-600">Your startup profile is now live and visible to investors</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBackToGateway}
                className="px-4 py-2 bg-white border-2 border-gray-300 hover:border-orange-500 text-gray-700 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Gateway
              </motion.button>
            </div>
          </div>
        </div>
      )}
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Hero Banner */}
          <div className="relative">
            {/* Cover Image */}
            <div 
              className="h-48 md:h-64 w-full"
              style={{ background: startupData.coverImage }}
            />
            
            {/* Profile Header */}
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <div className="relative -mt-16 md:-mt-20">
                {/* Logo */}
                <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center text-4xl md:text-5xl border-4 border-white">
                    {startupData.logo}
                  </div>
                  
                  <div className="flex-1 pb-4 md:pb-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 md:text-[rgb(255,255,255)]">{startupData.name}</h1>
                        <p className="text-gray-900 md:text-[rgb(255,255,255)] mt-1">{startupData.tagline}</p>
                        
                        {/* Industry Tags */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {startupData.industry.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Action Buttons - Desktop */}
                      <div className="hidden md:flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 border-2 border-gray-200 rounded-lg hover:border-[#f78405] transition-colors bg-[rgb(255,255,255)]"
                        >
                          <Share2 className="w-5 h-5 text-gray-600" />
                        </motion.button>
                        {getCTAButton()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Bar */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-y border-gray-200 mt-6">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mb-1">
                    <Target className="w-4 h-4" />
                    <span className="text-sm">Stage</span>
                  </div>
                  <p className="font-semibold text-gray-900">{startupData.stage}</p>
                </div>
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">Funding Ask</span>
                  </div>
                  <p className="font-semibold text-gray-900">{startupData.fundingAsk}</p>
                </div>
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mb-1">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm">Equity</span>
                  </div>
                  <p className="font-semibold text-gray-900">{startupData.equityOffered}</p>
                </div>
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Team Size</span>
                  </div>
                  <p className="font-semibold text-gray-900">{startupData.teamSize}</p>
                </div>
                <div className="text-center md:text-left col-span-2 md:col-span-1">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Founded</span>
                  </div>
                  <p className="font-semibold text-gray-900">{startupData.foundedDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <div className="flex overflow-x-auto hide-scrollbar">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-[#f78405] text-[#f78405]'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* AI Analysis Card - Only visible for founders (isOwnProfile) */}
                {isOwnProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#6666FF]/10 via-purple-50 to-[#F78405]/10 border-2 border-[#6666FF]/30 rounded-xl p-6 relative overflow-hidden"
                  >
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6666FF]/20 to-transparent rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#F78405]/20 to-transparent rounded-full blur-3xl" />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#6666FF] to-[#F78405] flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">Ignisha's Startup Health Check</h2>
                            <p className="text-sm text-gray-600">AI-powered analysis of your startup profile</p>
                          </div>
                        </div>
                      </div>

                      {/* AI Score */}
                      <div className="grid md:grid-cols-4 gap-6 mb-6">
                        <div className="md:col-span-1 flex flex-col items-center justify-center bg-white/80 backdrop-blur rounded-xl p-6 border border-[#6666FF]/20">
                          <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                              <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="#E5E7EB"
                                strokeWidth="8"
                                fill="none"
                              />
                              <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="url(#gradient)"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 56}`}
                                strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.83)}`}
                                strokeLinecap="round"
                              />
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#6666FF" />
                                  <stop offset="100%" stopColor="#F78405" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-4xl font-bold bg-gradient-to-r from-[#6666FF] to-[#F78405] bg-clip-text text-transparent">83</span>
                              <span className="text-sm text-gray-600">/100</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-3 text-center font-medium">Overall Score</p>
                        </div>

                        {/* Metrics Breakdown */}
                        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-green-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Pitch Strength</span>
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                            <div className="flex items-end gap-2">
                              <span className="text-2xl font-bold text-gray-900">89</span>
                              <span className="text-sm text-gray-500 mb-1">/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style={{ width: '89%' }} />
                            </div>
                          </div>

                          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Market Viability</span>
                              <BarChart3 className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="flex items-end gap-2">
                              <span className="text-2xl font-bold text-gray-900">81</span>
                              <span className="text-sm text-gray-500 mb-1">/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full" style={{ width: '81%' }} />
                            </div>
                          </div>

                          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Funding Readiness</span>
                              <DollarSign className="w-5 h-5 text-orange-500" />
                            </div>
                            <div className="flex items-end gap-2">
                              <span className="text-2xl font-bold text-gray-900">79</span>
                              <span className="text-sm text-gray-500 mb-1">/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full" style={{ width: '79%' }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          Last updated: <span className="font-medium">Today</span>
                        </p>
                        <button className="px-5 py-2.5 bg-gradient-to-r from-[#6666FF] to-[#F78405] text-white rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md">
                          <MessageCircle className="w-4 h-4" />
                          Get Detailed Analysis
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Mission */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-xl p-6"
                >
                  <div 
                    className="flex items-center justify-between cursor-pointer md:cursor-default"
                    onClick={() => toggleSection('mission')}
                  >
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-[#f78405]" />
                      Mission
                    </h2>
                    <ChevronDown className={`w-5 h-5 text-gray-400 md:hidden transition-transform ${expandedSections['mission'] ? 'rotate-180' : ''}`} />
                  </div>
                  <div className={`mt-4 text-gray-700 leading-relaxed ${expandedSections['mission'] === false ? 'hidden md:block' : ''}`}>
                    {startupData.mission}
                  </div>
                </motion.div>

                {/* Problem & Solution */}
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-6"
                  >
                    <div 
                      className="flex items-center justify-between cursor-pointer md:cursor-default"
                      onClick={() => toggleSection('problem')}
                    >
                      <h3 className="text-lg font-bold text-gray-900">❌ Problem</h3>
                      <ChevronDown className={`w-5 h-5 text-gray-400 md:hidden transition-transform ${expandedSections['problem'] ? 'rotate-180' : ''}`} />
                    </div>
                    <p className={`mt-4 text-gray-700 leading-relaxed ${expandedSections['problem'] === false ? 'hidden md:block' : ''}`}>
                      {startupData.problem}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-green-50 border border-green-200 rounded-xl p-6"
                  >
                    <div 
                      className="flex items-center justify-between cursor-pointer md:cursor-default"
                      onClick={() => toggleSection('solution')}
                    >
                      <h3 className="text-lg font-bold text-gray-900">✅ Solution</h3>
                      <ChevronDown className={`w-5 h-5 text-gray-400 md:hidden transition-transform ${expandedSections['solution'] ? 'rotate-180' : ''}`} />
                    </div>
                    <p className={`mt-4 text-gray-700 leading-relaxed ${expandedSections['solution'] === false ? 'hidden md:block' : ''}`}>
                      {startupData.solution}
                    </p>
                  </motion.div>
                </div>

                {/* Business Model */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-xl p-6"
                >
                  <div 
                    className="flex items-center justify-between cursor-pointer md:cursor-default"
                    onClick={() => toggleSection('business')}
                  >
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-[#6666ff]" />
                      Business Model
                    </h2>
                    <ChevronDown className={`w-5 h-5 text-gray-400 md:hidden transition-transform ${expandedSections['business'] ? 'rotate-180' : ''}`} />
                  </div>
                  <p className={`mt-4 text-gray-700 leading-relaxed ${expandedSections['business'] === false ? 'hidden md:block' : ''}`}>
                    {startupData.businessModel}
                  </p>
                </motion.div>

                {/* Market Size */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6"
                >
                  <div 
                    className="flex items-center justify-between cursor-pointer md:cursor-default"
                    onClick={() => toggleSection('market')}
                  >
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-600" />
                      Market Opportunity
                    </h2>
                    <ChevronDown className={`w-5 h-5 text-gray-400 md:hidden transition-transform ${expandedSections['market'] ? 'rotate-180' : ''}`} />
                  </div>
                  <p className={`mt-4 text-gray-700 leading-relaxed ${expandedSections['market'] === false ? 'hidden md:block' : ''}`}>
                    {startupData.marketSize}
                  </p>
                </motion.div>
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Our Team</h2>
                  <p className="text-gray-600">{teamMembers.length} members</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f78405] to-[#ff9933] flex items-center justify-center text-white font-bold text-lg">
                          {member.avatar}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{member.role}</p>
                          <div className="flex gap-2 mt-3">
                            <motion.a
                              href="#"
                              whileHover={{ scale: 1.1 }}
                              className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              <Linkedin className="w-4 h-4 text-blue-600" />
                            </motion.a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Pitch Tab */}
            {activeTab === 'pitch' && (
              <div className="space-y-8">
                {/* Pitch Deck */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-xl p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#f78405]" />
                    Pitch Deck
                  </h2>
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">15-slide pitch deck</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-[#f78405] text-white rounded-lg flex items-center gap-2 mx-auto"
                      >
                        <Download className="w-4 h-4" />
                        Download Deck
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Pitch Video */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-[#6666ff]" />
                    Pitch Video
                  </h2>
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Play className="w-8 h-8 text-[#6666ff] ml-1" />
                    </motion.button>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">2-minute founder pitch video</p>
                </motion.div>

                {/* Business Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white border border-gray-200 rounded-xl p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Business Plan</h2>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-[#f78405]" />
                      <div>
                        <p className="font-semibold text-gray-900">TechFlow_Business_Plan_2024.pdf</p>
                        <p className="text-sm text-gray-600">2.4 MB • 28 pages</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-[#f78405] text-white rounded-lg flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Traction Tab */}
            {activeTab === 'traction' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Key Metrics</h2>
                  <span className="text-sm text-gray-600">Updated today</span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {traction.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-sm text-gray-600">{item.metric}</p>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900 mb-2">{item.value}</p>
                      <div className="flex items-center gap-1 text-green-600">
                        <span className="text-sm font-semibold">{item.growth}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Growth Chart Placeholder */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue Growth</h3>
                  <div className="h-64 bg-gradient-to-t from-orange-50 to-transparent rounded-lg flex items-end justify-around p-4">
                    {[20, 35, 48, 62, 78, 95, 100].map((height, index) => (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="w-12 bg-gradient-to-t from-[#f78405] to-[#ff9933] rounded-t-lg"
                      />
                    ))}
                  </div>
                  <div className="flex justify-around mt-4 text-sm text-gray-600">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Funding Journey Tab */}
            {activeTab === 'journey' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Milestones & Funding Journey</h2>
                
                <div className="relative">
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-8 pb-8 last:pb-0"
                    >
                      {/* Timeline Line */}
                      {index < milestones.length - 1 && (
                        <div className="absolute left-3 top-8 w-0.5 h-full bg-gray-200" />
                      )}
                      
                      {/* Timeline Dot */}
                      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        milestone.status === 'completed' 
                          ? 'bg-green-500 border-green-500' 
                          : milestone.status === 'in-progress'
                          ? 'bg-orange-500 border-orange-500 animate-pulse'
                          : 'bg-white border-gray-300'
                      }`}>
                        {milestone.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900">{milestone.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{milestone.date}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            milestone.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : milestone.status === 'in-progress'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {milestone.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Updates Tab */}
            {activeTab === 'updates' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Startup Updates</h2>
                  {isOwnProfile && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-[#f78405] text-white rounded-lg text-sm font-medium"
                    >
                      Post Update
                    </motion.button>
                  )}
                </div>

                {updates.map((update, index) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f78405] to-[#ff9933] flex items-center justify-center text-white font-bold flex-shrink-0">
                        {startupData.logo}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{update.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{update.date}</p>
                        <p className="text-gray-700 mt-3 leading-relaxed">{update.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Sticky CTA Bar */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-20">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 border-2 border-gray-200 rounded-lg"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </motion.button>
              {getCTAButton()}
            </div>
          </div>

          {/* Add padding at bottom for mobile to account for sticky CTA */}
          <div className="md:hidden h-20" />

          <style>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </div>

        {/* AI Due Diligence Assistant - Sticky Sidebar for Investors */}
        {viewerType === 'investor' && !isOwnProfile && (
          <aside className="hidden lg:block w-96 border-l border-gray-200 overflow-y-auto">
            <div className="sticky top-6 p-6">
              <AIDueDiligenceAssistant />
            </div>
          </aside>
        )}
      </div>

      {/* Edit Startup Profile Modal */}
      <EditStartupProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(data) => {
          console.log('Saved profile data:', data);
          // In a real app, this would update the profile via API
        }}
        initialData={startupData}
      />
    </div>
  );
}