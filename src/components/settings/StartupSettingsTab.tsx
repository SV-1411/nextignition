import { useEffect, useState } from 'react';
import { Upload, Trash2, Plus, X, Eye, ChevronDown, ChevronUp, FileText, Video, Download, Send, Lightbulb, Wrench, TrendingUp, Rocket } from 'lucide-react';
import { brandColors } from '../../utils/colors';
import { createStartup, getMyStartups, updateStartup } from '../../services/startupService';

export function StartupSettingsTab({ userRole }: any) {
  const [selectedIndustries, setSelectedIndustries] = useState(['SaaS', 'AI/ML']);
  const [selectedTags, setSelectedTags] = useState(['B2B', 'Enterprise']);
  const [fundingExpanded, setFundingExpanded] = useState(false);
  const [lookingFor, setLookingFor] = useState(['funding', 'mentor']);
  const [startupName, setStartupName] = useState('TechFlow AI');
  const [isLoading, setIsLoading] = useState(true);
  const [startupId, setStartupId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const industries = ['SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'AI/ML', 'Blockchain', 'CleanTech'];
  const tags = ['B2B', 'B2C', 'Enterprise', 'Consumer', 'Mobile', 'Web', 'Hardware'];

  const teamMembers = [
    { name: 'John Doe', role: 'Founder & CEO', email: 'john@startup.com', photo: 'JD' },
    { name: 'Jane Smith', role: 'Co-founder & CTO', email: 'jane@startup.com', photo: 'JS' },
    { name: 'Mike Johnson', role: 'CMO', email: 'mike@startup.com', photo: 'MJ' },
  ];

  const pendingInvites = [
    { email: 'sarah@email.com', role: 'CFO', sentDate: 'Jan 20, 2026' },
  ];

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const startups = await getMyStartups();
        if (startups && startups.length > 0) {
          const startup = startups[0];
          setStartupId(startup._id);
          setStartupName(startup.name);
          // TODO: map other fields
        }
      } catch (error) {
        console.error("Failed to load startup", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStartup();
  }, []);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (startupId) {
        await updateStartup(startupId, {
          name: startupName,
          // Update other fields as implemented in UI
        });
      } else {
        const newStartup = await createStartup({
          name: startupName,
          description: "New Startup", // Default value
          industry: selectedIndustries[0] || "SaaS", // Use first selected industry
        });
        setStartupId(newStartup._id);
      }
      setMessage('Startup settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save startup settings.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Startup Settings</h1>
        <p className="text-gray-600">Manage your startup information and team</p>
        {message && <p className={`mt-2 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
      </div>

      {/* Section 1: Company Information */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Company Information</h2>

        <div className="space-y-4">
          {/* Startup Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Startup Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Company Logo */}
          <div>
            <label className="block text-sm font-medium mb-2">Company Logo</label>
            <div className="flex items-start gap-4">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold cursor-pointer group relative">
                TF
                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Upload a square logo (200×200px recommended)</p>
                <button className="px-4 py-2 rounded-lg font-medium text-sm text-white"
                  style={{ background: brandColors.electricBlue }}>
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload Logo
                </button>
              </div>
            </div>
          </div>

          {/* Tagline/Mission */}
          <div>
            <label className="block text-sm font-medium mb-2">Tagline/Mission Statement</label>
            <textarea
              rows={3}
              defaultValue="Revolutionizing business intelligence with AI-powered insights"
              maxLength={200}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">200 characters max</p>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium mb-2">Industry (Multi-select)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => {
                    if (selectedIndustries.includes(industry)) {
                      setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
                    } else {
                      setSelectedIndustries([...selectedIndustries, industry]);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedIndustries.includes(industry)
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  style={selectedIndustries.includes(industry) ? {
                    background: brandColors.electricBlue
                  } : {}}
                >
                  {industry}
                  {selectedIndustries.includes(industry) && (
                    <X className="w-3 h-3 inline ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sector Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Sector Tags (up to 5)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedTags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-lg text-sm font-medium text-white flex items-center gap-2"
                  style={{ background: brandColors.atomicOrange }}>
                  {tag}
                  <button onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.filter(t => !selectedTags.includes(t)).map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (selectedTags.length < 5) {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                  disabled={selectedTags.length >= 5}
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Company Size & HQ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Company Size</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>1-5</option>
                <option selected>6-10</option>
                <option>11-50</option>
                <option>50+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Headquarters</label>
              <input
                type="text"
                defaultValue="Mumbai, India"
                placeholder="City, Country"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Founded Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Founded Month</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option selected>October</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Founded Year</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option selected>2024</option>
                <option>2023</option>
                <option>2022</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Startup Status */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Startup Status</h2>

        {/* Current Stage */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Current Stage</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'idea', label: 'Idea Stage', icon: Lightbulb },
              { value: 'mvp', label: 'MVP Development', icon: Wrench },
              { value: 'growth', label: 'Growth Stage', icon: TrendingUp },
              { value: 'scaling', label: 'Scaling', icon: Rocket },
            ].map((stage) => (
              <button
                key={stage.value}
                className={`p-4 border-2 rounded-xl text-left transition-all ${stage.value === 'mvp'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <stage.icon className="w-6 h-6 mb-2" style={stage.value === 'mvp' ? { color: brandColors.electricBlue } : {}} />
                <p className="font-bold text-sm">{stage.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Looking For */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Looking For (Multi-select)</label>
          <div className="space-y-2">
            {[
              { value: 'funding', label: '💰 Funding' },
              { value: 'cofounder', label: '🤝 Co-founder' },
              { value: 'mentor', label: '👨‍🏫 Mentor/Expert' },
              { value: 'team', label: '👥 Team Members' },
              { value: 'all', label: '🌐 All of the Above' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lookingFor.includes(option.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setLookingFor([...lookingFor, option.value]);
                    } else {
                      setLookingFor(lookingFor.filter(v => v !== option.value));
                    }
                  }}
                  className="w-4 h-4"
                  style={{ accentColor: brandColors.electricBlue }}
                />
                <span className="font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Funding Status */}
        <div>
          <label className="block text-sm font-medium mb-2">Funding Status</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Bootstrapped</option>
            <option selected>Pre-seed</option>
            <option>Seed</option>
            <option>Series A</option>
            <option>Series B</option>
            <option>Not Fundraising</option>
          </select>
        </div>
      </div>

      {/* Section 3: Funding Requirements */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <button
          onClick={() => setFundingExpanded(!fundingExpanded)}
          className="w-full flex items-center justify-between mb-4"
        >
          <h2 className="text-xl font-bold">Funding Requirements</h2>
          {fundingExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {fundingExpanded && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            {/* Funding Amount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Funding Amount Required</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    defaultValue="5000000"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Equity Offered (%)</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  defaultValue="15"
                  className="w-full"
                  style={{ accentColor: brandColors.electricBlue }}
                />
                <p className="text-center text-sm font-bold mt-1" style={{ color: brandColors.electricBlue }}>15%</p>
              </div>
            </div>

            {/* Use of Funds */}
            <div>
              <label className="block text-sm font-medium mb-2">Use of Funds</label>
              <textarea
                rows={4}
                placeholder="Breakdown of how funds will be used..."
                defaultValue="- Product Development: 40%&#10;- Marketing & Sales: 30%&#10;- Team Expansion: 20%&#10;- Operations: 10%"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Pitch Deck */}
            <div>
              <label className="block text-sm font-medium mb-2">Pitch Deck</label>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-red-500" />
                    <div>
                      <p className="font-medium">pitch_deck_v3.pdf</p>
                      <p className="text-xs text-gray-500">2.4 MB • Uploaded Jan 15, 2026</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Replace Deck
                </button>
              </div>
            </div>

            {/* Pitch Video */}
            <div>
              <label className="block text-sm font-medium mb-2">Pitch Video (2-minute max)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <Video className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-3">No pitch video uploaded</p>
                <button className="px-6 py-2 rounded-lg font-medium text-white"
                  style={{ background: brandColors.electricBlue }}>
                  <Video className="w-4 h-4 inline mr-2" />
                  Record New Pitch
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Team Management */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Team Management</h2>
          <button className="px-4 py-2 rounded-lg font-medium text-white text-sm"
            style={{ background: brandColors.electricBlue }}>
            <Plus className="w-4 h-4 inline mr-2" />
            Invite Team Member
          </button>
        </div>

        {/* Team Members Table */}
        <div className="space-y-3 mb-6">
          {teamMembers.map((member) => (
            <div key={member.email} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-blue-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {member.photo}
                </div>
                <div>
                  <p className="font-bold text-sm">{member.name}</p>
                  <p className="text-xs text-gray-600">{member.role} • {member.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                  Edit Role
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Invitations */}
        {pendingInvites.length > 0 && (
          <>
            <h3 className="font-bold mb-3">Pending Invitations</h3>
            <div className="space-y-2">
              {pendingInvites.map((invite) => (
                <div key={invite.email} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{invite.email}</p>
                    <p className="text-xs text-gray-600">{invite.role} • Sent {invite.sentDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Send className="w-3 h-3 inline mr-1" />
                      Resend
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Section 5: Company Visibility */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Company Visibility</h2>

        <div className="space-y-4">
          {/* Profile Visibility */}
          <div>
            <label className="block text-sm font-medium mb-3">Profile Visibility</label>
            <div className="space-y-2">
              {[
                { value: 'public', label: '🌐 Public', desc: 'Visible to all' },
                { value: 'connections', label: '🔗 Connections Only', desc: 'Only your connections' },
                { value: 'private', label: '🔒 Private', desc: 'Only visible to you' },
              ].map((option) => (
                <label key={option.value} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    defaultChecked={option.value === 'public'}
                    className="mt-1"
                    style={{ accentColor: brandColors.electricBlue }}
                  />
                  <div>
                    <p className="font-medium">{option.label}</p>
                    <p className="text-xs text-gray-600">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Searchable in Funding Portal */}
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <p className="font-medium">Searchable in Funding Portal</p>
              <p className="text-sm text-gray-600">Your startup appears in investor searches</p>
            </div>
            <label className="relative inline-block w-12 h-6">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500 transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
            </label>
          </div>

          {/* Featured Listing */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium">Featured Listing Status</p>
                <p className="text-sm text-gray-600">Current: Basic Listing</p>
              </div>
              <button className="px-4 py-2 rounded-lg font-bold text-white text-sm"
                style={{ background: brandColors.atomicOrange }}>
                Upgrade to Featured - ₹2,999
              </button>
            </div>
            <p className="text-xs text-gray-500">Featured listings appear at the top of search results and get 5x more visibility</p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white rounded-xl p-6 shadow-sm">
        <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
          <Eye className="w-4 h-4" />
          Preview Public Profile
        </button>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg font-bold text-white disabled:opacity-50"
            style={{ background: brandColors.electricBlue }}>
            {isLoading ? 'Saving...' : 'Save Startup Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}