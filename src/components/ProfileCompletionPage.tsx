import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Check,
  X,
  Upload,
  Camera,
  Linkedin,
  Twitter,
  Github,
  Sparkles,
  Loader2,
  CheckCircle,
  Rocket,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { brandColors } from '../utils/colors';
import logoImage from 'figma:asset/faed1dd832314fe381fd34c35312b9faa571832d.png';

type UserRole = 'founder' | 'expert' | 'investor';

export function ProfileCompletionPage() {
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>(() => {
    // First check if there's a specific profile completion role set
    const profileCompletionRole = sessionStorage.getItem('profileCompletionRole');
    if (profileCompletionRole) {
      // Validate it's a valid role
      const validRole = profileCompletionRole as UserRole;
      if (validRole === 'founder' || validRole === 'expert' || validRole === 'investor') {
        return [validRole];
      }
    }
    // Otherwise check for selectedRoles from signup
    const stored = sessionStorage.getItem('selectedRoles');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Filter out any invalid roles
        const validRoles = parsed.filter((r: any) => r === 'founder' || r === 'expert' || r === 'investor');
        if (validRoles.length > 0) {
          return validRoles;
        }
      } catch (e) {
        console.error('Error parsing selectedRoles:', e);
      }
    }
    return ['founder'];
  });
  
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    const profileCompletionRole = sessionStorage.getItem('profileCompletionRole');
    if (profileCompletionRole) {
      const validRole = profileCompletionRole as UserRole;
      if (validRole === 'founder' || validRole === 'expert' || validRole === 'investor') {
        return validRole;
      }
    }
    return selectedRoles[0];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Common fields
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  
  // Founder fields
  const [hasStartup, setHasStartup] = useState<'yes' | 'no' | 'building'>('building');
  const [startupName, setStartupName] = useState('');
  const [industry, setIndustry] = useState('');
  const [stage, setStage] = useState('');
  const [isFundraising, setIsFundraising] = useState(false);
  const [fundingAmount, setFundingAmount] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [website, setWebsite] = useState('');
  const [pitchDeck, setPitchDeck] = useState('');
  const [location, setLocation] = useState('');
  
  // Expert fields
  const [expertise, setExpertise] = useState('');
  const [experience, setExperience] = useState('');
  const [previousRoles, setPreviousRoles] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [offerConsultations, setOfferConsultations] = useState(false);
  
  // Investor fields
  const [investorType, setInvestorType] = useState('');
  const [firmName, setFirmName] = useState('');
  const [checkSize, setCheckSize] = useState('');
  const [investmentStages, setInvestmentStages] = useState<string[]>([]);
  const [preferredIndustries, setPreferredIndustries] = useState<string[]>([]);

  const roleConfig = {
    founder: {
      title: 'Founder Profile',
      icon: Rocket,
      color: brandColors.electricBlue,
      gradient: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})`
    },
    expert: {
      title: 'Expert Profile',
      icon: TrendingUp,
      color: brandColors.atomicOrange,
      gradient: `linear-gradient(135deg, ${brandColors.atomicOrange}, ${brandColors.electricBlue})`
    },
    investor: {
      title: 'Investor Profile',
      icon: DollarSign,
      color: brandColors.navyBlue,
      gradient: `linear-gradient(135deg, ${brandColors.navyBlue}, ${brandColors.electricBlue})`
    }
  };

  const checkUsername = (value: string) => {
    setUsername(value);
    if (value.length >= 3) {
      setTimeout(() => {
        setUsernameAvailable(Math.random() > 0.3);
      }, 500);
    } else {
      setUsernameAvailable(null);
    }
  };

  const toggleIndustry = (ind: string) => {
    if (preferredIndustries.includes(ind)) {
      setPreferredIndustries(preferredIndustries.filter(i => i !== ind));
    } else {
      setPreferredIndustries([...preferredIndustries, ind]);
    }
  };

  const toggleStage = (stg: string) => {
    if (investmentStages.includes(stg)) {
      setInvestmentStages(investmentStages.filter(s => s !== stg));
    } else {
      setInvestmentStages([...investmentStages, stg]);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      sessionStorage.setItem('isVerified', 'true');
      sessionStorage.removeItem('selectedRoles');
      sessionStorage.removeItem('userBasicInfo');
      window.location.hash = '#founder-dashboard';
    }, 2000);
  };

  const handleBackToDashboard = () => {
    // Get first selected role for navigation
    const primaryRole = selectedRoles[0];
    window.location.hash = `#${primaryRole}-dashboard`;
  };

  const isFormValid = () => {
    if (!username || !linkedinUrl) return false;
    
    if (activeRole === 'founder') {
      return hasStartup === 'yes' ? (startupName && industry && stage) : true;
    }
    if (activeRole === 'expert') {
      return expertise && experience;
    }
    if (activeRole === 'investor') {
      return investorType && checkSize && investmentStages.length > 0;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <div className="w-px h-6 bg-gray-300" />
              <img 
                src={logoImage} 
                alt="NextIgnition" 
                className="h-8 cursor-pointer" 
                onClick={() => window.location.hash = '#'}
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Need help?</span>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Complete Your Profile</h1>
          <p className="text-lg text-gray-600">
            Fill in your details to unlock full platform access
          </p>
        </div>

        {/* Role Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-medium text-gray-700">
              Complete your profile for: <span className="text-blue-600">{selectedRoles.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')}</span>
            </p>
          </div>

          <div className="flex gap-3 border-b border-gray-200">
            {selectedRoles.map((role) => {
              const config = roleConfig[role];
              const RoleIcon = config.icon;
              return (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all relative ${
                    activeRole === role
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <RoleIcon className="w-5 h-5" />
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                  {activeRole === role && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: config.color }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Common Fields Section */}
              <div className="pb-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h3>
                
                {/* LinkedIn URL */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Profile URL <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="linkedin.com/in/yourprofile"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Required for verification</p>
                </div>

                {/* Username */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => checkUsername(e.target.value)}
                      placeholder="johndoe"
                      className="w-full pl-8 pr-12 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {usernameAvailable !== null && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {usernameAvailable ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <X className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {usernameAvailable === false && (
                    <p className="text-xs text-red-500 mt-1">Taken, try: @{username}23</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div className="flex gap-3">
                    <select className="px-3 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>+91</option>
                      <option>+1</option>
                      <option>+44</option>
                    </select>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Role-Specific Fields */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: roleConfig[activeRole].color }}
                  >
                    {(() => {
                      const Icon = roleConfig[activeRole].icon;
                      return <Icon className="w-5 h-5 text-white" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{roleConfig[activeRole].title}</h3>
                    <p className="text-sm text-gray-600">Complete your {activeRole} profile details</p>
                  </div>
                </div>

                {/* FOUNDER FORM */}
                {activeRole === 'founder' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Do you have a startup? <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {(['yes', 'no', 'building'] as const).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setHasStartup(option)}
                            className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                              hasStartup === option
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {hasStartup === 'yes' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Startup Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={startupName}
                            onChange={(e) => setStartupName(e.target.value)}
                            placeholder="Acme Inc."
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Industry <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={industry}
                              onChange={(e) => setIndustry(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            >
                              <option value="">Select...</option>
                              <option>SaaS</option>
                              <option>FinTech</option>
                              <option>HealthTech</option>
                              <option>EdTech</option>
                              <option>E-commerce</option>
                              <option>AI/ML</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Stage <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={stage}
                              onChange={(e) => setStage(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            >
                              <option value="">Select...</option>
                              <option>Idea</option>
                              <option>MVP</option>
                              <option>Growth</option>
                              <option>Scaling</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <div>
                            <p className="font-medium text-gray-900">Are you fundraising?</p>
                            <p className="text-xs text-gray-500">Get matched with investors</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsFundraising(!isFundraising)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              isFundraising ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                isFundraising ? 'translate-x-6' : ''
                              }`}
                            />
                          </button>
                        </div>

                        {isFundraising && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Funding Amount <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={fundingAmount}
                                onChange={(e) => setFundingAmount(e.target.value)}
                                placeholder="₹500000"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Team Size <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                value={teamSize}
                                onChange={(e) => setTeamSize(e.target.value)}
                                min="1"
                                max="100"
                                placeholder="5"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Monthly Revenue <span className="text-gray-400">(Optional)</span>
                              </label>
                              <input
                                type="text"
                                value={monthlyRevenue}
                                onChange={(e) => setMonthlyRevenue(e.target.value)}
                                placeholder="₹100000"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website <span className="text-gray-400">(Optional)</span>
                              </label>
                              <input
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="www.acmeinc.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pitch Deck <span className="text-gray-400">(Optional)</span>
                              </label>
                              <input
                                type="text"
                                value={pitchDeck}
                                onChange={(e) => setPitchDeck(e.target.value)}
                                placeholder="https://drive.google.com/file/d/..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Location <span className="text-gray-400">(Optional)</span>
                              </label>
                              <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Bangalore, India"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* EXPERT FORM */}
                {activeRole === 'expert' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Expertise <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={expertise}
                        onChange={(e) => setExpertise(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      >
                        <option value="">Select...</option>
                        <option>Growth Marketing</option>
                        <option>Product Management</option>
                        <option>Tech/CTO</option>
                        <option>Fundraising</option>
                        <option>Sales</option>
                        <option>Design/UX</option>
                        <option>Operations</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        min="1"
                        max="30"
                        placeholder="10"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Previous Companies/Roles <span className="text-gray-400">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={previousRoles}
                        onChange={(e) => setPreviousRoles(e.target.value)}
                        placeholder="Ex-Google PM, Ex-Stripe Growth"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">Offer paid consultations?</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(e.target.value)}
                            placeholder="₹5000"
                            disabled={!offerConsultations}
                            className="w-32 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                          />
                          <span className="text-xs text-gray-500">per hour</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOfferConsultations(!offerConsultations)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          offerConsultations ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                            offerConsultations ? 'translate-x-6' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}

                {/* INVESTOR FORM */}
                {activeRole === 'investor' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Investor Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={investorType}
                        onChange={(e) => setInvestorType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="">Select...</option>
                        <option>Angel</option>
                        <option>VC</option>
                        <option>Family Office</option>
                        <option>Syndicate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        VC Firm/Fund Name <span className="text-gray-400">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={firmName}
                        onChange={(e) => setFirmName(e.target.value)}
                        placeholder="Acme Ventures"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Typical Check Size <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={checkSize}
                        onChange={(e) => setCheckSize(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="">Select...</option>
                        <option>₹5L - ₹25L</option>
                        <option>₹25L - ₹1Cr</option>
                        <option>₹1Cr+</option>
                        <option>Flexible</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Investment Stage <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Pre-seed', 'Seed', 'Series A', 'Series B+'].map((stg) => (
                          <button
                            key={stg}
                            type="button"
                            onClick={() => toggleStage(stg)}
                            className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                              investmentStages.includes(stg)
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {stg}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Preferred Industries <span className="text-gray-400">(Optional)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'AI/ML'].map((ind) => (
                          <button
                            key={ind}
                            type="button"
                            onClick={() => toggleIndustry(ind)}
                            className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                              preferredIndustries.includes(ind)
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {ind}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-sm text-amber-800">
                        ℹ️ Investor profiles undergo manual verification (24-48 hours)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Enhancements */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Enhancements (Optional)</h3>
                
                <div className="space-y-4">
                  {/* Profile Picture */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="flex-1 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium">Upload</span>
                      </button>
                      <button
                        type="button"
                        className="flex-1 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Camera className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium">Take Photo</span>
                      </button>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={160}
                      rows={3}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        <Sparkles className="w-4 h-4" />
                        Generate with AI
                      </button>
                      <span className="text-xs text-gray-500">{bio.length}/160</span>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={twitterUrl}
                        onChange={(e) => setTwitterUrl(e.target.value)}
                        placeholder="Twitter"
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="GitHub"
                        className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Submit Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className="w-full py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: roleConfig[activeRole].gradient }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Complete Profile
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-center text-sm text-gray-500 mt-3">
              {selectedRoles.length > 1 && activeRole !== selectedRoles[selectedRoles.length - 1] 
                ? `You can complete other profiles later from settings`
                : `Your profile will be reviewed within 24-48 hours`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}