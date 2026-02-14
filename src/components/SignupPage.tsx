import image_744162bc82319afa7a749a9a028b8441f984363d from 'figma:asset/744162bc82319afa7a749a9a028b8441f984363d.png';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Rocket, Lightbulb, DollarSign, CheckCircle, Target, TrendingUp, Users, Star, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import logoImage from 'figma:asset/faed1dd832314fe381fd34c35312b9faa571832d.png';
import { brandColors } from '../utils/colors';
import { ImageWithFallback } from './figma/ImageWithFallback';

type SignupStep = 'role-selection' | 'account-details';

interface UserRole {
  id: 'founder' | 'expert' | 'investor';
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
  benefits: string[];
}

import { register } from '../services/authService';

export function SignupPage() {
  const [currentStep, setCurrentStep] = useState<SignupStep>('role-selection');
  const [selectedRoles, setSelectedRoles] = useState<Array<'founder' | 'expert' | 'investor'>>([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles: UserRole[] = [
    {
      id: 'founder',
      title: 'Founder / Co-founder',
      subtitle: '🚀',
      description: 'Build your startup, find co-founders, raise funding, get mentorship',
      icon: Rocket,
      color: brandColors.electricBlue,
      benefits: ['Pitch to investors', 'Find co-founders', 'Expert mentorship']
    },
    {
      id: 'expert',
      title: 'Expert / Mentor',
      subtitle: '💡',
      description: 'Share your expertise, mentor startups, earn revenue, build your brand',
      icon: Lightbulb,
      color: brandColors.atomicOrange,
      benefits: ['Monetize expertise', 'Build reputation', 'Flexible schedule']
    },
    {
      id: 'investor',
      title: 'Investor/VC',
      subtitle: '💰',
      description: 'Discover startups, access pitch decks, manage deal flow, co-invest',
      icon: DollarSign,
      color: brandColors.navyBlue,
      benefits: ['Curated deal flow', 'Due diligence tools', 'Co-investment network']
    }
  ];

  const testimonials = [
    {
      role: 'Founder',
      quote: 'Found my co-founder in 2 weeks',
      author: 'Priya Sharma',
      company: 'TechStart AI',
      avatar: 'PS',
      color: brandColors.electricBlue
    },
    {
      role: 'Expert',
      quote: 'Earned ₹2L in my first month',
      author: 'Rajesh Kumar',
      company: 'Marketing Expert',
      avatar: 'RK',
      color: brandColors.atomicOrange
    },
    {
      role: 'Investor',
      quote: 'Discovered 15 high-quality deals',
      author: 'Ananya Patel',
      company: 'Angel Investor',
      avatar: 'AP',
      color: brandColors.navyBlue
    }
  ];

  // Rotate testimonials
  useState(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  });

  const toggleRole = (roleId: 'founder' | 'expert' | 'investor') => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter(r => r !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const handleRoleSubmit = () => {
    if (selectedRoles.length > 0) {
      setCurrentStep('account-details');
    }
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // For now, take the first selected role as the primary role
      const primaryRole = selectedRoles[0];
      const data = await register({
        name: fullName,
        email,
        password,
        role: primaryRole,
        roles: selectedRoles
      });

      // Store info for profile completion if needed
      sessionStorage.setItem('selectedRoles', JSON.stringify(selectedRoles));
      sessionStorage.setItem('userBasicInfo', JSON.stringify({ fullName, email }));

      // Redirect to dashboard
      window.location.hash = `#${data.role}-dashboard`;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    // After social auth, should go to role selection if roles not selected
    if (selectedRoles.length === 0) {
      setCurrentStep('role-selection');
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* LEFT PANEL - Branding & Testimonials */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-12 flex-col justify-between relative overflow-hidden sticky top-0 h-screen">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <img src={image_744162bc82319afa7a749a9a028b8441f984363d} alt="NextIgnition" className="h-10 cursor-pointer" onClick={() => window.location.hash = '#'} />
          </motion.div>

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Join the Startup<br />Ecosystem
            </h1>
            <p className="text-xl text-gray-300 max-w-lg">
              Choose your path to connect, build, and grow
            </p>
          </motion.div>

          {/* Rotating Testimonials */}
          <div className="relative h-48">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ backgroundColor: testimonials[activeTestimonial].color }}
                    >
                      {testimonials[activeTestimonial].avatar}
                    </div>
                    <div>
                      <p className="text-white text-lg font-semibold mb-1">
                        "{testimonials[activeTestimonial].quote}"
                      </p>
                      <p className="text-gray-300 text-sm">
                        {testimonials[activeTestimonial].author}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {testimonials[activeTestimonial].company} • {testimonials[activeTestimonial].role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Dots */}
            <div className="absolute -bottom-8 left-0 flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === activeTestimonial ? 'bg-white w-6' : 'bg-white/40'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 flex items-center gap-4"
        >
          <div className="flex -space-x-2">
            {['#3B82F6', '#F97316', '#10B981', '#8B5CF6', '#EC4899'].map((color, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: color }}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div>
            <p className="text-white font-semibold">5,000+ founders, experts, and investors</p>
            <p className="text-gray-400 text-sm">Join the community today</p>
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANEL - Role Selection / Account Details */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto min-h-screen">
        <div className="w-full max-w-2xl">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <img src={logoImage} alt="NextIgnition" className="h-8" />
          </div>

          <AnimatePresence mode="wait">
            {currentStep === 'role-selection' ? (
              <motion.div
                key="role-selection"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Header */}
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">I am a...</h2>
                  <p className="text-gray-600">Select your role(s) - you can choose multiple</p>
                </div>

                {/* Role Cards */}
                <div className="space-y-4 mb-8">
                  {roles.map((role, index) => (
                    <motion.div
                      key={role.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <button
                        onClick={() => toggleRole(role.id)}
                        className={`w-full p-6 rounded-2xl border-2 transition-all text-left group hover:shadow-lg ${selectedRoles.includes(role.id)
                          ? 'border-current shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                          }`}
                        style={{
                          borderColor: selectedRoles.includes(role.id) ? role.color : undefined
                        }}
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div
                            className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl flex-shrink-0 transition-transform group-hover:scale-110"
                            style={{
                              backgroundColor: selectedRoles.includes(role.id) ? role.color : `${role.color}20`,
                            }}
                          >
                            <span>{role.subtitle}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{role.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{role.description}</p>

                            {/* Benefits */}
                            <div className="flex flex-wrap gap-2">
                              {role.benefits.map((benefit) => (
                                <span
                                  key={benefit}
                                  className="px-3 py-1 rounded-full text-xs font-medium border"
                                  style={{
                                    backgroundColor: selectedRoles.includes(role.id) ? `${role.color}15` : '#f3f4f6',
                                    borderColor: selectedRoles.includes(role.id) ? `${role.color}40` : '#e5e7eb',
                                    color: selectedRoles.includes(role.id) ? role.color : '#6b7280'
                                  }}
                                >
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Checkbox */}
                          <div className="flex-shrink-0">
                            <div
                              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${selectedRoles.includes(role.id)
                                ? 'border-transparent'
                                : 'border-gray-300'
                                }`}
                              style={{
                                backgroundColor: selectedRoles.includes(role.id) ? role.color : 'transparent'
                              }}
                            >
                              {selectedRoles.includes(role.id) && (
                                <CheckCircle className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Continue Button */}
                <motion.button
                  onClick={handleRoleSubmit}
                  disabled={selectedRoles.length === 0}
                  whileHover={selectedRoles.length > 0 ? { scale: 1.02 } : {}}
                  whileTap={selectedRoles.length > 0 ? { scale: 0.98 } : {}}
                  className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${selectedRoles.length === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r hover:shadow-xl'
                    }`}
                  style={
                    selectedRoles.length > 0
                      ? {
                        background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})`
                      }
                      : undefined
                  }
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                {/* Login Link */}
                <p className="text-center mt-6 text-sm text-gray-600">
                  Already have an account?{' '}
                  <a href="#login" className="font-semibold" style={{ color: brandColors.electricBlue }}>
                    Log in
                  </a>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="account-details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Back Button */}
                <button
                  onClick={() => setCurrentStep('role-selection')}
                  className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span className="text-sm font-medium">Back to role selection</span>
                </button>

                {/* Header */}
                <div className="mb-8">
                  <p className="text-gray-600">
                    You selected:{' '}
                    <span className="font-semibold">
                      {selectedRoles.map(roleId => roles.find(r => r.id === roleId)?.title).join(', ')}
                    </span>
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 rotate-180" />
                    {error}
                  </div>
                )}

                {/* Account Form */}
                <form className="space-y-5 mb-8" onSubmit={handleAccountSubmit}>
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium mb-2 text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        required
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Must be at least 8 characters
                    </p>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      className="w-4 h-4 rounded border-gray-300 mt-1"
                      style={{ accentColor: brandColors.electricBlue }}
                      required
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="#terms" className="underline" style={{ color: brandColors.electricBlue }}>
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#privacy" className="underline" style={{ color: brandColors.electricBlue }}>
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    style={{
                      background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})`
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                  </motion.button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-500">Or sign up with</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Social Signup */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSocialSignup('google')}
                    className="py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>
                  <button
                    onClick={() => handleSocialSignup('linkedin')}
                    className="py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                  >
                    <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                    </svg>
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleSocialSignup('x')}
                    className="py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                  >
                    <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    X
                  </button>
                  <button
                    onClick={() => handleSocialSignup('facebook')}
                    className="py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                  >
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}