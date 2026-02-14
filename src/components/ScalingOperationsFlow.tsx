import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Rocket, Users, TrendingUp, Briefcase, DollarSign, Globe, BarChart3 } from 'lucide-react';
import { brandColors } from '../utils/colors';

interface ScalingOperationsFlowProps {
  onBack: () => void;
}

export function ScalingOperationsFlow({ onBack }: ScalingOperationsFlowProps) {
  const [activeSection, setActiveSection] = useState('diagnostics');

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
              <Rocket className="w-5 h-5 text-green-600" />
              <span className="font-bold">Scaling & Operations</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                Verified Funding Required
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-sm mb-8">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { id: 'diagnostics', label: 'Growth Diagnostics', icon: BarChart3 },
              { id: 'experts', label: 'Expert Network', icon: Users },
              { id: 'automation', label: 'Process Automation', icon: TrendingUp },
              { id: 'expansion', label: 'Market Expansion', icon: Globe }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
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

        {/* Growth Diagnostics */}
        {activeSection === 'diagnostics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
              AI-Powered Growth Health Check
            </h2>
            <p className="text-gray-600 mb-8">
              Get personalized recommendations for scaling your startup
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Metrics */}
              <div>
                <h3 className="font-bold text-lg mb-4">Current State</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Current Team Size
                    </label>
                    <input
                      type="number"
                      placeholder="15"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Annual Recurring Revenue (ARR)
                    </label>
                    <input
                      type="number"
                      placeholder="₹ 1,00,00,000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Monthly Burn Rate
                    </label>
                    <input
                      type="number"
                      placeholder="₹ 10,00,000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Current Runway (months)
                    </label>
                    <input
                      type="number"
                      placeholder="18"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* AI Recommendations Panel */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  <h3 className="font-bold text-lg">AI Analysis</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Enter your metrics to get personalized recommendations
                </p>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="font-bold text-sm">Runway Analysis</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Your 18-month runway is healthy. Consider strategic hiring.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="font-bold text-sm">Hiring Plan</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Recommend 5-7 key hires in next 6 months.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="font-bold text-sm">Cash Flow</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Optimize payment cycles to improve cash position.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-lg font-bold text-lg hover:bg-blue-700">
              Generate Full Report
            </button>
          </motion.div>
        )}

        {/* Expert Network */}
        {activeSection === 'experts' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
              Fractional Executive Network
            </h2>
            <p className="text-gray-600 mb-8">
              Access seasoned executives on a part-time basis
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fractional CTO */}
              <div className="border-2 border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Fractional CTO</h3>
                    <p className="text-sm text-gray-600">Technical leadership & strategy</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">₹50,000 - ₹1,00,000</div>
                  <div className="text-sm text-gray-500">per month</div>
                </div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Technical architecture review
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Team hiring & management
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    Technology roadmap
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    10-20 hours/week
                  </li>
                </ul>
                <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
                  View Profiles
                </button>
              </div>

              {/* Fractional CFO */}
              <div className="border-2 border-green-200 rounded-xl p-6 hover:border-green-400 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Fractional CFO</h3>
                    <p className="text-sm text-gray-600">Financial planning & operations</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">₹60,000 - ₹1,20,000</div>
                  <div className="text-sm text-gray-500">per month</div>
                </div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                    Financial modeling & forecasting
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                    Investor relations
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                    Fundraising support
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                    10-20 hours/week
                  </li>
                </ul>
                <button className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">
                  View Profiles
                </button>
              </div>

              {/* VP Marketing */}
              <div className="border-2 border-purple-200 rounded-xl p-6 hover:border-purple-400 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">VP Marketing</h3>
                    <p className="text-sm text-gray-600">Growth & brand strategy</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-purple-600 mb-1">₹40,000 - ₹80,000</div>
                  <div className="text-sm text-gray-500">per month</div>
                </div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                    Growth marketing strategy
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                    Team building & execution
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                    Brand positioning
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                    10-20 hours/week
                  </li>
                </ul>
                <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700">
                  View Profiles
                </button>
              </div>

              {/* Head of Sales */}
              <div className="border-2 border-orange-200 rounded-xl p-6 hover:border-orange-400 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Head of Sales</h3>
                    <p className="text-sm text-gray-600">Revenue & sales operations</p>
                  </div>
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-orange-600 mb-1">₹50,000 - ₹90,000</div>
                  <div className="text-sm text-gray-500">per month</div>
                </div>
                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                    Sales process & playbook
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                    Team hiring & training
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                    Pipeline management
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" />
                    10-20 hours/week
                  </li>
                </ul>
                <button className="w-full py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700">
                  View Profiles
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Process Automation */}
        {activeSection === 'automation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
              Process Automation Workshops
            </h2>
            <p className="text-gray-600 mb-8">
              Streamline your operations with expert-led automation sessions
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Sales Automation Setup',
                  description: 'CRM setup, email sequences, lead scoring automation',
                  duration: '4 hours',
                  price: '₹25,000'
                },
                {
                  title: 'Marketing Tech Stack',
                  description: 'Analytics, email marketing, social media automation',
                  duration: '4 hours',
                  price: '₹25,000'
                },
                {
                  title: 'Operations & Workflows',
                  description: 'N8N, Zapier, internal process automation',
                  duration: '4 hours',
                  price: '₹25,000'
                },
                {
                  title: 'Customer Success Systems',
                  description: 'Onboarding automation, support ticketing, NPS tracking',
                  duration: '4 hours',
                  price: '₹25,000'
                }
              ].map((workshop, idx) => (
                <div key={idx} className="border border-gray-300 rounded-xl p-6 hover:border-blue-300 transition-all">
                  <h3 className="font-bold text-lg mb-2">{workshop.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{workshop.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">{workshop.duration} session</span>
                    <span className="text-lg font-bold text-blue-600">{workshop.price}</span>
                  </div>
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
                    Book Workshop
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Market Expansion */}
        {activeSection === 'expansion' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
              Market Expansion Services
            </h2>
            <p className="text-gray-600 mb-8">
              Strategic support for entering new markets and geographies
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: Globe,
                  title: 'New Geography Research',
                  description: 'Market sizing, competitor analysis, regulatory landscape for new markets',
                  deliverables: ['Market research report', 'Entry strategy deck', 'Risk assessment'],
                  price: '₹50,000'
                },
                {
                  icon: TrendingUp,
                  title: 'Localization Strategy',
                  description: 'Product adaptation, pricing strategy, go-to-market plan for regional markets',
                  deliverables: ['Localization roadmap', 'Pricing model', 'Marketing strategy'],
                  price: '₹40,000'
                },
                {
                  icon: Users,
                  title: 'Partnership Identification',
                  description: 'Find and evaluate strategic partners, distributors, or resellers',
                  deliverables: ['Partner list', 'Evaluation criteria', 'Outreach templates'],
                  price: '₹35,000'
                }
              ].map((service, idx) => (
                <div key={idx} className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <service.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                      <div className="mb-4">
                        <div className="text-xs font-bold text-gray-700 mb-2">Deliverables:</div>
                        <div className="flex flex-wrap gap-2">
                          {service.deliverables.map((item, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-blue-600">{service.price}</div>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
                          Get Started
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
              <h3 className="font-bold text-lg mb-2">Book a Strategy Session</h3>
              <p className="text-sm text-gray-600 mb-4">
                Not sure which service you need? Book a 60-min consultation with our expansion experts.
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-orange-600">₹5,000</div>
                  <div className="text-xs text-gray-500">Credited if service purchased</div>
                </div>
                <button className="px-6 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700">
                  Book Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
