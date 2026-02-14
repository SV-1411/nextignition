import { CreditCard, Download, Copy, Check } from 'lucide-react';
import { brandColors } from '../../utils/colors';
import { useState } from 'react';

export function SubscriptionBillingTab({ userRole }: any) {
  const [copiedRef, setCopiedRef] = useState(false);

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription & Billing</h1>
        <p className="text-gray-600">Manage your subscription plan and payment methods</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 mb-6 text-white shadow-lg">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">Pro Tier</span>
            <h2 className="text-4xl font-bold mt-4">₹999<span className="text-lg font-normal">/month</span></h2>
            <p className="text-white/80 mt-2">Next billing: Feb 15, 2026</p>
            <span className="inline-flex items-center gap-1 mt-2 text-green-300">
              <Check className="w-4 h-4" />
              Active
            </span>
          </div>
          <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-bold hover:bg-white/90">
            Manage Plan
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-white/60 text-sm">AI Queries</p>
            <p className="text-xl font-bold">45/100</p>
          </div>
          <div>
            <p className="text-white/60 text-sm">Storage</p>
            <p className="text-xl font-bold">2.3/5 GB</p>
          </div>
          <div>
            <p className="text-white/60 text-sm">Team Members</p>
            <p className="text-xl font-bold">3/5</p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Payment Method</h2>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-gray-600" />
            <div>
              <p className="font-bold">Visa ending in 1234</p>
              <p className="text-sm text-gray-600">Expires 12/2027</p>
            </div>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
            Update Card
          </button>
        </div>
        <button className="text-sm font-medium hover:underline" style={{ color: brandColors.electricBlue }}>
          + Add Payment Method
        </button>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Billing History</h2>
        <div className="space-y-3">
          {[
            { date: 'Jan 15, 2026', desc: 'Pro Monthly Subscription', amount: '₹999', status: 'Paid' },
            { date: 'Dec 15, 2025', desc: 'Pro Monthly Subscription', amount: '₹999', status: 'Paid' },
            { date: 'Nov 15, 2025', desc: 'Pro Monthly Subscription', amount: '₹999', status: 'Paid' },
          ].map((invoice, i) => (
            <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <p className="font-bold text-sm">{invoice.desc}</p>
                <p className="text-xs text-gray-600">{invoice.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold">{invoice.amount}</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  {invoice.status} ✓
                </span>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Download className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral & Credits */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Referral Program</h2>
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg mb-4">
          <p className="font-bold mb-2">Invite Friends, Get ₹500 Credit</p>
          <div className="flex gap-2">
            <input
              type="text"
              value="https://nextignition.com/ref/johndoe"
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            />
            <button 
              onClick={() => {
                setCopiedRef(true);
                setTimeout(() => setCopiedRef(false), 2000);
              }}
              className="px-4 py-2 rounded-lg font-medium text-white"
              style={{ background: brandColors.electricBlue }}
            >
              {copiedRef ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">3 friends joined</p>
            <p className="font-bold text-lg">₹1,500 earned</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Available credits</p>
            <p className="font-bold text-lg" style={{ color: brandColors.atomicOrange }}>₹1,500</p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white rounded-xl p-6 shadow-sm">
        <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
          Cancel Subscription
        </button>
        <button className="px-6 py-2 rounded-lg font-bold text-white"
          style={{ background: brandColors.electricBlue }}>
          Save Billing Settings
        </button>
      </div>
    </div>
  );
}