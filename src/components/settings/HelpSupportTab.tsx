import { Search, Mail, MessageCircle, FileText, Video, ExternalLink } from 'lucide-react';
import { brandColors } from '../../utils/colors';

export function HelpSupportTab({ userRole }: any) {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
        <p className="text-gray-600">Get help and find answers to your questions</p>
      </div>

      {/* Search Help */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="How can we help you?"
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Quick Links</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '🚀', label: 'Getting Started' },
            { icon: '📝', label: 'Creating Your Startup Profile' },
            { icon: '💰', label: 'Funding Portal Guide' },
            { icon: '💬', label: 'Using Communities' },
            { icon: '🤝', label: 'Finding Co-founders' },
            { icon: '📊', label: 'Understanding Analytics' },
          ].map((item, i) => (
            <button
              key={i}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Support Tier */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-lg">Your Support Level: Pro Tier</h3>
            <p className="text-sm text-gray-600">Email support with 24-hour response time</p>
          </div>
          <button className="px-4 py-2 rounded-lg font-medium text-white"
            style={{ background: brandColors.electricBlue }}>
            <Mail className="w-4 h-4 inline mr-2" />
            Email Support
          </button>
        </div>
        <p className="text-sm text-gray-600">
          💡 Upgrade to Elite tier for instant live chat support
        </p>
      </div>

      {/* Contact Options */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Contact Options</h2>
        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-bold mb-2">📧 Email Support</h3>
            <p className="text-sm text-gray-600 mb-3">Average response time: 24 hours</p>
            <textarea
              placeholder="Describe your issue..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 resize-none"
            />
            <button className="px-4 py-2 rounded-lg font-medium text-white"
              style={{ background: brandColors.electricBlue }}>
              Submit Ticket
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="font-bold mb-2">💬 Community Help</h3>
            <p className="text-sm text-gray-600 mb-3">Get help from other founders</p>
            <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Ask in #help channel
            </button>
          </div>
        </div>
      </div>

      {/* Platform Status */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Platform Status</h2>
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-green-700">All systems operational ✓</span>
          </div>
          <button className="text-sm font-medium hover:underline" style={{ color: brandColors.electricBlue }}>
            View detailed status <ExternalLink className="w-3 h-3 inline" />
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="text-center text-sm text-gray-600">
          <p>NextIgnition v1.2.4</p>
          <p className="mt-1">Last Updated: Jan 15, 2026</p>
          <div className="flex justify-center gap-4 mt-3">
            <a href="#" className="hover:underline" style={{ color: brandColors.electricBlue }}>Documentation</a>
            <a href="#" className="hover:underline" style={{ color: brandColors.electricBlue }}>API Docs</a>
            <a href="#" className="hover:underline" style={{ color: brandColors.electricBlue }}>Community Forum</a>
          </div>
        </div>
      </div>
    </div>
  );
}
