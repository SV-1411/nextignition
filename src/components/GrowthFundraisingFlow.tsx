import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, DollarSign, Users, FileText, Award, Sparkles } from 'lucide-react';
import { brandColors } from '../utils/colors';

interface GrowthFundraisingFlowProps {
  onBack: () => void;
}

export function GrowthFundraisingFlow({ onBack }: GrowthFundraisingFlowProps) {
  const [activeSection, setActiveSection] = useState('traction');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Stage Selection</span>
            </button>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" style={{ color: brandColors.navyBlue }} />
              <span className="font-bold">Growth & Fundraising Portal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-sm mb-8">
          <div className="flex gap-2">
            {[
              { id: 'traction', label: 'Traction Metrics', icon: TrendingUp },
              { id: 'pitch', label: 'Pitch Deck', icon: FileText },
              { id: 'investors', label: 'Investor Matching', icon: Users },
              { id: 'featured', label: 'Featured Listing', icon: Award }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${
                  activeSection === tab.id
                    ? 'text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={
                  activeSection === tab.id
                    ? { background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }
                    : {}
                }
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Traction Dashboard */}
        {activeSection === 'traction' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
              Startup Traction Dashboard
            </h2>
            <p className="text-gray-600 mb-8">
              Input your key metrics to showcase growth to investors
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Metrics */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg mb-4">User Metrics</h3>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Total Users/Customers
                  </label>
                  <input
                    type="number"
                    placeholder="10,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Monthly Active Users (MAU)
                  </label>
                  <input
                    type="number"
                    placeholder="5,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    User Growth Rate (%)
                  </label>
                  <input
                    type="number"
                    placeholder="25"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Churn Rate (%)
                  </label>
                  <input
                    type="number"
                    placeholder="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Revenue Metrics */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg mb-4">Revenue Metrics</h3>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Monthly Recurring Revenue (MRR)
                  </label>
                  <input
                    type="number"
                    placeholder="₹ 500,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Revenue Growth (MoM %)
                  </label>
                  <input
                    type="number"
                    placeholder="15"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Customer Acquisition Cost (CAC)
                  </label>
                  <input
                    type="number"
                    placeholder="₹ 500"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Lifetime Value (LTV)
                  </label>
                  <input
                    type="number"
                    placeholder="₹ 5,000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
                Generate Dashboard
              </button>
              <button className="px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50">
                Export as PDF
              </button>
            </div>
          </motion.div>
        )}

        {/* Pitch Deck Section */}
        {activeSection === 'pitch' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
                Pitch Deck Services
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* AI Review */}
                <div className="border-2 border-purple-200 rounded-xl p-6 hover:border-purple-400 transition-all">
                  <Sparkles className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="font-bold text-lg mb-2">AI Pitch Deck Review</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload your deck and get AI-powered feedback on structure, content, and investor readiness
                  </p>
                  <ul className="text-sm space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                      Structure analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                      Content quality check
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                      Investor readiness score
                    </li>
                  </ul>
                  <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700">
                    Upload & Review (Free)
                  </button>
                </div>

                {/* Professional Design */}
                <div className="border-2 border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-all">
                  <FileText className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Professional Redesign</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Our designers will rebuild your deck with stunning visuals
                  </p>
                  <ul className="text-sm space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      Custom design
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      3-day turnaround
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      2 revision rounds
                    </li>
                  </ul>
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-blue-600">₹15,000 - ₹35,000</div>
                    <div className="text-xs text-gray-500">Based on complexity</div>
                  </div>
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
                    Get Started
                  </button>
                </div>

                {/* Video Pitch */}
                <div className="border-2 border-orange-200 rounded-xl p-6 hover:border-orange-400 transition-all">
                  <Award className="w-12 h-12 text-orange-600 mb-4" />
                  <h3 className="font-bold text-lg mb-2">Pitch Video Production</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Create a compelling video pitch for investors
                  </p>
                  <ul className="text-sm space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                      Teleprompter recording
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                      Professional editing
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                      5-day delivery
                    </li>
                  </ul>
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-orange-600">₹8,000</div>
                  </div>
                  <button className="w-full py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Investor Matching */}
        {activeSection === 'investors' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
              AI-Powered Investor Matching
            </h2>
            <p className="text-gray-600 mb-8">
              Get matched with investors based on your industry, stage, and funding needs
            </p>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-8 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h3 className="font-bold text-lg">10 Investors Matched</h3>
              </div>
              <p className="text-sm text-gray-600">
                Based on your SaaS, Seed stage, and ₹2Cr funding requirement
              </p>
            </div>

            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="mb-4">Complete your traction metrics to unlock investor matching</p>
              <button 
                onClick={() => setActiveSection('traction')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
              >
                Complete Metrics
              </button>
            </div>
          </motion.div>
        )}

        {/* Featured Listing */}
        {activeSection === 'featured' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
              Get Featured to Investors
            </h2>
            <p className="text-gray-600 mb-8">
              Increase your visibility with featured placement
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Basic */}
              <div className="border border-gray-300 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2">Basic Listing</h3>
                <div className="text-3xl font-bold mb-4">Free</div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-gray-600 rounded-full" />
                    </div>
                    Appears in investor search
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-gray-600 rounded-full" />
                    </div>
                    Standard placement
                  </li>
                </ul>
                <button className="w-full py-3 border-2 border-gray-300 rounded-lg font-bold hover:bg-gray-50">
                  Current Plan
                </button>
              </div>

              {/* Featured */}
              <div className="border-2 border-blue-500 rounded-xl p-6 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                  POPULAR
                </div>
                <h3 className="font-bold text-lg mb-2">Featured Listing</h3>
                <div className="text-3xl font-bold mb-4">₹2,999<span className="text-sm font-normal text-gray-600">/mo</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm">
                    <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    Top placement in search
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    AI-matched to 50+ investors
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Award className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    Highlighted badge
                  </li>
                </ul>
                <button 
                  className="w-full py-3 rounded-lg font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                >
                  Upgrade Now
                </button>
              </div>

              {/* Investor Direct */}
              <div className="border border-purple-500 rounded-xl p-6 bg-gradient-to-br from-purple-50 to-transparent">
                <h3 className="font-bold text-lg mb-2">Investor Direct</h3>
                <div className="text-3xl font-bold mb-4">₹4,999<span className="text-sm font-normal text-gray-600">/mo</span></div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm">
                    <DollarSign className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    All featured benefits
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Users className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    Email to 100+ investors
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Award className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    10+ guaranteed views
                  </li>
                </ul>
                <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
