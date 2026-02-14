import { motion } from 'motion/react';
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Clock,
  CheckCircle,
  Users,
  Video,
  FileText,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  X
} from 'lucide-react';
import { useState } from 'react';
import { brandColors } from '../utils/colors';

interface Transaction {
  id: number;
  type: 'consultation' | 'course' | 'content' | 'live-event';
  client: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'processing';
}

interface EarningsData {
  thisMonth: number;
  lastMonth: number;
  thisYear: number;
  pending: number;
  available: number;
}

export function EarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    type: [] as string[],
    status: [] as string[],
    dateRange: 'all' as 'all' | 'today' | 'week' | 'month' | 'year'
  });

  const earningsData: EarningsData = {
    thisMonth: 12450,
    lastMonth: 9800,
    thisYear: 98750,
    pending: 2340,
    available: 10110
  };

  const transactions: Transaction[] = [
    {
      id: 1,
      type: 'consultation',
      client: 'TechFlow AI',
      amount: 500,
      date: 'Today, 2:30 PM',
      status: 'completed'
    },
    {
      id: 2,
      type: 'live-event',
      client: 'Growth Marketing Masterclass',
      amount: 1200,
      date: 'Yesterday, 4:00 PM',
      status: 'completed'
    },
    {
      id: 3,
      type: 'course',
      client: 'Startup Fundraising Course',
      amount: 299,
      date: 'Jan 23, 2024',
      status: 'completed'
    },
    {
      id: 4,
      type: 'consultation',
      client: 'GreenScale',
      amount: 450,
      date: 'Jan 22, 2024',
      status: 'processing'
    },
    {
      id: 5,
      type: 'content',
      client: 'Article: Finding Product-Market Fit',
      amount: 150,
      date: 'Jan 21, 2024',
      status: 'pending'
    },
    {
      id: 6,
      type: 'consultation',
      client: 'StartupHub',
      amount: 400,
      date: 'Jan 20, 2024',
      status: 'completed'
    },
    {
      id: 7,
      type: 'live-event',
      client: 'Scaling Your Startup Event',
      amount: 980,
      date: 'Jan 19, 2024',
      status: 'completed'
    },
    {
      id: 8,
      type: 'course',
      client: 'Team Building Essentials',
      amount: 349,
      date: 'Jan 18, 2024',
      status: 'completed'
    }
  ];

  const monthlyBreakdown = [
    { month: 'Aug', amount: 8500 },
    { month: 'Sep', amount: 9200 },
    { month: 'Oct', amount: 10100 },
    { month: 'Nov', amount: 9800 },
    { month: 'Dec', amount: 11500 },
    { month: 'Jan', amount: 12450 }
  ];

  const percentageChange = Math.round(((earningsData.thisMonth - earningsData.lastMonth) / earningsData.lastMonth) * 100);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return Video;
      case 'course': return FileText;
      case 'content': return FileText;
      case 'live-event': return Users;
      default: return DollarSign;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-700';
      case 'course': return 'bg-purple-100 text-purple-700';
      case 'content': return 'bg-green-100 text-green-700';
      case 'live-event': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const toggleFilter = (category: 'type' | 'status', value: string) => {
    setSelectedFilters(prev => {
      const currentValues = prev[category];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      type: [],
      status: [],
      dateRange: 'all'
    });
  };

  const hasActiveFilters = selectedFilters.type.length > 0 || selectedFilters.status.length > 0 || selectedFilters.dateRange !== 'all';

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            Earnings
          </h1>
          <p className="text-gray-600 mt-1">Track your revenue and transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`relative px-4 py-2 border rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 ${
              hasActiveFilters ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
            {hasActiveFilters && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {selectedFilters.type.length + selectedFilters.status.length + (selectedFilters.dateRange !== 'all' ? 1 : 0)}
              </span>
            )}
          </button>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filter Modal/Dropdown */}
      {isFilterOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          />
          
          {/* Filter Panel - Mobile: Full screen modal, Desktop: Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed lg:absolute top-0 lg:top-auto right-0 lg:right-4 lg:left-auto left-0 bottom-0 lg:bottom-auto lg:mt-2 bg-white rounded-t-3xl lg:rounded-2xl shadow-2xl z-50 lg:w-96 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold">Filter Transactions</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="p-6 space-y-6 max-h-[calc(100vh-140px)] lg:max-h-96 overflow-y-auto">
              {/* Transaction Type */}
              <div>
                <h4 className="font-bold text-sm text-gray-900 mb-3">Transaction Type</h4>
                <div className="space-y-2">
                  {[
                    { value: 'consultation', label: 'Consultation', icon: Video, color: 'blue' },
                    { value: 'course', label: 'Course', icon: FileText, color: 'purple' },
                    { value: 'content', label: 'Content', icon: FileText, color: 'green' },
                    { value: 'live-event', label: 'Live Event', icon: Users, color: 'orange' }
                  ].map(({ value, label, icon: Icon, color }) => (
                    <button
                      key={value}
                      onClick={() => toggleFilter('type', value)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                        selectedFilters.type.includes(value)
                          ? `border-${color}-500 bg-${color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${color}-700`} />
                      </div>
                      <span className="flex-1 text-left font-medium">{label}</span>
                      {selectedFilters.type.includes(value) && (
                        <CheckCircle className={`w-5 h-5 text-${color}-500`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="font-bold text-sm text-gray-900 mb-3">Status</h4>
                <div className="space-y-2">
                  {[
                    { value: 'completed', label: 'Completed', color: 'green' },
                    { value: 'processing', label: 'Processing', color: 'yellow' },
                    { value: 'pending', label: 'Pending', color: 'orange' }
                  ].map(({ value, label, color }) => (
                    <button
                      key={value}
                      onClick={() => toggleFilter('status', value)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                        selectedFilters.status.includes(value)
                          ? `border-${color}-500 bg-${color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium">{label}</span>
                      {selectedFilters.status.includes(value) && (
                        <CheckCircle className={`w-5 h-5 text-${color}-500`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h4 className="font-bold text-sm text-gray-900 mb-3">Date Range</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'all', label: 'All Time' },
                    { value: 'today', label: 'Today' },
                    { value: 'week', label: 'This Week' },
                    { value: 'month', label: 'This Month' },
                    { value: 'year', label: 'This Year' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedFilters(prev => ({ ...prev, dateRange: value as any }))}
                      className={`p-3 rounded-lg border-2 transition-all font-medium text-sm ${
                        selectedFilters.dateRange === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-bold hover:bg-white transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 px-4 py-3 rounded-lg font-bold text-white transition-colors"
                style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm mb-1">This Month</p>
              <h2 className="text-3xl font-bold">${earningsData.thisMonth.toLocaleString()}</h2>
            </div>
            <DollarSign className="w-12 h-12 text-white/40" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            {percentageChange >= 0 ? (
              <>
                <TrendingUp className="w-4 h-4" />
                <span>+{percentageChange}% from last month</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4" />
                <span>{percentageChange}% from last month</span>
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-blue-500" />
            <ArrowUpRight className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold mb-1 text-gray-900">${earningsData.lastMonth.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Last Month</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
          <div className="text-2xl font-bold mb-1 text-gray-900">${earningsData.pending.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div className="text-2xl font-bold mb-1 text-gray-900">${earningsData.available.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Available to Withdraw</div>
        </motion.div>
      </div>

      {/* Earnings Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Earnings Overview</h2>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedPeriod('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setSelectedPeriod('year')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === 'year' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="flex items-end justify-between gap-4 h-64">
          {monthlyBreakdown.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.amount / 15000) * 100}%` }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg relative group cursor-pointer hover:from-green-600 hover:to-emerald-500 transition-colors"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  ${item.amount.toLocaleString()}
                </div>
              </motion.div>
              <span className="text-sm text-gray-600 font-medium">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {transactions.map((transaction, idx) => {
            const Icon = getTypeIcon(transaction.type);
            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl ${getTypeColor(transaction.type)} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{transaction.client}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{transaction.date}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">+${transaction.amount}</div>
                    <div className="text-sm text-gray-500 capitalize">{transaction.type}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Payout Section */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-2">Ready to withdraw?</h3>
            <p className="text-white/80 text-sm">You have ${earningsData.available.toLocaleString()} available in your account</p>
          </div>
          <button 
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Withdraw Funds
          </button>
        </div>
      </div>
    </div>
  );
}