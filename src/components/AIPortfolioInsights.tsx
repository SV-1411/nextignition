import { motion } from 'motion/react';
import {
  Sparkles,
  TrendingUp,
  AlertCircle,
  Target,
  DollarSign,
  PieChart,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap
} from 'lucide-react';
import { brandColors } from '../utils/colors';

export function AIPortfolioInsights() {
  const portfolioMetrics = {
    overallIRR: 34.2,
    totalInvested: 2450000,
    currentValue: 4850000,
    riskDistribution: {
      low: 45,
      medium: 35,
      high: 20
    }
  };

  const alerts = [
    {
      id: 1,
      type: 'warning',
      company: 'TechFlow AI',
      message: 'Needs follow-on capital within 6 months',
      urgency: 'high',
      amount: '$2M'
    },
    {
      id: 2,
      type: 'warning',
      company: 'HealthSync',
      message: 'Runway extending below 9 months',
      urgency: 'medium',
      amount: '$1.5M'
    },
    {
      id: 3,
      type: 'opportunity',
      company: 'GreenScale',
      message: 'Strong traction, consider follow-on',
      urgency: 'low',
      amount: '$3M'
    }
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Co-invest opportunity in CloudBridge Series B',
      description: 'High growth SaaS company, 3.2x revenue multiple',
      confidence: 92
    },
    {
      id: 2,
      title: 'Consider exit timing for PayFlow',
      description: 'Strategic acquisition interest detected, 4x potential return',
      confidence: 78
    },
    {
      id: 3,
      title: 'Rebalance portfolio: Increase HealthTech exposure',
      description: 'Current allocation 12%, recommended 18-22%',
      confidence: 85
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 text-white shadow-xl m-[16px] m-[0px]"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Portfolio Health Dashboard</h2>
            <p className="text-white/80 text-sm">Powered by Ignisha AI</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold">
          Live
        </span>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium text-white/80">Overall IRR</span>
          </div>
          <div className="text-2xl font-bold">{portfolioMetrics.overallIRR}%</div>
          <div className="flex items-center gap-1 text-xs text-green-300 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+5.2% vs last quarter</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium text-white/80">Total Invested</span>
          </div>
          <div className="text-2xl font-bold">
            ${(portfolioMetrics.totalInvested / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-white/60 mt-1">Across 8 companies</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4" />
            <span className="text-xs font-medium text-white/80">Current Value</span>
          </div>
          <div className="text-2xl font-bold">
            ${(portfolioMetrics.currentValue / 1000000).toFixed(1)}M
          </div>
          <div className="flex items-center gap-1 text-xs text-green-300 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>{((portfolioMetrics.currentValue / portfolioMetrics.totalInvested - 1) * 100).toFixed(1)}% return</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4" />
            <span className="text-xs font-medium text-white/80">Risk Profile</span>
          </div>
          <div className="flex gap-1 mt-2">
            <div
              className="h-2 bg-green-400 rounded-full"
              style={{ width: `${portfolioMetrics.riskDistribution.low}%` }}
              title="Low Risk"
            />
            <div
              className="h-2 bg-yellow-400 rounded-full"
              style={{ width: `${portfolioMetrics.riskDistribution.medium}%` }}
              title="Medium Risk"
            />
            <div
              className="h-2 bg-red-400 rounded-full"
              style={{ width: `${portfolioMetrics.riskDistribution.high}%` }}
              title="High Risk"
            />
          </div>
          <div className="text-xs text-white/60 mt-2">Balanced</div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5" />
          <h3 className="font-bold text-lg">Priority Alerts</h3>
          <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">
            {alerts.filter(a => a.urgency === 'high').length}
          </span>
        </div>
        <div className="space-y-2">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border-l-4 ${
                alert.urgency === 'high'
                  ? 'border-red-400'
                  : alert.urgency === 'medium'
                  ? 'border-yellow-400'
                  : 'border-green-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {alert.type === 'warning' ? (
                      <AlertCircle className="w-4 h-4 text-yellow-300" />
                    ) : (
                      <Zap className="w-4 h-4 text-green-300" />
                    )}
                    <span className="font-bold text-sm">{alert.company}</span>
                    <span className="px-2 py-0.5 bg-white/20 text-xs rounded-full">
                      {alert.amount}
                    </span>
                  </div>
                  <p className="text-sm text-white/80">{alert.message}</p>
                </div>
                <button className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-bold text-lg">AI Recommendations</h3>
        </div>
        <div className="space-y-2">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-sm flex-1">{rec.title}</h4>
                <div className="flex items-center gap-1 ml-2">
                  <span className="text-xs text-white/60">Confidence:</span>
                  <span className="text-xs font-bold">{rec.confidence}%</span>
                </div>
              </div>
              <p className="text-sm text-white/80">{rec.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* View Full Analysis CTA */}
      <button
        className="w-full py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
      >
        View Full Analysis
        <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
