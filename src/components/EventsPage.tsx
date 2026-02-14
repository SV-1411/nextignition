import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  List,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Bookmark,
  BookmarkCheck,
  Share2,
  Filter,
  Search,
  Play,
  CheckCircle,
  Plus,
  ChevronDown,
  X,
  Video,
  Award,
  Target,
  LayoutGrid,
  MessageSquare,
  Newspaper,
  Bot,
  User,
  Settings,
  Home,
  Rocket,
  Briefcase,
  DollarSign,
  PieChart,
  Globe,
  Mic,
  BarChart3,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { brandColors } from '../utils/colors';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Types
type UserRole = 'founder' | 'expert' | 'investor';
type EventType = 'webinar' | 'workshop' | 'demo-day' | 'networking' | 'masterclass';
type EventStatus = 'upcoming' | 'past' | 'live' | 'draft' | 'completed';

interface Event {
  id: number;
  title: string;
  type: EventType;
  host: {
    name: string;
    role: string;
    avatar: string; // url or initials
    verified: boolean;
    type: 'expert' | 'investor' | 'platform';
  };
  date: string;
  time: string;
  duration: string;
  attendees: number;
  price: number | 'free';
  thumbnail: string;
  description: string;
  status: EventStatus;
  bookmarked: boolean;
  isRegistered: boolean;
  isHost: boolean; // Does the current user own this event?
}

interface EventsPageProps {
  userRole?: UserRole; // Optional prop to override role
}

// Mock Data
const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: 'SaaS Fundraising Strategies: Seed to Series A',
    type: 'webinar',
    host: { name: 'Sarah Chen', role: 'Venture Partner', avatar: 'SC', verified: true, type: 'investor' },
    date: 'Jan 28, 2026',
    time: '6:00 PM IST',
    duration: '90 mins',
    attendees: 486,
    price: 'free',
    thumbnail: 'https://images.unsplash.com/photo-1561089489-f13d5e730d72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Learn proven strategies to raise your first round of funding from top VCs.',
    status: 'upcoming',
    bookmarked: false,
    isRegistered: true,
    isHost: false,
  },
  {
    id: 2,
    title: 'Building AI-First Products Workshop',
    type: 'workshop',
    host: { name: 'Michael Park', role: 'AI Architect', avatar: 'MP', verified: true, type: 'expert' },
    date: 'Jan 30, 2026',
    time: '2:00 PM IST',
    duration: '3 hours',
    attendees: 120,
    price: 499,
    thumbnail: 'https://images.unsplash.com/photo-1766766464419-ea9d60543aee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'A hands-on workshop to integrate LLMs into your existing product stack.',
    status: 'upcoming',
    bookmarked: true,
    isRegistered: false,
    isHost: false,
  },
  {
    id: 3,
    title: 'Global FinTech Demo Day 2026',
    type: 'demo-day',
    host: { name: 'NextIgnition', role: 'Platform', avatar: 'NI', verified: true, type: 'platform' },
    date: 'Feb 05, 2026',
    time: '5:00 PM IST',
    duration: '4 hours',
    attendees: 1500,
    price: 'free',
    thumbnail: 'https://images.unsplash.com/photo-1765438863717-49fca900f861?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    description: 'Top 10 FinTech startups pitch to a panel of international investors.',
    status: 'upcoming',
    bookmarked: false,
    isRegistered: true,
    isHost: true, // For investor demo
  },
  {
    id: 4,
    title: 'Networking Night: Founders & Funders',
    type: 'networking',
    host: { name: 'David Wilson', role: 'Community Lead', avatar: 'DW', verified: false, type: 'expert' },
    date: 'Feb 10, 2026',
    time: '7:00 PM IST',
    duration: '2 hours',
    attendees: 300,
    price: 'free',
    thumbnail: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1080',
    description: 'Casual networking event for local founders and angel investors.',
    status: 'upcoming',
    bookmarked: false,
    isRegistered: false,
    isHost: false,
  },
  {
    id: 5,
    title: 'Masterclass: Scaling Sales Teams',
    type: 'masterclass',
    host: { name: 'Elena Rodriguez', role: 'CRO', avatar: 'ER', verified: true, type: 'expert' },
    date: 'Feb 15, 2026',
    time: '4:00 PM IST',
    duration: '60 mins',
    attendees: 250,
    price: 999,
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1080',
    description: 'Advanced sales tactics for B2B SaaS companies scaling past $1M ARR.',
    status: 'upcoming',
    bookmarked: false,
    isRegistered: false,
    isHost: false,
  },
];

export function EventsPage({ userRole: initialUserRole = 'founder' }: EventsPageProps) {
  // State
  const [activeRole, setActiveRole] = useState<UserRole>(initialUserRole);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'my-events' | 'recommended'>('upcoming');
  const [selectedEventType, setSelectedEventType] = useState<EventType | 'all'>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // My Events Sub-tabs (Expert/Investor)
  const [myEventsTab, setMyEventsTab] = useState<'attending' | 'hosting'>('attending');

  // Event Creation Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pricingType, setPricingType] = useState<'free' | 'paid' | 'custom'>('free');
  const [customPrice, setCustomPrice] = useState('');
  
  // Demo Days Modal State
  const [showDemoDaysModal, setShowDemoDaysModal] = useState(false);

  // Derived Data
  const filteredEvents = MOCK_EVENTS.filter(event => {
    // Tab filtering
    if (activeTab === 'past' && event.status !== 'past') return false;
    if (activeTab === 'upcoming' && (event.status === 'past' || event.status === 'completed')) return false;
    if (activeTab === 'my-events') {
       // Simplify: show registered or hosted
       if (activeRole === 'founder') return event.isRegistered;
       if (activeRole === 'expert' || activeRole === 'investor') {
         if (myEventsTab === 'attending') return event.isRegistered;
         if (myEventsTab === 'hosting') return event.isHost;
       }
    }
    
    // Type filtering
    if (selectedEventType !== 'all' && event.type !== selectedEventType) return false;
    
    return true;
  });

  // Helpers
  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case 'webinar': return brandColors.electricBlue;
      case 'workshop': return brandColors.atomicOrange;
      case 'demo-day': return '#10B981'; // Emerald
      case 'networking': return '#8B5CF6'; // Violet
      case 'masterclass': return '#F59E0B'; // Amber
      default: return brandColors.navyBlue;
    }
  };

  const getRoleNavItems = () => {
    const common = [
      { icon: Home, label: 'Home Feed' },
      { icon: Search, label: 'Discover' },
      { icon: MessageSquare, label: 'Messages' },
      { icon: Globe, label: 'Communities' },
      { icon: Calendar, label: 'Events', active: true },
      { icon: Newspaper, label: 'News' },
      { icon: Bot, label: 'Ignisha AI' },
    ];

    const specific = activeRole === 'founder' 
      ? [
          { icon: Rocket, label: 'My Startup' },
          { icon: DollarSign, label: 'Funding Portal' }
        ]
      : activeRole === 'expert'
      ? [
          { icon: Briefcase, label: 'My Clients' },
          { icon: BarChart3, label: 'Revenue Dashboard' }
        ]
      : [
          { icon: PieChart, label: 'Deal Flow' },
          { icon: Briefcase, label: 'Portfolio' }
        ];

    // Insert specific items after Home
    return [common[0], ...specific, ...common.slice(1)];
  };

  if (selectedEvent) {
    return <EventDetailPage event={selectedEvent} onBack={() => setSelectedEvent(null)} role={activeRole} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">


      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">


        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 text-[20px]">Discover, host, and attend world-class events</p>
            </div>

            {/* Create Event Button (Role Based) */}
            <div>
              {activeRole === 'expert' && (
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Host Webinar/Event
                </button>
              )}
              {activeRole === 'investor' && (
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Create Demo Day
                </button>
              )}
              {/* Founder: Hidden (unless elite, simplified here) */}
            </div>
          </div>

          {/* Filters & Tabs */}
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Main Tabs */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto scrollbar-hide">
                {['upcoming', 'past', 'my-events', 'recommended'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-3 lg:px-4 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg self-start hidden lg:flex">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-1.5 rounded ${viewMode === 'calendar' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub Filters (Event Types) */}
            <div className="grid grid-cols-3 lg:flex lg:items-center gap-2 lg:overflow-x-auto lg:pb-0 lg:scrollbar-hide">
              <button
                onClick={() => setSelectedEventType('all')}
                className={`px-2 lg:px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap lg:flex-shrink-0 ${
                  selectedEventType === 'all'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                All Types
              </button>
              {[
                { id: 'webinar', label: 'Webinars' },
                { id: 'workshop', label: 'Workshops' },
                { id: 'demo-day', label: 'Demo Days' },
                { id: 'networking', label: 'Networking' },
                { id: 'masterclass', label: 'Masterclasses' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedEventType(type.id as EventType)}
                  className={`px-2 lg:px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap lg:flex-shrink-0 ${
                    selectedEventType === type.id
                      ? 'text-white border-transparent'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                  style={selectedEventType === type.id ? { backgroundColor: getEventTypeColor(type.id as EventType) } : {}}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* ROLE SPECIFIC WIDGETS */}
          <div className="mb-8">
            {activeRole === 'founder' && activeTab === 'upcoming' && (
              <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-xl p-6 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-emerald-400" />
                      <span className="font-bold text-emerald-400 text-sm tracking-wide">OPPORTUNITY</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Demo Days You Can Pitch At</h3>
                    <p className="text-blue-100 max-w-lg">
                      3 upcoming investor demo days are currently accepting applications from Seed stage FinTech startups.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowDemoDaysModal(true)}
                    className="px-4 md:px-6 py-2.5 md:py-3 bg-white text-blue-900 text-sm md:text-base font-bold rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap w-full md:w-auto"
                  >
                    View & Apply
                  </button>
                </div>
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              </div>
            )}

            {activeRole === 'expert' && activeTab === 'my-events' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                   <p className="text-sm text-gray-500 mb-1">Total Hosted</p>
                   <p className="text-2xl font-bold text-gray-900">12 Events</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                   <p className="text-sm text-gray-500 mb-1">Avg. Attendance</p>
                   <p className="text-2xl font-bold text-blue-600">145 People</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                   <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                   <p className="text-2xl font-bold text-emerald-600">₹45,200</p>
                </div>
              </div>
            )}

            {activeRole === 'investor' && activeTab === 'my-events' && (
               <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="font-bold text-gray-900">Demo Day Applications</h3>
                   <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">12 Pending</span>
                 </div>
                 <div className="flex items-center gap-4 overflow-x-auto pb-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="min-w-[200px] p-3 rounded-lg border border-gray-100 bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded bg-gray-200" />
                          <div>
                             <p className="text-sm font-bold">TechStart {i}</p>
                             <p className="text-xs text-gray-500">Seed • Fintech</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 py-1 text-xs bg-white border border-gray-200 rounded font-medium">Review</button>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>
            )}
          </div>

          {/* MY EVENTS SUB-TABS (Expert/Investor) */}
          {activeTab === 'my-events' && (activeRole === 'expert' || activeRole === 'investor') && (
            <div className="flex items-center gap-6 mb-6 border-b border-gray-200">
               <button 
                 onClick={() => setMyEventsTab('attending')}
                 className={`pb-3 text-sm font-medium border-b-2 transition-colors ${myEventsTab === 'attending' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
               >
                 Attending
               </button>
               <button 
                 onClick={() => setMyEventsTab('hosting')}
                 className={`pb-3 text-sm font-medium border-b-2 transition-colors ${myEventsTab === 'hosting' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
               >
                 Hosting
               </button>
            </div>
          )}

          {/* EVENTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layoutId={`event-${event.id}`}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col h-full"
                onClick={() => setSelectedEvent(event)}
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback 
                    src={event.thumbnail} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur text-xs font-bold text-gray-900 shadow-sm">
                      {event.type === 'demo-day' ? '⭐ ' : ''}{event.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                     <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm">
                        {event.bookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-orange-500" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-gray-400" />
                        )}
                     </div>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-md bg-black/70 backdrop-blur text-white text-xs font-bold">
                     {event.price === 'free' ? 'Free' : `₹${event.price}`}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                       <Calendar className="w-3 h-3" />
                       {event.date} • {event.time}
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                    {event.description}
                  </p>

                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200">
                        {event.host.avatar}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          By {event.host.name}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">
                          {event.host.role}
                        </p>
                     </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                     <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Users className="w-3.5 h-3.5" />
                        {event.attendees} Registered
                     </div>
                     
                     <button className="px-4 py-2 bg-gray-50 text-gray-900 text-xs font-bold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {event.isRegistered ? 'View Details' : 'Register Now'}
                     </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-20">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Calendar className="w-8 h-8 text-gray-400" />
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-1">No events found</h3>
               <p className="text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </main>

      {/* CREATE EVENT MODAL (Simplified) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold">
                {activeRole === 'investor' ? 'Create Demo Day Event' : 'Host New Event'}
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Event Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(activeRole === 'investor' 
                     ? ['Demo Day', 'Investor Q&A', 'Networking'] 
                     : ['Webinar', 'Workshop', 'Masterclass']
                   ).map(type => (
                    <button key={type} className="border border-gray-200 rounded-lg p-3 text-sm font-medium hover:border-blue-500 hover:bg-blue-50 text-left">
                       {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Q1 Investor Showcase" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                    placeholder="Describe what attendees will learn and why they should join..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="">Select category</option>
                      <option value="technology">Technology</option>
                      <option value="business">Business</option>
                      <option value="marketing">Marketing</option>
                      <option value="finance">Finance</option>
                      <option value="product">Product</option>
                      <option value="design">Design</option>
                      <option value="sales">Sales</option>
                      <option value="hr">HR & Talent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="">Select duration</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                      <option value="180">3 hours</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="e.g. startup, funding, pitch (comma-separated)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                     <input type="time" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
              </div>

              {/* Location & Format */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Format</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="border border-gray-200 rounded-lg p-3 text-sm font-medium hover:border-blue-500 hover:bg-blue-50 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Virtual
                    </button>
                    <button className="border border-gray-200 rounded-lg p-3 text-sm font-medium hover:border-blue-500 hover:bg-blue-50 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      In-Person
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location / Meeting Link</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="e.g. Zoom link or physical address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Attendees</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="e.g. 100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                      <option value="both">English & Hindi</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Pricing</label>
                 <div className="flex flex-col gap-3">
                   <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                         <input 
                           type="radio" 
                           name="price" 
                           checked={pricingType === 'free'}
                           onChange={() => setPricingType('free')}
                           className="text-blue-600 focus:ring-blue-500"
                         /> 
                         <span className="text-sm">Free</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                         <input 
                           type="radio" 
                           name="price" 
                           checked={pricingType === 'paid'}
                           onChange={() => setPricingType('paid')}
                           className="text-blue-600 focus:ring-blue-500"
                         /> 
                         <span className="text-sm">Paid (₹499)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                         <input 
                           type="radio" 
                           name="price" 
                           checked={pricingType === 'custom'}
                           onChange={() => setPricingType('custom')}
                           className="text-blue-600 focus:ring-blue-500"
                         /> 
                         <span className="text-sm">Custom</span>
                      </label>
                   </div>
                   
                   {/* Custom Price Input */}
                   {pricingType === 'custom' && (
                     <motion.div 
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       className="relative"
                     >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">₹</span>
                        </div>
                        <input
                          type="number"
                          value={customPrice}
                          onChange={(e) => setCustomPrice(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                     </motion.div>
                   )}
                 </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Banner (URL)</label>
                  <input 
                    type="url" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites</label>
                  <textarea 
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
                    placeholder="Any prerequisites or requirements for attendees..."
                  />
                </div>

                {/* Agenda Builder */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Agenda</label>
                  <div className="space-y-3 mb-3">
                    {[
                      { time: '00:00', title: 'Welcome & Introduction' },
                      { time: '00:15', title: 'Main Session' }
                    ].map((item, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <input
                          type="text"
                          defaultValue={item.time}
                          placeholder="00:00"
                          className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                        />
                        <input
                          type="text"
                          defaultValue={item.title}
                          placeholder="Agenda item title"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Agenda Item
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Settings</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="text-blue-600 focus:ring-blue-500" />
                      Enable Q&A session
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="text-blue-600 focus:ring-blue-500" />
                      Allow recordings
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="text-blue-600 focus:ring-blue-500" />
                      Send reminder emails
                    </label>
                  </div>
                </div>
              </div>

              {/* Role Specific Fields */}
              {activeRole === 'investor' && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-sm mb-3">Demo Day Settings</h4>
                  <div className="space-y-3">
                     <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked /> Allow startups to apply
                     </label>
                     <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" /> Private (Invite Only)
                     </label>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
               <button onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
               <button className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md">Publish Event</button>
            </div>
          </div>
        </div>
      )}

      {/* DEMO DAYS MODAL */}
      <AnimatePresence>
        {showDemoDaysModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowDemoDaysModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-900 to-blue-900 text-white flex-shrink-0">
                <div>
                  <h2 className="text-lg md:text-2xl font-bold">Demo Days Accepting Applications</h2>
                  <p className="text-blue-100 text-xs md:text-sm mt-1">Apply to pitch at upcoming investor events</p>
                </div>
                <button
                  onClick={() => setShowDemoDaysModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="space-y-6">
                  {/* Demo Day Cards */}
                  {[
                    {
                      id: 3,
                      title: 'Global FinTech Demo Day 2026',
                      host: 'NextIgnition Platform',
                      date: 'Feb 05, 2026',
                      time: '5:00 PM IST',
                      investors: 25,
                      spots: 10,
                      spotsLeft: 3,
                      deadline: 'Jan 30, 2026',
                      stage: 'Seed',
                      sectors: ['FinTech', 'Payments', 'Banking'],
                      prize: '₹10L Investment Pool',
                      thumbnail: 'https://images.unsplash.com/photo-1765438863717-49fca900f861?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
                    },
                    {
                      id: 6,
                      title: 'EdTech Innovation Showcase',
                      host: 'Learn Ventures',
                      date: 'Feb 12, 2026',
                      time: '3:00 PM IST',
                      investors: 18,
                      spots: 8,
                      spotsLeft: 5,
                      deadline: 'Feb 05, 2026',
                      stage: 'Pre-Seed to Seed',
                      sectors: ['EdTech', 'E-Learning', 'SaaS'],
                      prize: '₹5L Seed Funding',
                      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
                    },
                    {
                      id: 7,
                      title: 'HealthTech Investor Connect',
                      host: 'HealthVentures India',
                      date: 'Feb 18, 2026',
                      time: '4:30 PM IST',
                      investors: 30,
                      spots: 12,
                      spotsLeft: 8,
                      deadline: 'Feb 10, 2026',
                      stage: 'Seed to Series A',
                      sectors: ['HealthTech', 'MedTech', 'Wellness'],
                      prize: 'Direct VC Meetings',
                      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
                    },
                  ].map((demoDay) => (
                    <div
                      key={demoDay.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {/* Thumbnail */}
                        <div className="relative h-48 md:h-auto">
                          <ImageWithFallback
                            src={demoDay.thumbnail}
                            alt={demoDay.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-2 md:px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg">
                              ⭐ ACCEPTING
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="md:col-span-2 p-4 md:p-6 flex flex-col">
                          <div className="flex-1">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{demoDay.title}</h3>
                            <p className="text-xs md:text-sm text-gray-500 mb-4">Hosted by {demoDay.host}</p>

                            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
                              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                                <Calendar className="w-3 md:w-4 h-3 md:h-4 text-gray-400 flex-shrink-0" />
                                <span className="truncate">{demoDay.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                                <Clock className="w-3 md:w-4 h-3 md:h-4 text-gray-400 flex-shrink-0" />
                                <span className="truncate">{demoDay.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                                <Users className="w-3 md:w-4 h-3 md:h-4 text-gray-400 flex-shrink-0" />
                                <span>{demoDay.investors} Investors</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-orange-600">
                                <Target className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                                <span>{demoDay.spotsLeft} Spots Left</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {demoDay.sectors.map((sector) => (
                                <span
                                  key={sector}
                                  className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                                >
                                  {sector}
                                </span>
                              ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Application Deadline</p>
                                <p className="text-xs md:text-sm font-bold text-gray-900">{demoDay.deadline}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Target Stage</p>
                                <p className="text-xs md:text-sm font-bold text-gray-900">{demoDay.stage}</p>
                              </div>
                              <div className="md:col-span-2">
                                <p className="text-xs text-gray-500 mb-1">Prize Pool</p>
                                <p className="text-xs md:text-sm font-bold text-emerald-600">{demoDay.prize}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 mt-4">
                            <button className="flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm md:text-base font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                              <Rocket className="w-4 h-4" />
                              Apply Now
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDemoDaysModal(false);
                                setSelectedEvent(MOCK_EVENTS.find(e => e.id === demoDay.id) || null);
                              }}
                              className="px-4 md:px-6 py-2.5 md:py-3 bg-white border-2 border-gray-200 text-gray-700 text-sm md:text-base font-bold rounded-lg hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">View Details</span>
                              <span className="sm:hidden">Details</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Info Banner */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 text-sm md:text-base">Application Tips</h4>
                      <ul className="text-xs md:text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>Complete your startup profile before applying</li>
                        <li>Ensure your pitch deck is up to date</li>
                        <li>Applications are reviewed within 48 hours</li>
                        <li>Selected startups receive email confirmation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-4 md:px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs md:text-sm text-gray-600 text-center sm:text-left">
                    Need help? <a href="#" className="text-blue-600 hover:underline font-medium">Contact Support</a>
                  </p>
                  <button
                    onClick={() => setShowDemoDaysModal(false)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
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

// ----------------------------------------------------------------------
// EVENT DETAIL PAGE SUB-COMPONENT
// ----------------------------------------------------------------------
function EventDetailPage({ event, onBack, role }: { event: Event; onBack: () => void; role: UserRole }) {
   return (
     <div className="flex h-screen bg-white overflow-y-auto">
        <div className="w-full max-w-7xl mx-auto">
           {/* Cover */}
           <div className="h-64 md:h-80 relative bg-gray-900">
              <ImageWithFallback 
                 src={event.thumbnail} 
                 alt={event.title}
                 className="w-full h-full object-cover opacity-60"
              />
              <button 
                 onClick={onBack}
                 className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/30 transition-colors"
              >
                 <ChevronLeft className="w-6 h-6" />
              </button>
           </div>

           <div className="px-6 lg:px-12 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                 <div>
                    <div className="flex items-center gap-3 mb-4">
                       <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide">
                          {event.type.replace('-', ' ')}
                       </span>
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          event.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                       }`}>
                          {event.status}
                       </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-gray-600">
                       <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <span>{event.date}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <span>{event.time} ({event.duration})</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <span>Online Event</span>
                       </div>
                    </div>
                 </div>

                 {/* Host */}
                 <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50">
                    <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                       {event.host.avatar}
                    </div>
                    <div>
                       <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          {event.host.name}
                          {event.host.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                       </h3>
                       <p className="text-sm text-gray-500">{event.host.role}</p>
                    </div>
                    <button className="ml-auto text-sm font-bold text-blue-600 px-4 py-2 hover:bg-blue-50 rounded-lg">
                       View Profile
                    </button>
                 </div>

                 {/* Description */}
                 <div>
                    <h3 className="text-xl font-bold mb-3">About this Event</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                       {event.description}
                       {'\n\n'}
                       Join us for an immersive session designed to help you navigate the complexities of the current startup ecosystem. Whether you are just starting out or looking to scale, this event provides actionable insights.
                    </p>
                 </div>

                 {/* Agenda */}
                 <div>
                    <h3 className="text-xl font-bold mb-4">Agenda</h3>
                    <div className="space-y-4">
                       {[
                          { time: '00:00', title: 'Welcome & Introduction' },
                          { time: '00:15', title: 'Keynote Presentation' },
                          { time: '00:45', title: 'Panel Discussion' },
                          { time: '01:15', title: 'Q&A Session' },
                       ].map((item, i) => (
                          <div key={i} className="flex gap-4">
                             <div className="w-16 font-mono text-sm text-gray-500 pt-1">{item.time}</div>
                             <div className="pb-4 border-l-2 border-gray-100 pl-6 relative">
                                <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-blue-400" />
                                <h4 className="font-bold text-gray-900">{item.title}</h4>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                 {/* Registration Card */}
                 <div className="p-6 rounded-2xl border border-gray-200 shadow-lg sticky top-6">
                    <div className="mb-6 text-center">
                       <p className="text-sm text-gray-500 mb-1">Price</p>
                       <p className="text-4xl font-bold text-gray-900">
                          {event.price === 'free' ? 'Free' : `₹${event.price}`}
                       </p>
                    </div>

                    <button className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all mb-3">
                       {event.isRegistered ? 'Join Event' : 'Register Now'}
                    </button>
                    
                    {event.isRegistered && (
                      <button className="w-full py-2.5 text-gray-600 font-medium hover:bg-gray-50 rounded-xl border border-gray-200 mb-4">
                         Add to Calendar
                      </button>
                    )}
                    
                    {role === 'founder' && event.type === 'demo-day' && (
                       <button className="w-full py-3.5 mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                          <Rocket className="w-4 h-4" />
                          Apply to Pitch
                       </button>
                    )}

                    {(event.isHost) && (
                       <button className="w-full py-2.5 mt-2 text-blue-600 font-bold border border-blue-100 bg-blue-50 rounded-xl hover:bg-blue-100">
                          Edit Event Details
                       </button>
                    )}

                    <div className="pt-6 mt-6 border-t border-gray-100">
                       <p className="text-sm font-bold text-gray-900 mb-3">Attendees</p>
                       <div className="flex -space-x-2 overflow-hidden mb-2">
                          {[1,2,3,4,5].map(i => (
                             <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200" />
                          ))}
                          <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                             +100
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     </div>
   );
}