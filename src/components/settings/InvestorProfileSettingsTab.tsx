import { TrendingUp, DollarSign, Target, Briefcase, Plus, X, CheckCircle } from 'lucide-react';
import { brandColors } from '../../utils/colors';
import { useState } from 'react';

export function InvestorProfileSettingsTab({ userRole }: any) {
  const [industries, setIndustries] = useState(['SaaS', 'FinTech', 'AI/ML']);
  const [stages, setStages] = useState(['Pre-seed', 'Seed']);

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Investment Profile Settings</h1>
        <p className="text-gray-600">Manage your investment preferences and portfolio</p>
      </div>

      {/* Section 1: Investor Information */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Investor Information</h2>
        
        <div className="space-y-4">
          {/* Investor Type */}
          <div>
            <label className="block text-sm font-medium mb-3">Investor Type</label>
            <div className="space-y-2">
              {[
                'Individual Angel Investor',
                'Venture Capital Fund',
                'Corporate VC',
                'Family Office',
                'Syndicate Lead'
              ].map((type) => (
                <label key={type} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="radio" 
                    name="investorType" 
                    defaultChecked={type === 'Individual Angel Investor'}
                    style={{ accentColor: brandColors.electricBlue }} 
                  />
                  <span className="font-medium text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* VC Firm Name */}
          <div>
            <label className="block text-sm font-medium mb-2">VC Firm Name (if applicable)</label>
            <input
              type="text"
              placeholder="Enter firm name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Verification Status */}
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-700">Verified Investor ✓</span>
            </div>
            <p className="text-sm text-gray-700">Your investor status has been verified</p>
          </div>
        </div>
      </div>

      {/* Section 2: Investment Focus */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Investment Focus</h2>
        
        <div className="space-y-4">
          {/* Ticket Size */}
          <div>
            <label className="block text-sm font-medium mb-3">Ticket Size</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Minimum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    defaultValue="500000"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Maximum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    defaultValue="5000000"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Typical Check</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    defaultValue="2000000"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preferred Stages */}
          <div>
            <label className="block text-sm font-medium mb-2">Preferred Stages</label>
            <div className="flex flex-wrap gap-2">
              {['Pre-seed', 'Seed', 'Series A', 'Series B+', 'Growth Stage'].map((stage) => (
                <button
                  key={stage}
                  onClick={() => {
                    if (stages.includes(stage)) {
                      setStages(stages.filter(s => s !== stage));
                    } else {
                      setStages([...stages, stage]);
                    }
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    stages.includes(stage)
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={stages.includes(stage) ? {
                    background: brandColors.electricBlue
                  } : {}}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {/* Industry Preferences */}
          <div>
            <label className="block text-sm font-medium mb-2">Industry Preferences</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {industries.map((industry) => (
                <span key={industry} className="px-3 py-1.5 rounded-lg text-sm font-medium text-white flex items-center gap-2"
                  style={{ background: brandColors.electricBlue }}>
                  {industry}
                  <button onClick={() => setIndustries(industries.filter(i => i !== industry))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add industry..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button className="px-4 py-2 rounded-lg font-medium text-white"
                style={{ background: brandColors.electricBlue }}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Geographic Focus */}
          <div>
            <label className="block text-sm font-medium mb-2">Geographic Focus</label>
            <select multiple className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32">
              <option selected>India</option>
              <option>Southeast Asia</option>
              <option>US</option>
              <option>Europe</option>
              <option selected>Global</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>

          {/* Investment Thesis */}
          <div>
            <label className="block text-sm font-medium mb-2">Investment Thesis</label>
            <textarea
              rows={6}
              placeholder="Describe your investment philosophy and what you look for in startups..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
              defaultValue="Focused on early-stage B2B SaaS companies with strong product-market fit and scalable business models. Looking for founding teams with deep domain expertise and clear vision for market disruption."
            />
            <p className="text-xs text-gray-500 mt-1">500 words max</p>
          </div>
        </div>
      </div>

      {/* Section 3: Portfolio Management */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Portfolio Companies</h2>
          <button className="px-4 py-2 rounded-lg font-medium text-white text-sm"
            style={{ background: brandColors.electricBlue }}>
            <Plus className="w-4 h-4 inline mr-2" />
            Add Portfolio Company
          </button>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-5 gap-3 p-3 bg-gray-50 rounded-lg font-medium text-sm text-gray-700">
            <div>Startup Name</div>
            <div>Industry</div>
            <div>Stage</div>
            <div>Investment Date</div>
            <div>Status</div>
          </div>
          
          {[
            { name: 'TechFlow AI', industry: 'AI/ML', stage: 'Seed', date: 'Jan 2024', status: 'Active' },
            { name: 'FinanceHub', industry: 'FinTech', stage: 'Series A', date: 'Sep 2023', status: 'Active' },
            { name: 'HealthAI', industry: 'HealthTech', stage: 'Pre-seed', date: 'Mar 2024', status: 'Active' },
          ].map((company, i) => (
            <div key={i} className="grid grid-cols-5 gap-3 p-3 border border-gray-200 rounded-lg items-center text-sm">
              <div className="font-medium">{company.name}</div>
              <div className="text-gray-600">{company.industry}</div>
              <div><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">{company.stage}</span></div>
              <div className="text-gray-600">{company.date}</div>
              <div><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">{company.status}</span></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Total Investments</p>
            <p className="text-2xl font-bold">15</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Investments</p>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Successful Exits</p>
            <p className="text-2xl font-bold">3</p>
          </div>
        </div>
      </div>

      {/* Section 4: Deal Preferences */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Deal Preferences</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Minimum Traction Required</label>
            <input
              type="text"
              placeholder="e.g., 10K users or ₹5L MRR"
              defaultValue="10K users or ₹5L MRR"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Required Documents</label>
            <div className="space-y-2">
              {['Pitch Deck', 'Business Plan', 'Financial Projections', 'Cap Table'].map((doc) => (
                <label key={doc} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    defaultChecked={doc === 'Pitch Deck'}
                    style={{ accentColor: brandColors.electricBlue }} 
                  />
                  <span className="font-medium text-sm">{doc}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Red Flags / Dealbreakers</label>
            <textarea
              rows={3}
              placeholder="List your dealbreakers..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
              defaultValue="- No single founder startups&#10;- Businesses with regulatory uncertainty&#10;- Pre-revenue with no traction"
            />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-end bg-white rounded-xl p-6 shadow-sm">
        <button className="px-6 py-2 rounded-lg font-bold text-white"
          style={{ background: brandColors.electricBlue }}>
          Save Investment Settings
        </button>
      </div>
    </div>
  );
}
