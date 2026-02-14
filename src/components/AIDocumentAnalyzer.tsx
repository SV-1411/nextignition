import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  FileText,
  Send,
  ChevronDown,
  ChevronUp,
  X,
  MessageCircle,
  Info
} from 'lucide-react';
import { useState } from 'react';
import { brandColors } from '../utils/colors';

interface AIDocumentAnalyzerProps {
  documentName: string;
  documentCategory: string;
}

export function AIDocumentAnalyzer({ documentName, documentCategory }: AIDocumentAnalyzerProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [clarificationMessage, setClarificationMessage] = useState('');

  // Mock AI analysis data - in real app, this would come from AI processing
  const analysis = {
    keyMetrics: [
      { label: 'Annual Revenue', value: '$2.3M', trend: 'up', change: '+45%' },
      { label: 'Monthly Burn Rate', value: '$85K', trend: 'down', change: '-12%' },
      { label: 'Runway', value: '18 months', trend: 'neutral', change: '' },
      { label: 'CAC', value: '$245', trend: 'down', change: '-8%' },
      { label: 'LTV', value: '$980', trend: 'up', change: '+22%' },
      { label: 'Gross Margin', value: '68%', trend: 'up', change: '+5%' },
    ],
    anomalies: [
      {
        type: 'warning',
        metric: 'Revenue Growth',
        message: 'Revenue growth decelerated from 52% to 38% in Q3',
        severity: 'medium'
      },
      {
        type: 'alert',
        metric: 'Cash Position',
        message: 'Burn rate increased 15% MoM despite revenue growth',
        severity: 'high'
      }
    ],
    comparisons: [
      {
        metric: 'CAC Payback Period',
        value: '3.2 months',
        industry: '4.5 months',
        status: 'above',
        difference: '29% better'
      },
      {
        metric: 'Net Revenue Retention',
        value: '112%',
        industry: '105%',
        status: 'above',
        difference: '7% better'
      },
      {
        metric: 'R&D Spending',
        value: '32%',
        industry: '25%',
        status: 'below',
        difference: '23% below'
      }
    ]
  };

  const handleRequestClarification = () => {
    if (clarificationMessage.trim()) {
      // In real app, this would send the message to the startup
      console.log('Clarification request:', clarificationMessage);
      setShowClarificationModal(false);
      setClarificationMessage('');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div
          className="p-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">AI Document Analysis</h3>
                <p className="text-xs text-white/80">Analyzing {documentCategory}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white">
                Live
              </span>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-white" />
              ) : (
                <ChevronDown className="w-5 h-5 text-white" />
              )}
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white"
            >
              <div className="p-4 space-y-4">
                {/* Key Metrics Extracted */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <h4 className="font-bold text-gray-900">Key Metrics Extracted</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {analysis.keyMetrics.map((metric, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="text-xs text-gray-600 mb-1">{metric.label}</div>
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-gray-900">{metric.value}</div>
                          {metric.change && (
                            <div className={`flex items-center gap-1 text-xs font-medium ${
                              metric.trend === 'up'
                                ? 'text-green-600'
                                : metric.trend === 'down'
                                ? 'text-red-600'
                                : 'text-gray-600'
                            }`}>
                              {metric.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                              {metric.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                              {metric.change}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Anomaly Detection */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <h4 className="font-bold text-gray-900">Anomaly Detection</h4>
                  </div>
                  <div className="space-y-2">
                    {analysis.anomalies.map((anomaly, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${
                          anomaly.severity === 'high'
                            ? 'bg-red-50 border-red-500'
                            : 'bg-yellow-50 border-yellow-500'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle
                            className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                              anomaly.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                            }`}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-sm text-gray-900">
                                AI noticed: {anomaly.metric}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                  anomaly.severity === 'high'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                              >
                                {anomaly.severity === 'high' ? 'High Priority' : 'Medium Priority'}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700">{anomaly.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Industry Comparison */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-blue-600" />
                    <h4 className="font-bold text-gray-900">Industry Comparison</h4>
                  </div>
                  <div className="space-y-2">
                    {analysis.comparisons.map((comp, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-gray-900">{comp.metric}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold ${
                              comp.status === 'above'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {comp.difference}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <div>
                            <span className="text-gray-600">Your Value: </span>
                            <span className="font-bold text-gray-900">{comp.value}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Industry Avg: </span>
                            <span className="font-bold text-gray-900">{comp.industry}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setShowClarificationModal(true)}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Request Clarification
                  </button>
                  <button
                    className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center gap-2"
                  >
                    <Info className="w-4 h-4" />
                    Details
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Clarification Modal */}
      <AnimatePresence>
        {showClarificationModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Request Clarification</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Ask the startup team about specific metrics or findings
                    </p>
                  </div>
                  <button
                    onClick={() => setShowClarificationModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Question
                </label>
                <textarea
                  value={clarificationMessage}
                  onChange={(e) => setClarificationMessage(e.target.value)}
                  placeholder="e.g., Can you explain the increase in burn rate despite revenue growth?"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg resize-none focus:border-purple-600 focus:outline-none"
                  rows={4}
                />

                {/* Quick Templates */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Quick Templates:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Explain the revenue deceleration',
                      'Clarify burn rate increase',
                      'Provide CAC calculation details'
                    ].map((template, index) => (
                      <button
                        key={index}
                        onClick={() => setClarificationMessage(template)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 transition-colors"
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setShowClarificationModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestClarification}
                  disabled={!clarificationMessage.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
