import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Check,
  Upload,
  Calendar,
  DollarSign,
  Shield,
  Clock,
  Users,
  Wrench,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { brandColors } from '../utils/colors';

interface MVPDevelopmentFlowProps {
  onBack: () => void;
}

export function MVPDevelopmentFlow({ onBack }: MVPDevelopmentFlowProps) {
  // Form State
  const [businessType, setBusinessType] = useState<'service' | 'product' | ''>('');
  const [startupName, setStartupName] = useState('');
  const [productType, setProductType] = useState<string[]>([]);
  const [productDescription, setProductDescription] = useState('');
  const [coreFeatures, setCoreFeatures] = useState<Array<{name: string; description: string; priority: string}>>([
    { name: '', description: '', priority: 'critical' }
  ]);
  const [designPreference, setDesignPreference] = useState<string[]>([]);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [integrations, setIntegrations] = useState<string[]>([]);
  const [databaseComplexity, setDatabaseComplexity] = useState('simple');
  const [expectedUserLoad, setExpectedUserLoad] = useState('small');
  const [timeline, setTimeline] = useState('2-months');
  const [budgetRange, setBudgetRange] = useState('100k-250k');
  const [fundingStatus, setFundingStatus] = useState('bootstrapped');
  const [postLaunchSupport, setPostLaunchSupport] = useState<string[]>(['1-month-free']);
  const [trainingNeeded, setTrainingNeeded] = useState<string[]>([]);
  const [referenceProducts, setReferenceProducts] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [preferredComm, setPreferredComm] = useState<string[]>([]);

  // Pricing Calculation
  const calculatePricing = () => {
    let basePrice = 75000;
    let additionalCosts = 0;

    // Product type additions
    if (productType.includes('mobile-both')) additionalCosts += 40000;
    else if (productType.includes('mobile-ios') || productType.includes('mobile-android')) additionalCosts += 20000;

    // Integrations
    if (integrations.includes('payment')) additionalCosts += 10000;
    if (integrations.includes('auth')) additionalCosts += 5000;
    if (integrations.includes('email')) additionalCosts += 3000;
    if (integrations.includes('sms')) additionalCosts += 3000;

    // Design
    if (designPreference.includes('need-design')) additionalCosts += 25000;

    // Timeline premium
    if (timeline === 'asap') additionalCosts += 15000;

    // Support
    if (postLaunchSupport.includes('3-month')) additionalCosts += 45000;
    else if (postLaunchSupport.includes('6-month')) additionalCosts += 72000;

    // Database complexity
    if (databaseComplexity === 'complex') additionalCosts += 15000;
    else if (databaseComplexity === 'moderate') additionalCosts += 8000;

    const subtotal = basePrice + additionalCosts;
    
    // Discounts
    let discount = 0;
    // Elite tier discount (mock)
    discount += subtotal * 0.1; // 10% discount
    
    const total = subtotal - discount;

    return {
      base: basePrice,
      additional: additionalCosts,
      subtotal,
      discount,
      total
    };
  };

  const pricing = calculatePricing();

  const addFeature = () => {
    setCoreFeatures([...coreFeatures, { name: '', description: '', priority: 'important' }]);
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const updated = [...coreFeatures];
    updated[index] = { ...updated[index], [field]: value };
    setCoreFeatures(updated);
  };

  const toggleArrayValue = (arr: string[], value: string, setter: (arr: string[]) => void) => {
    if (arr.includes(value)) {
      setter(arr.filter(v => v !== value));
    } else {
      setter([...arr, value]);
    }
  };

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
              <Wrench className="w-5 h-5 text-orange-600" />
              <span className="font-bold">MVP Development Service</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-bold rounded-full">
                Elite Tier Exclusive
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Form + Pricing Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel: Form (60%) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Project Overview */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
                Project Overview
              </h2>

              <div className="space-y-6">
                {/* Business Type */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Business Type
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'service', label: 'Service' },
                      { value: 'product', label: 'Product' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="businessType"
                          checked={businessType === option.value}
                          onChange={() => setBusinessType(option.value as 'service' | 'product')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Startup Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Startup Name
                  </label>
                  <input
                    type="text"
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    placeholder="Your startup name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Product Type */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    {businessType === 'service' ? 'Service Type' : businessType === 'product' ? 'Product Type' : 'Product/Service Type'}
                  </label>
                  {!businessType && (
                    <p className="text-sm text-gray-500 mb-3">Please select business type first</p>
                  )}
                  {businessType === 'service' && (
                    <div className="space-y-2">
                      {[
                        { value: 'web-app', label: 'Web App' },
                        { value: 'mobile-ios', label: 'Mobile App (iOS)' },
                        { value: 'mobile-android', label: 'Mobile App (Android)' },
                        { value: 'mobile-both', label: 'Mobile App (Both)' },
                        { value: 'chrome-ext', label: 'Chrome Extension' },
                        { value: 'desktop', label: 'Desktop App' },
                        { value: 'api', label: 'API/Backend Service' },
                        { value: 'saas-platform', label: 'SaaS Platform' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="productType"
                            checked={productType.includes(option.value)}
                            onChange={() => setProductType([option.value])}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {businessType === 'product' && (
                    <div className="space-y-2">
                      {[
                        { value: 'physical-product', label: 'Physical Product' },
                        { value: 'consumer-goods', label: 'Consumer Goods' },
                        { value: 'hardware-device', label: 'Hardware Device' },
                        { value: 'iot-device', label: 'IoT Device' },
                        { value: 'electronics', label: 'Electronics' },
                        { value: 'wearable', label: 'Wearable Technology' },
                        { value: 'smart-home', label: 'Smart Home Product' },
                        { value: 'other-product', label: 'Other Physical Product' }
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="productType"
                            checked={productType.includes(option.value)}
                            onChange={() => setProductType([option.value])}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Product Description
                  </label>
                  <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="What does your MVP do? Who is it for? What problem does it solve?"
                    rows={6}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="mt-1 text-xs text-gray-500 text-right">
                    {productDescription.length}/500 words
                  </div>
                </div>

                {/* Core Features */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Core Features (Must-Have)
                  </label>
                  <div className="space-y-4">
                    {coreFeatures.map((feature, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <input
                          type="text"
                          value={feature.name}
                          onChange={(e) => updateFeature(idx, 'name', e.target.value)}
                          placeholder="Feature name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <textarea
                          value={feature.description}
                          onChange={(e) => updateFeature(idx, 'description', e.target.value)}
                          placeholder="Description (200 chars)"
                          maxLength={200}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <select
                          value={feature.priority}
                          onChange={(e) => updateFeature(idx, 'priority', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="critical">Critical</option>
                          <option value="important">Important</option>
                          <option value="nice-to-have">Nice-to-have</option>
                        </select>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addFeature}
                    className="mt-3 px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    + Add Feature
                  </button>
                </div>

                {/* Design Preferences */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Design Preferences
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'have-designs', label: 'I have designs (upload Figma/Adobe link)' },
                      { value: 'need-design', label: 'I need UI/UX design (additional cost)' },
                      { value: 'templates', label: 'Use pre-built templates (cost-effective)' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={designPreference.includes(option.value)}
                          onChange={() => toggleArrayValue(designPreference, option.value, setDesignPreference)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {designPreference.includes('have-designs') && (
                    <div className="mt-3">
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Upload className="w-4 h-4" />
                        Upload Design Files
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Technical Requirements */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
                Technical Requirements
              </h2>

              <div className="space-y-6">
                {/* Tech Stack */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Preferred Tech Stack (Optional)
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'react', label: 'React/Next.js' },
                      { value: 'flutter', label: 'Flutter/React Native' },
                      { value: 'backend', label: 'Node.js/Python backend' },
                      { value: 'firebase', label: 'Firebase/Supabase' },
                      { value: 'no-pref', label: 'No preference (let experts decide)' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={techStack.includes(option.value)}
                          onChange={() => toggleArrayValue(techStack, option.value, setTechStack)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Integrations */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Integrations Needed
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'payment', label: 'Payment (Stripe/Razorpay)' },
                      { value: 'auth', label: 'Authentication (OAuth)' },
                      { value: 'email', label: 'Email (SendGrid)' },
                      { value: 'sms', label: 'SMS (Twilio)' },
                      { value: 'analytics', label: 'Analytics (GA)' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={integrations.includes(option.value)}
                          onChange={() => toggleArrayValue(integrations, option.value, setIntegrations)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Database Requirements */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Database Requirements
                  </label>
                  <select
                    value={databaseComplexity}
                    onChange={(e) => setDatabaseComplexity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="simple">Simple (user data, content)</option>
                    <option value="moderate">Moderate (relational data, reports)</option>
                    <option value="complex">Complex (real-time, high volume)</option>
                  </select>
                </div>

                {/* User Load */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Expected User Load
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'small', label: '< 1,000 users (MVP testing)' },
                      { value: 'medium', label: '1,000 - 10,000 users' },
                      { value: 'large', label: '10,000+ users (scalable architecture)' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="userLoad"
                          value={option.value}
                          checked={expectedUserLoad === option.value}
                          onChange={(e) => setExpectedUserLoad(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Timeline & Budget */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
                Timeline & Budget
              </h2>

              <div className="space-y-6">
                {/* Timeline */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Desired Launch Timeline
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="asap">ASAP (4-6 weeks - premium pricing)</option>
                    <option value="2-months">2 months</option>
                    <option value="3-months">3 months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                {/* Funding Status */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Funding Status
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'bootstrapped', label: 'Bootstrapped' },
                      { value: 'pre-seed', label: 'Pre-seed raised' },
                      { value: 'seed', label: 'Seed funded' },
                      { value: 'looking', label: 'Looking for funding (deferred payment option)' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="funding"
                          value={option.value}
                          checked={fundingStatus === option.value}
                          onChange={(e) => setFundingStatus(e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Support & Training */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
                Support & Maintenance
              </h2>

              <div className="space-y-6">
                {/* Post-Launch Support */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Post-Launch Support
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: '1-month-free', label: '1-month free support (included)' },
                      { value: '3-month', label: '3-month support plan (₹15,000/month)' },
                      { value: '6-month', label: '6-month support plan (₹12,000/month)' },
                      { value: 'on-demand', label: 'On-demand support only' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="support"
                          checked={postLaunchSupport.includes(option.value)}
                          onChange={() => setPostLaunchSupport([option.value])}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Training */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Training Needed
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'admin', label: 'Admin panel training' },
                      { value: 'docs', label: 'Technical documentation' },
                      { value: 'videos', label: 'Video tutorials' },
                      { value: 'onboarding', label: 'Live onboarding session' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={trainingNeeded.includes(option.value)}
                          onChange={() => toggleArrayValue(trainingNeeded, option.value, setTrainingNeeded)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Additional Info */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
                Additional Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Reference Products
                  </label>
                  <input
                    type="text"
                    value={referenceProducts}
                    onChange={(e) => setReferenceProducts(e.target.value)}
                    placeholder="Products you admire (URLs or names)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Special Requirements
                  </label>
                  <textarea
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    placeholder="Any other details we should know?"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Pricing Calculator (40%) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Pricing Widget */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100">
                <h3 className="text-xl font-bold mb-4">Your Estimated Quote</h3>
                <p className="text-sm text-gray-600 mb-6">Final pricing after expert review</p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Base MVP Development</span>
                    <span className="font-bold">₹{pricing.base.toLocaleString()}</span>
                  </div>

                  {pricing.additional > 0 && (
                    <>
                      <div className="border-t border-gray-200 pt-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">Additional Features:</div>
                        {integrations.includes('payment') && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Payment integration</span>
                            <span>+₹10,000</span>
                          </div>
                        )}
                        {productType.includes('mobile-both') && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Mobile app (both platforms)</span>
                            <span>+₹40,000</span>
                          </div>
                        )}
                        {designPreference.includes('need-design') && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Custom UI/UX design</span>
                            <span>+₹25,000</span>
                          </div>
                        )}
                        {timeline === 'asap' && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Timeline Premium (ASAP)</span>
                            <span>+₹15,000</span>
                          </div>
                        )}
                        {postLaunchSupport.includes('3-month') && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Post-launch support (3 months)</span>
                            <span>+₹45,000</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between font-medium">
                      <span>Subtotal</span>
                      <span>₹{pricing.subtotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {pricing.discount > 0 && (
                    <div className="border-t border-gray-200 pt-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">Discounts:</div>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Elite Tier discount (10%)</span>
                        <span>-₹{Math.round(pricing.discount).toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <div className="border-t-2 border-gray-300 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Estimate</span>
                      <span className="text-blue-600">₹{Math.round(pricing.total).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h4 className="font-bold text-sm mb-3">Payment Options:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Upfront (5% discount)</span>
                      <span className="font-medium">₹{Math.round(pricing.total * 0.95).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>50-50 milestone</span>
                      <span className="font-medium">₹{Math.round(pricing.total / 2).toLocaleString()} × 2</span>
                    </div>
                    <div className="flex justify-between">
                      <span>3 installments</span>
                      <span className="font-medium">₹{Math.round(pricing.total / 3).toLocaleString()} × 3</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  className="w-full py-4 rounded-xl font-bold text-white text-lg mb-4"
                  style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                >
                  Submit MVP Request
                </button>

                <div className="space-y-2">
                  <button className="w-full text-sm text-blue-600 hover:underline">
                    Save as Draft
                  </button>
                  <button className="w-full text-sm text-blue-600 hover:underline">
                    Schedule a Free Consultation First
                  </button>
                </div>
              </div>

              {/* What Happens Next */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="font-bold mb-4">What Happens Next</h4>
                <div className="space-y-3 text-sm">
                  {[
                    { icon: Clock, text: 'Our team reviews within 24 hours', color: 'text-blue-600' },
                    { icon: Users, text: 'Matched with tech experts', color: 'text-orange-600' },
                    { icon: Calendar, text: '30-min requirement discussion', color: 'text-green-600' },
                    { icon: DollarSign, text: 'Final quote with timeline', color: 'text-purple-600' },
                    { icon: Wrench, text: 'Development kickoff', color: 'text-indigo-600' },
                    { icon: Sparkles, text: 'Launch & handover', color: 'text-pink-600' }
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <step.icon className={`w-5 h-5 ${step.color} flex-shrink-0 mt-0.5`} />
                      <span className="text-gray-700">{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Signals */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="font-medium">100% money-back guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span>Average delivery: 6-8 weeks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <span>15+ MVPs built for NextIgnition founders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}