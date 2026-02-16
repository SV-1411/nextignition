import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
  X,
  Video,
  Play,
  Pause,
  RefreshCw,
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  AlertCircle,
  CheckCircle,
  Info,
  Save,
  Sparkles
} from 'lucide-react';
import { brandColors } from '../utils/colors';
import api from '../services/api';

interface Step {
  id: number;
  title: string;
  status: 'completed' | 'active' | 'pending';
}

interface Document {
  name: string;
  required: boolean;
  uploaded: boolean;
  file?: File;
}

export function FundingPortalFounder() {
  const [currentStep, setCurrentStep] = useState(2); // Changed to 2 to show Pitch Deck Upload step
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [pitchDeckUploaded, setPitchDeckUploaded] = useState(true); // Track if pitch deck is uploaded
  const [showAIAnalysis, setShowAIAnalysis] = useState(false); // Track if AI analysis should show
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps: Step[] = [
    { id: 1, title: 'Profile Complete', status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'pending' },
    { id: 2, title: 'Pitch Deck Upload', status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'pending' },
    { id: 3, title: 'Pitch Video', status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'active' : 'pending' },
    { id: 4, title: 'Business Documents', status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'active' : 'pending' },
    { id: 5, title: 'Final Review', status: currentStep === 5 ? 'active' : 'pending' },
  ];

  const [documents, setDocuments] = useState<Document[]>([
    { name: 'Business Plan', required: true, uploaded: true },
    { name: 'Financial Projections', required: true, uploaded: false },
    { name: 'Cap Table', required: true, uploaded: false },
    { name: 'Market Research', required: false, uploaded: false },
    { name: 'Product Demo', required: false, uploaded: false },
  ]);

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const progressPercentage = Math.round((completedSteps / steps.length) * 100);

  const handleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate recording timer
      const interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 120) {
            clearInterval(interval);
            setIsRecording(false);
            setHasRecording(true);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsRecording(false);
      setHasRecording(true);
      setRecordingTime(0);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Simulate file upload
      const file = files[0];
      setDocuments(prev => prev.map((doc, idx) => 
        idx === prev.findIndex(d => !d.uploaded) 
          ? { ...doc, uploaded: true, file } 
          : doc
      ));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Progress Tracker Sidebar */}
      <aside className="hidden lg:block w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">Pitch Submission</h3>
              <span className="text-2xl font-bold" style={{ color: brandColors.electricBlue }}>
                {progressPercentage}%
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-3">
              <motion.div 
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">Complete all steps to submit your pitch</p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      step.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : step.status === 'active'
                        ? 'text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                    style={step.status === 'active' ? { backgroundColor: brandColors.electricBlue } : {}}
                  >
                    {step.status === 'completed' ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div 
                      className={`w-0.5 h-12 ${
                        step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-2">
                  <h4 
                    className={`font-bold text-sm mb-1 ${
                      step.status === 'active' ? 'text-gray-900' : 'text-gray-600'
                    }`}
                  >
                    {step.title}
                  </h4>
                  {step.status === 'active' && (
                    <p className="text-xs text-gray-500">In Progress</p>
                  )}
                  {step.status === 'completed' && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-blue-900 mb-1">Need Help?</h4>
                <p className="text-xs text-blue-700 mb-3">
                  Our pitch experts can review your submission and provide feedback.
                </p>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700">
                  Schedule a Review →
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Progress Dots */}
      <div className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 p-4 z-30">
        <div className="flex items-center justify-center gap-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`h-2 rounded-full transition-all ${
                step.status === 'completed' ? 'w-8 bg-green-500' :
                step.status === 'active' ? 'w-12' : 'w-2 bg-gray-300'
              }`}
              style={step.status === 'active' ? { backgroundColor: brandColors.electricBlue } : {}}
            />
          ))}
        </div>
        <p className="text-center text-xs text-gray-600 mt-2">
          Step {currentStep} of {steps.length}
        </p>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-24 lg:pt-0">
        <div className="max-w-6xl mx-auto p-4 lg:p-8">
          {/* Autosave Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Save className="w-4 h-4" />
              <span>Draft saved 2 mins ago</span>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 2: Pitch Deck Upload */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Upload Your Pitch Deck</h2>
                  <p className="text-gray-600">
                    Share your pitch deck to help investors understand your vision, market opportunity, and business model.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Upload/Preview Section */}
                  <div>
                    <div className="bg-white rounded-2xl p-6 lg:p-8">
                      {!pitchDeckUploaded ? (
                        <div
                          onClick={() => {
                            setPitchDeckUploaded(true);
                            // Simulate AI analysis after 2 seconds
                            setTimeout(() => setShowAIAnalysis(true), 2000);
                          }}
                          className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                          style={{ borderColor: brandColors.electricBlue }}
                        >
                          <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: brandColors.electricBlue }} />
                          <h3 className="font-bold mb-2">Drag and drop your pitch deck here</h3>
                          <p className="text-sm text-gray-600 mb-4">or click to browse</p>
                          <p className="text-xs text-gray-500">
                            Accepted formats: PDF, PPT, PPTX (max 50MB)
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Uploaded Deck Preview */}
                          <div className="flex items-center gap-3 p-4 bg-green-50 border-2 border-green-500 rounded-xl">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-sm text-gray-900 truncate">TechFlow_Pitch_Deck_2024.pdf</h4>
                              <p className="text-xs text-gray-600">12 slides • 4.2 MB • Uploaded 2 mins ago</p>
                            </div>
                            <button className="p-2 hover:bg-green-100 rounded-lg transition-colors flex-shrink-0">
                              <X className="w-4 h-4 text-green-700" />
                            </button>
                          </div>

                          {/* AI Analysis Progress */}
                          {!showAIAnalysis && (
                            <div className="p-5 bg-gradient-to-br from-[#6666FF]/10 to-[#F78405]/10 border border-[#6666FF]/30 rounded-xl">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="relative flex-shrink-0">
                                  <Sparkles className="w-5 h-5 text-[#6666FF] animate-pulse" />
                                  <div className="absolute inset-0 bg-[#6666FF] opacity-20 blur-xl animate-pulse" />
                                </div>
                                <h4 className="font-bold text-sm text-gray-900">AI is analyzing your pitch deck...</h4>
                              </div>
                              <div className="bg-gray-200 rounded-full h-2 mb-2">
                                <motion.div
                                  className="h-full rounded-full bg-gradient-to-r from-[#6666FF] to-[#F78405]"
                                  initial={{ width: '0%' }}
                                  animate={{ width: '100%' }}
                                  transition={{ duration: 2 }}
                                />
                              </div>
                              <p className="text-xs text-gray-600">Analyzing slide 8 of 12...</p>
                            </div>
                          )}

                          {/* Deck Thumbnail Grid */}
                          <div>
                            <h4 className="font-bold text-sm text-gray-900 mb-3">Slide Preview</h4>
                            <div className="grid grid-cols-4 lg:grid-cols-6 gap-2 lg:gap-3">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((slide) => (
                                <div key={slide} className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium border border-gray-300 hover:border-[#6666FF] hover:shadow-md transition-all cursor-pointer">
                                  {slide}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Analysis Results */}
                  {showAIAnalysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-6 lg:p-8 border-2 border-[#6666FF]/30"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6666FF] to-[#F78405] flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">AI Analysis Complete</h3>
                          <p className="text-xs text-gray-600">Here's what we found</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Strengths */}
                        <div>
                          <h4 className="font-bold text-sm text-green-700 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Strengths (5)
                          </h4>
                          <ul className="space-y-2.5">
                            <li className="text-xs text-gray-700 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                              <span>Clear problem statement on slide 3</span>
                            </li>
                            <li className="text-xs text-gray-700 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                              <span>Strong market opportunity data</span>
                            </li>
                            <li className="text-xs text-gray-700 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                              <span>Compelling financial projections</span>
                            </li>
                            <li className="text-xs text-gray-700 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                              <span>Well-defined go-to-market strategy</span>
                            </li>
                            <li className="text-xs text-gray-700 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                              <span>Professional design & branding</span>
                            </li>
                          </ul>
                        </div>

                        {/* Areas to Improve */}
                        <div>
                          <h4 className="font-bold text-sm text-orange-600 mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Areas to Improve (3)
                          </h4>
                          <ul className="space-y-2.5">
                            <li className="text-xs text-gray-700 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                              <span>Add competitive analysis slide</span>
                            </li>
                            <li className="text-xs text-gray-700 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                              <span>Include customer testimonials</span>
                            </li>
                            <li className="text-xs text-gray-700 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                              <span>Clarify unit economics on slide 9</span>
                            </li>
                          </ul>
                        </div>

                        {/* Missing Slides */}
                        <div>
                          <h4 className="font-bold text-sm text-red-600 mb-3 flex items-center gap-2">
                            <X className="w-4 h-4" />
                            Missing Slides (2)
                          </h4>
                          <ul className="space-y-2.5">
                            <li className="text-xs text-gray-700 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                              <span>Team background & expertise</span>
                            </li>
                            <li className="text-xs text-gray-700 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                              <span>Use of funds breakdown</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button className="flex-1 px-4 py-3 bg-gradient-to-r from-[#6666FF] to-[#F78405] text-white rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Download Improved Version
                        </button>
                        <button className="flex-1 px-4 py-3 border-2 border-[#6666FF] text-[#6666FF] rounded-lg font-medium text-sm hover:bg-[#6666FF]/5 transition-colors flex items-center justify-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Chat About Feedback
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Tips Section */}
                <div className="bg-white rounded-2xl p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    Pitch Deck Best Practices
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <FileText className="w-6 h-6 text-blue-600 mb-2" />
                      <h4 className="font-bold text-sm mb-1">Keep it concise</h4>
                      <p className="text-xs text-gray-600">10-15 slides is ideal for seed stage</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
                      <h4 className="font-bold text-sm mb-1">Show traction</h4>
                      <p className="text-xs text-gray-600">Metrics matter more than promises</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <DollarSign className="w-6 h-6 text-blue-600 mb-2" />
                      <h4 className="font-bold text-sm mb-1">Clear ask</h4>
                      <p className="text-xs text-gray-600">Specify funding amount and use</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Pitch Video */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Record Your Pitch Video</h2>
                  <p className="text-gray-600">
                    A 2-minute video pitch helps investors connect with you and your vision.
                  </p>
                </div>

                {/* Video Recording Area */}
                <div className="bg-white rounded-2xl p-6 lg:p-8">
                  <div className="max-w-2xl mx-auto">
                    {/* Camera Preview */}
                    <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6" style={{ aspectRatio: '16/9' }}>
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        playsInline
                      />
                      {!isRecording && !hasRecording && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-sm opacity-75">Camera preview will appear here</p>
                          </div>
                        </div>
                      )}
                      {hasRecording && !isRecording && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <button className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                            <Play className="w-8 h-8 text-gray-900 ml-1" />
                          </button>
                        </div>
                      )}
                      {isRecording && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          <span className="font-bold text-sm">REC {formatTime(recordingTime)}</span>
                        </div>
                      )}
                    </div>

                    {/* Recording Controls */}
                    <div className="flex items-center justify-center gap-4">
                      {!hasRecording ? (
                        <>
                          <button
                            onClick={handleRecord}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                              isRecording
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-red-500 hover:bg-red-600 hover:scale-110'
                            }`}
                          >
                            {isRecording ? (
                              <Pause className="w-8 h-8 text-white" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-white" />
                            )}
                          </button>
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-700">
                              {isRecording ? 'Recording...' : 'Click to start recording'}
                            </p>
                            <p className="text-xs text-gray-500">Maximum 2 minutes</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setHasRecording(false);
                              setRecordingTime(0);
                            }}
                            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span className="font-medium">Retake</span>
                          </button>
                          <div className="text-center">
                            <p className="text-sm font-bold text-green-600 flex items-center justify-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Recording Complete
                            </p>
                            <p className="text-xs text-gray-500">Click continue to proceed</p>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Tips */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Video className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-xs font-medium text-blue-900">Good lighting</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-xs font-medium text-blue-900">Look at camera</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-xs font-medium text-blue-900">Be enthusiastic</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Business Documents */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Upload Business Documents</h2>
                  <p className="text-gray-600">
                    Provide essential documents to help investors evaluate your startup.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 lg:p-8">
                  {/* Upload Zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors mb-8"
                    style={{ borderColor: brandColors.electricBlue }}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: brandColors.electricBlue }} />
                    <h3 className="font-bold mb-2">Drag and drop files here</h3>
                    <p className="text-sm text-gray-600 mb-4">or click to browse</p>
                    <p className="text-xs text-gray-500">
                      Accepted formats: PDF, PPT, DOCX (max 10MB per file)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.ppt,.pptx,.doc,.docx"
                      onChange={handleFileUpload}
                      multiple
                    />
                  </div>

                  {/* Documents Checklist */}
                  <div>
                    <h3 className="font-bold mb-4">Required Documents</h3>
                    <div className="space-y-3">
                      {documents.map((doc, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                            doc.uploaded
                              ? 'border-green-500 bg-green-50'
                              : doc.required
                              ? 'border-gray-200 bg-white'
                              : 'border-gray-100 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {doc.uploaded ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <FileText className="w-5 h-5 text-gray-400" />
                            )}
                            <div>
                              <p className="font-medium text-sm">{doc.name}</p>
                              <p className="text-xs text-gray-500">
                                {doc.required ? 'Required' : 'Optional'}
                              </p>
                            </div>
                          </div>
                          {doc.uploaded ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-green-700 font-medium">Uploaded</span>
                              <button className="p-1 hover:bg-green-100 rounded">
                                <X className="w-4 h-4 text-green-700" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="text-xs font-bold hover:underline"
                              style={{ color: brandColors.electricBlue }}
                            >
                              Upload
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Final Review */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Final Review & Submit</h2>
                  <p className="text-gray-600">
                    Review your pitch and choose how you want to reach investors.
                  </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        TS
                      </div>
                      <div>
                        <h3 className="font-bold">TechStartup Inc.</h3>
                        <p className="text-xs text-gray-600">AI-Powered Analytics</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium text-xs">
                        SaaS
                      </span>
                      <span className="text-gray-600">Seed Stage</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="font-bold mb-3">Pitch Materials</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Pitch Deck (12 slides)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Pitch Video (1:45)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>3 Documents</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visibility Plans */}
                <div className="bg-white rounded-2xl p-6 lg:p-8">
                  <h3 className="font-bold text-lg mb-6">Choose Your Visibility Plan</h3>
                  
                  <div className="space-y-4">
                    {/* Basic Plan */}
                    <label className="block">
                      <div
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedPlan === 'basic'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="radio"
                            name="plan"
                            value="basic"
                            checked={selectedPlan === 'basic'}
                            onChange={(e) => setSelectedPlan(e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold">Basic Listing</h4>
                              <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-bold rounded">
                                FREE
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Your pitch appears in investor search results
                            </p>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                Listed in investor search
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                Basic analytics
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </label>

                    {/* Featured Plan */}
                    <label className="block">
                      <div
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedPlan === 'featured'
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="radio"
                            name="plan"
                            value="featured"
                            checked={selectedPlan === 'featured'}
                            onChange={(e) => setSelectedPlan(e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold">Featured Listing</h4>
                              <span 
                                className="px-2 py-0.5 text-white text-xs font-bold rounded"
                                style={{ backgroundColor: brandColors.atomicOrange }}
                              >
                                RECOMMENDED
                              </span>
                              <span className="font-bold text-lg ml-auto">₹2,999</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Top placement + AI matching to relevant investors
                            </p>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                Priority in search results
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                AI-powered investor matching
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                Advanced analytics
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </label>

                    {/* Direct Plan */}
                    <label className="block">
                      <div
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedPlan === 'direct'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="radio"
                            name="plan"
                            value="direct"
                            checked={selectedPlan === 'direct'}
                            onChange={(e) => setSelectedPlan(e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold">Investor Direct</h4>
                              <Sparkles className="w-4 h-4 text-purple-600" />
                              <span className="font-bold text-lg ml-auto">₹4,999</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Auto-sent to 50+ relevant investors in your category
                            </p>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                All Featured benefits
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                Direct email to 50+ investors
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                Meeting request priority
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Terms */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to NextIgnition's{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                          pitch guidelines
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                          terms of service
                        </a>
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    disabled={!agreedToTerms}
                    className={`w-full mt-6 py-4 rounded-xl font-bold text-white text-lg transition-all ${
                      agreedToTerms
                        ? 'hover:shadow-lg hover:scale-[1.02]'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    style={{
                      background: agreedToTerms
                        ? `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})`
                        : '#ccc',
                    }}
                    onClick={() => setShowSubmitPopup(true)}
                  >
                    Submit Pitch for Review
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pb-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            <button
              onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
              disabled={currentStep === 5}
              className="flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white transition-all hover:shadow-lg"
              style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      {/* Live Preview Panel - Desktop Only */}
      <aside className="hidden xl:block w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-gray-600" />
            <h3 className="font-bold">Investor View Preview</h3>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                TS
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">TechStartup Inc.</h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  AI-Powered Analytics Platform for Modern Businesses
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                SaaS
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                Seed
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center p-2 bg-white rounded border border-gray-200">
                <div className="text-lg font-bold text-green-600">₹2Cr</div>
                <div className="text-xs text-gray-600">Seeking</div>
              </div>
              <div className="text-center p-2 bg-white rounded border border-gray-200">
                <div className="text-lg font-bold text-blue-600">15%</div>
                <div className="text-xs text-gray-600">Equity</div>
              </div>
            </div>

            <button
              className="w-full py-2 rounded-lg text-sm font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
            >
              View Full Pitch
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 This is how investors will see your pitch card in search results
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3">
        <button
          onClick={() => {}}
          className="flex-1 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Save Draft
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
          className="flex-1 py-3 rounded-lg font-bold text-white transition-all"
          style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
        >
          Continue
        </button>
      </div>

      {/* Submission Popup */}
      {showSubmitPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 lg:p-8 max-w-md w-full mx-4"
          >
            {!isSubmitted ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg lg:text-xl">Submit Your Pitch</h3>
                  <button
                    onClick={() => setShowSubmitPopup(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to submit your pitch for review? Once submitted, your pitch will be visible to investors based on your selected plan.
                </p>

                {submitError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">{submitError}</div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                  <button
                    onClick={() => setShowSubmitPopup(false)}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      setSubmitError('');
                      setSubmitting(true);
                      try {
                        await api.post('/funding/applications', {
                          title: startupName || 'Funding Application',
                          pitchSummary: pitchSummary,
                          fundingAsk: fundingAmount ? Number(fundingAmount) : undefined,
                          currency: 'USD',
                          equityOffered: equityPercentage ? Number(equityPercentage) : undefined,
                          pitchDeckUrl: pitchDeckLink,
                          demoVideoUrl: demoVideoLink,
                          tags: selectedIndustries,
                        });
                        setIsSubmitted(true);
                      } catch (err: any) {
                        setSubmitError(err.response?.data?.message || 'Failed to submit pitch');
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    disabled={submitting}
                    className="w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-white transition-all hover:shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Pitch'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
                  >
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </motion.div>

                  <h3 className="font-bold text-xl lg:text-2xl mb-3">Pitch Submitted Successfully!</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Your pitch has been submitted for review. You'll receive a notification once it's live on the platform.
                  </p>

                  <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
                    <h4 className="font-bold text-sm text-blue-900 mb-2">What happens next?</h4>
                    <ul className="space-y-2 text-xs text-blue-800">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Our team will review your pitch within 24-48 hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>You'll receive feedback and approval status via email</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Once approved, investors can view and contact you</span>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setShowSubmitPopup(false);
                      setIsSubmitted(false);
                    }}
                    className="w-full py-3 rounded-lg font-bold text-white transition-all hover:shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
                  >
                    Back to Dashboard
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}