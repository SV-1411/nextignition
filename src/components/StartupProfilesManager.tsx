import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
  Building2,
  MapPin,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Rocket
} from 'lucide-react';
import { brandColors } from '../utils/colors';

interface StartupProfile {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  industry: string;
  stage: string;
  location: string;
  foundedDate: string;
  lastUpdated: string;
  isActive: boolean;
}

interface StartupProfilesManagerProps {
  onSelectProfile: (profileId: string) => void;
  onBack: () => void;
  onCreateNew: () => void;
}

export function StartupProfilesManager({ onSelectProfile, onBack, onCreateNew }: StartupProfilesManagerProps) {
  // Mock startup profiles - in a real app, this would come from the database
  const [profiles, setProfiles] = useState<StartupProfile[]>([
    {
      id: '1',
      name: 'TechFlow AI',
      tagline: 'Empowering businesses with intelligent automation solutions',
      logo: '🚀',
      industry: 'AI/ML',
      stage: 'Seed',
      location: 'San Francisco, CA',
      foundedDate: 'Jan 2023',
      lastUpdated: '2 days ago',
      isActive: true
    },
    {
      id: '2',
      name: 'GreenScale',
      tagline: 'Sustainable energy solutions for the modern world',
      logo: '🌱',
      industry: 'Climate Tech',
      stage: 'Pre-Seed',
      location: 'Austin, TX',
      foundedDate: 'Jun 2023',
      lastUpdated: '1 week ago',
      isActive: false
    },
    {
      id: '3',
      name: 'HealthSync Pro',
      tagline: 'Next-generation healthcare management platform',
      logo: '⚕️',
      industry: 'HealthTech',
      stage: 'Series A',
      location: 'Boston, MA',
      foundedDate: 'Mar 2022',
      lastUpdated: '3 days ago',
      isActive: false
    }
  ]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (profileId: string) => {
    setProfiles(profiles.filter(p => p.id !== profileId));
    setShowDeleteConfirm(null);
  };

  const handleSetActive = (profileId: string) => {
    setProfiles(profiles.map(p => ({
      ...p,
      isActive: p.id === profileId
    })));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Funnel Display, sans-serif' }}>
                  My Startup Profiles
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and switch between your startup profiles
                </p>
              </div>
            </div>
            <button
              onClick={onCreateNew}
              className="px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center gap-2 hover:shadow-lg"
              style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
            >
              <Plus className="w-5 h-5" />
              Create New Profile
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {profiles.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-16 h-16 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No startup profiles yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first startup profile to get started on your journey to success
            </p>
            <button
              onClick={onCreateNew}
              className="px-8 py-3 rounded-lg font-bold text-white transition-all inline-flex items-center gap-2 hover:shadow-lg"
              style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}, ${brandColors.atomicOrange})` }}
            >
              <Plus className="w-5 h-5" />
              Create Your First Profile
            </button>
          </motion.div>
        ) : (
          // Profiles Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile, index) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Cover */}
                <div 
                  className="h-32 relative"
                  style={{ background: `linear-gradient(135deg, ${brandColors.electricBlue}20, ${brandColors.atomicOrange}20)` }}
                >
                  <div className="absolute top-4 right-4 flex gap-2">
                    {profile.isActive && (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Logo */}
                <div className="px-6 -mt-12 mb-4">
                  <div className="w-20 h-20 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-4xl">
                    {profile.logo}
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{profile.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{profile.tagline}</p>

                  {/* Info Grid */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span>{profile.industry}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span>{profile.stage}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Founded {profile.foundedDate}</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Last updated {profile.lastUpdated}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectProfile(profile.id)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    {!profile.isActive && (
                      <button
                        onClick={() => handleSetActive(profile.id)}
                        className="px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition-colors"
                        title="Set as active profile"
                      >
                        <Rocket className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setShowDeleteConfirm(profile.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Delete Startup Profile?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                This will permanently delete this startup profile and all associated data. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 px-6 py-3 bg-red-600 rounded-lg font-bold text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
