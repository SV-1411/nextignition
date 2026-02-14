import { motion } from 'motion/react';
import {
  Sparkles,
  Target,
  Users,
  TrendingUp,
  Shield,
  AlertTriangle,
  BarChart3,
  Download,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  DollarSign
} from 'lucide-react';
import { useState } from 'react';
import { brandColors } from '../utils/colors';

export function AIDueDiligenceAssistant() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    market: true,
    competitive: false,
    team: false,
    traction: false,
    redFlags: false,
    comparables: false,
  });
  const [showChatModal, setShowChatModal] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="bg-white rounded-xl border-2 border-purple-200 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Ignisha's Investment Analysis</h3>
            <p className="text-xs text-white/80">AI-powered due diligence insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white/20 rounded-full h-1.5">
            <div className="bg-white rounded-full h-1.5" style={{ width: '85%' }} />
          </div>
          <span className="text-xs font-bold">85% Complete</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
        {/* Market Opportunity */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('market')}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-sm">Market Opportunity</span>
            </div>
            {expandedSections.market ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {expandedSections.market && (
            <div className="p-4 bg-white space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 rounded-lg p-2">
                  <div className="text-xs text-blue-600 font-bold">TAM</div>
                  <div className="text-lg font-bold text-blue-900">$50B</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-2">
                  <div className="text-xs text-purple-600 font-bold">SAM</div>
                  <div className="text-lg font-bold text-purple-900">$15B</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="text-xs text-green-600 font-bold">SOM</div>
                  <div className="text-lg font-bold text-green-900">$1.2B</div>
                </div>
              </div>
              <p className="text-xs text-gray-700">
                Strong market with 15.3% CAGR. Digital transformation driving SMB adoption.
              </p>
              <div className="flex items-center gap-2 text-xs font-medium text-green-600">
                <TrendingUp className="w-3 h-3" />
                Growing market with strong tailwinds
              </div>
            </div>
          )}
        </div>

        {/* Competitive Position */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('competitive')}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-sm">Competitive Position</span>
            </div>
            {expandedSections.competitive ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {expandedSections.competitive && (
            <div className="p-4 bg-white space-y-2">
              <div>
                <h4 className="font-bold text-xs text-green-600 mb-1">Strengths</h4>
                <ul className="text-xs text-gray-700 space-y-0.5">
                  <li>• Innovative AI approach</li>
                  <li>• Strong technical team</li>
                  <li>• First-mover in SMB segment</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-xs text-red-600 mb-1">Threats</h4>
                <ul className="text-xs text-gray-700 space-y-0.5">
                  <li>• Competition from larger players</li>
                  <li>• Regulatory changes</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Team Assessment */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('team')}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-600" />
              <span className="font-bold text-sm">Team Assessment</span>
            </div>
            {expandedSections.team ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {expandedSections.team && (
            <div className="p-4 bg-white space-y-2">
              <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  SC
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xs">Sarah Chen - CEO</h4>
                  <p className="text-xs text-gray-600">Ex-Google PM • Stanford CS</p>
                  <div className="flex gap-1 mt-1">
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Strong Leader</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  MW
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xs">Marcus Williams - CTO</h4>
                  <p className="text-xs text-gray-600">Ex-Meta Engineer • MIT</p>
                  <div className="flex gap-1 mt-1">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">Tech Visionary</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-700 mt-2">
                Complementary skills with proven track records at tier-1 companies.
              </p>
            </div>
          )}
        </div>

        {/* Traction Validation */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('traction')}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-600" />
              <span className="font-bold text-sm">Traction Validation</span>
            </div>
            {expandedSections.traction ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {expandedSections.traction && (
            <div className="p-4 bg-white space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="text-xs text-green-600 font-bold">MoM Growth</div>
                  <div className="text-lg font-bold text-green-900">+35%</div>
                  <div className="text-xs text-green-700">Above avg (23%)</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-2">
                  <div className="text-xs text-blue-600 font-bold">CAC : LTV</div>
                  <div className="text-lg font-bold text-blue-900">1 : 4.2</div>
                  <div className="text-xs text-blue-700">Healthy</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-2">
                  <div className="text-xs text-purple-600 font-bold">Net Retention</div>
                  <div className="text-lg font-bold text-purple-900">118%</div>
                  <div className="text-xs text-purple-700">Strong PMF</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-2">
                  <div className="text-xs text-orange-600 font-bold">Burn Multiple</div>
                  <div className="text-lg font-bold text-orange-900">1.8x</div>
                  <div className="text-xs text-orange-700">Efficient</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Red Flags */}
        <div className="border border-red-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('redFlags')}
            className="w-full px-4 py-3 flex items-center justify-between bg-red-50 hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="font-bold text-sm">Red Flags</span>
            </div>
            {expandedSections.redFlags ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {expandedSections.redFlags && (
            <div className="p-4 bg-white space-y-2">
              <div className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-yellow-900">Customer Concentration</h4>
                  <p className="text-xs text-yellow-700">
                    Top 3 customers = 45% of revenue. Needs diversification.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                <Lightbulb className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-green-900">Otherwise Clean</h4>
                  <p className="text-xs text-green-700">
                    No major red flags. Clean cap table and IP ownership.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Comparable Deals */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection('comparables')}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-sm">Comparable Deals</span>
            </div>
            {expandedSections.comparables ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {expandedSections.comparables && (
            <div className="p-4 bg-white space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-xs">AutomateX (2024)</h4>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-bold">
                    Successful Exit
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">Series A, $3M at $15M valuation</p>
                <p className="text-xs font-bold text-green-600">Acquired for $45M (3x return)</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-xs">WorkflowAI (2023)</h4>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-bold">
                    Active
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">Seed, $2M at $10M valuation</p>
                <p className="text-xs font-bold text-blue-600">Now $8M ARR, valued at $60M</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Full Report
        </button>
        <button
          onClick={() => setShowChatModal(true)}
          className="w-full px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Ask AI Questions
        </button>
      </div>

      {/* AI Chat Modal - Placeholder */}
      {showChatModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowChatModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Ask Ignisha AI</h3>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Ask specific questions about this startup's financials, team, market, or any other aspect.
            </p>
            <textarea
              placeholder="e.g., What are the main risks in this investment?"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg resize-none focus:border-purple-600 focus:outline-none"
              rows={4}
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowChatModal(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">
                Send Question
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
