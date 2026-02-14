import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Sparkles,
  Target,
  Users,
  DollarSign,
  Package,
  TrendingUp,
  Download,
  UserPlus,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { brandColors } from '../utils/colors';

interface IdeationStageFlowProps {
  onBack: () => void;
}

type WizardStep = 1 | 2 | 3 | 4;

export function IdeationStageFlow({ onBack }: IdeationStageFlowProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  
  // Step 1 fields
  const [startupName, setStartupName] = useState('');
  const [oneLiner, setOneLiner] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [targetCustomer, setTargetCustomer] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [inspiration, setInspiration] = useState('');

  // Step 2 - Business Model Canvas
  const [canvasBlocks, setCanvasBlocks] = useState({
    valueProposition: '',
    customerSegments: '',
    revenueStreams: '',
    keyResources: '',
    keyPartners: '',
    costStructure: ''
  });

  // Step 3 - Validation
  const [competitors, setCompetitors] = useState<string[]>(['', '', '', '', '']);
  const [targetGeography, setTargetGeography] = useState('');
  const [customerSegment, setCustomerSegment] = useState('');

  // Step 4 - Co-founders
  const [lookingForCoFounder, setLookingForCoFounder] = useState(true);

  const industries = [
    'SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 
    'AI/ML', 'Web3/Blockchain', 'CleanTech', 'AgriTech', 'DeepTech'
  ];

  const handleIndustryToggle = (industry: string) => {
    if (selectedIndustries.includes(industry)) {
      setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
    } else {
      setSelectedIndustries([...selectedIndustries, industry]);
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as WizardStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep);
    }
  };

  const handleComplete = () => {
    sessionStorage.setItem('hasStartupProfile', 'true');
    sessionStorage.setItem('startupStage', 'ideation');
    onBack();
  };

  const aiSuggestions = [
    'What revenue model works for SaaS?',
    'How do I calculate pricing?',
    'What are common cost structures?',
    'How to identify key partners?'
  ];

  const mockCoFounders = [
    {
      name: 'Sarah Chen',
      role: 'Full-Stack Developer',
      skills: ['React', 'Node.js', 'AWS'],
      location: 'Bangalore',
      matchScore: 95,
      avatar: 'SC'
    },
    {
      name: 'Rahul Sharma',
      role: 'Product Designer',
      skills: ['UI/UX', 'Figma', 'Product Strategy'],
      location: 'Mumbai',
      matchScore: 88,
      avatar: 'RS'
    },
    {
      name: 'Priya Patel',
      role: 'Marketing Specialist',
      skills: ['Growth Marketing', 'SEO', 'Content'],
      location: 'Delhi',
      matchScore: 92,
      avatar: 'PP'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Stage Selection</span>
            </button>
            
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <span className="font-bold">Ideation Stage</span>
            </div>

            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Save className="w-5 h-5" />
              <span className="font-medium">Save Draft</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Step {currentStep} of 4</span>
              <span className="text-sm text-gray-500">{currentStep * 25}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentStep * 25}%` }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full"
                style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Idea Overview */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
                Tell Us About Your Idea
              </h2>
              <p className="text-gray-600 mb-8">
                Let's start with the basics of your startup concept
              </p>

              <div className="space-y-6">
                {/* Startup Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Startup Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    placeholder="The next big thing in FinTech"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* One-Line Pitch */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    One-Line Pitch <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={oneLiner}
                    onChange={(e) => setOneLiner(e.target.value)}
                    placeholder="We help small businesses automate invoicing with AI"
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="mt-1 text-xs text-gray-500 text-right">
                    {oneLiner.length}/100 characters
                  </div>
                </div>

                {/* Problem Statement */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Problem Statement <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="What problem are you solving?"
                    maxLength={300}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="mt-1 text-xs text-gray-500 text-right">
                    {problemStatement.length}/300 characters
                  </div>
                </div>

                {/* Target Customer */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Target Customer <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={targetCustomer}
                    onChange={(e) => setTargetCustomer(e.target.value)}
                    placeholder="Who is your ideal customer?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Industry/Sector */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Industry/Sector <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
                  <div className="flex flex-wrap gap-2">
                    {industries.map((industry) => (
                      <button
                        key={industry}
                        onClick={() => handleIndustryToggle(industry)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          selectedIndustries.includes(industry)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inspiration */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Inspiration <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    value={inspiration}
                    onChange={(e) => setInspiration(e.target.value)}
                    placeholder="What inspired this idea?"
                    maxLength={200}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="mt-1 text-xs text-gray-500 text-right">
                    {inspiration.length}/200 characters
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Business Model Canvas */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
                  Build Your Business Model
                </h2>
                <p className="text-gray-600 mb-8">
                  Define the key components of your business model
                </p>

                {/* Business Model Canvas Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Value Proposition */}
                  <div className="col-span-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <label className="text-sm font-bold text-gray-700">
                        Value Proposition
                      </label>
                    </div>
                    <textarea
                      value={canvasBlocks.valueProposition}
                      onChange={(e) => setCanvasBlocks({ ...canvasBlocks, valueProposition: e.target.value })}
                      placeholder="What unique value do you offer to customers?"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Customer Segments */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-orange-600" />
                      <label className="text-sm font-bold text-gray-700">
                        Customer Segments
                      </label>
                    </div>
                    <textarea
                      value={canvasBlocks.customerSegments}
                      onChange={(e) => setCanvasBlocks({ ...canvasBlocks, customerSegments: e.target.value })}
                      placeholder="Who are your different customer groups?"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Revenue Streams */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <label className="text-sm font-bold text-gray-700">
                        Revenue Streams
                      </label>
                    </div>
                    <textarea
                      value={canvasBlocks.revenueStreams}
                      onChange={(e) => setCanvasBlocks({ ...canvasBlocks, revenueStreams: e.target.value })}
                      placeholder="How will you make money?"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Key Resources */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      <label className="text-sm font-bold text-gray-700">
                        Key Resources
                      </label>
                    </div>
                    <textarea
                      value={canvasBlocks.keyResources}
                      onChange={(e) => setCanvasBlocks({ ...canvasBlocks, keyResources: e.target.value })}
                      placeholder="What key resources do you need?"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Key Partners */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <UserPlus className="w-5 h-5 text-indigo-600" />
                      <label className="text-sm font-bold text-gray-700">
                        Key Partners
                      </label>
                    </div>
                    <textarea
                      value={canvasBlocks.keyPartners}
                      onChange={(e) => setCanvasBlocks({ ...canvasBlocks, keyPartners: e.target.value })}
                      placeholder="Who are your key partners and suppliers?"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Cost Structure */}
                  <div className="col-span-full">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-red-600" />
                      <label className="text-sm font-bold text-gray-700">
                        Cost Structure
                      </label>
                    </div>
                    <textarea
                      value={canvasBlocks.costStructure}
                      onChange={(e) => setCanvasBlocks({ ...canvasBlocks, costStructure: e.target.value })}
                      placeholder="What are your main costs?"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* AI Assistant Sidebar */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-gray-900">Ask Ignisha for Suggestions</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Get AI-powered insights to refine your business model
                </p>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-4 py-2 bg-white rounded-lg text-sm hover:bg-purple-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Validation & Market Research */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
                Validate Your Market
              </h2>
              <p className="text-gray-600 mb-8">
                Research your competition and market opportunity
              </p>

              <div className="space-y-8">
                {/* Competitor Analysis */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Competitor Analysis</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Enter up to 5 competitor names or URLs
                  </p>
                  <div className="space-y-3">
                    {competitors.map((competitor, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={competitor}
                        onChange={(e) => {
                          const newCompetitors = [...competitors];
                          newCompetitors[idx] = e.target.value;
                          setCompetitors(newCompetitors);
                        }}
                        placeholder={`Competitor ${idx + 1}`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ))}
                  </div>
                  <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                    Analyze Competitors with AI
                  </button>
                </div>

                {/* Market Size Calculator */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Market Size Estimation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Target Geography
                      </label>
                      <input
                        type="text"
                        value={targetGeography}
                        onChange={(e) => setTargetGeography(e.target.value)}
                        placeholder="e.g., India, USA, Global"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Customer Segment
                      </label>
                      <input
                        type="text"
                        value={customerSegment}
                        onChange={(e) => setCustomerSegment(e.target.value)}
                        placeholder="e.g., SMBs, Enterprises"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors">
                    Calculate Market Size
                  </button>
                </div>

                {/* Export Options */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold mb-1">Market Research Report</h4>
                      <p className="text-sm text-gray-600">
                        Download a comprehensive PDF report of your research
                      </p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Co-founder Matching */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
                Find Your Co-Founder
              </h2>
              <p className="text-gray-600 mb-8">
                AI-matched potential co-founders based on your startup idea
              </p>

              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lookingForCoFounder}
                    onChange={(e) => setLookingForCoFounder(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="font-medium">I'm looking for a co-founder</span>
                </label>
              </div>

              {lookingForCoFounder && (
                <div className="space-y-4">
                  {mockCoFounders.map((cofounder, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {cofounder.avatar}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{cofounder.name}</h3>
                            <p className="text-gray-600">{cofounder.role}</p>
                            <p className="text-sm text-gray-500">{cofounder.location}</p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-bold text-sm">
                          {cofounder.matchScore}% Match
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {cofounder.skills.map((skill, skillIdx) => (
                          <span
                            key={skillIdx}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                          View Profile
                        </button>
                        <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                          Connect
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {!lookingForCoFounder && (
                <div className="text-center py-12 text-gray-500">
                  <UserPlus className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>You can always find co-founders later from your dashboard</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-colors"
              style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
            >
              Save & Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-colors"
              style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
            >
              <CheckCircle className="w-5 h-5" />
              Complete Profile
            </button>
          )}
        </div>

        {/* Completion Modal (would show after step 4) */}
        {currentStep === 4 && (
          <div className="mt-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 text-center border border-green-200">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Your Ideation Profile is Complete! 🎉</h3>
            <p className="text-gray-600 mb-6">
              Here's what you can do next to move forward
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button className="p-4 bg-white rounded-xl hover:shadow-md transition-shadow text-left">
                <div className="font-bold mb-1">Schedule a mentor consultation</div>
                <div className="text-sm text-gray-600">Get expert guidance on your idea</div>
              </button>
              <button className="p-4 bg-white rounded-xl hover:shadow-md transition-shadow text-left">
                <div className="font-bold mb-1">Join #ideation community</div>
                <div className="text-sm text-gray-600">Connect with fellow founders</div>
              </button>
              <button className="p-4 bg-white rounded-xl hover:shadow-md transition-shadow text-left">
                <div className="font-bold mb-1">Attend 'Idea to MVP' webinar</div>
                <div className="text-sm text-gray-600">Learn the next steps</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
