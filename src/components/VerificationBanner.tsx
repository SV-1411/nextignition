import { motion } from 'motion/react';
import { AlertCircle, ArrowRight, X } from 'lucide-react';
import { brandColors } from '../utils/colors';

interface VerificationBannerProps {
  userRole: 'founder' | 'expert' | 'investor';
  userName: string;
  onComplete: () => void;
  onDismiss: () => void;
}

export function VerificationBanner({ userRole, userName, onComplete, onDismiss }: VerificationBannerProps) {
  const handleComplete = () => {
    // Store the user role in sessionStorage before redirecting
    sessionStorage.setItem('profileCompletionRole', userRole);
    sessionStorage.setItem('selectedRoles', JSON.stringify([userRole]));
    // Redirect to profile completion page
    window.location.hash = '#complete-profile';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-orange-500 rounded-lg p-4 mb-6 shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-orange-500" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Complete Your Profile Verification
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            Welcome, {userName}! To unlock full access to NextIgnition, please complete your {userRole} profile verification. 
            This helps us maintain quality and connect you with the right opportunities.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleComplete}
              className="px-4 py-2 rounded-lg font-semibold text-white flex items-center gap-2 hover:shadow-lg transition-all"
              style={{ backgroundColor: brandColors.atomicOrange }}
            >
              Complete Verification
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onDismiss}
              className="px-4 py-2 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Remind Me Later
            </button>
          </div>

          {/* Progress indicator */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: '30%',
                  backgroundColor: brandColors.atomicOrange 
                }}
              />
            </div>
            <span className="text-xs font-medium text-gray-600">30% Complete</span>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}