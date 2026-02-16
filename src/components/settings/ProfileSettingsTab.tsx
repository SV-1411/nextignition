import { useEffect, useRef, useState } from 'react';
import { Camera, MapPin, Globe, Trash2, Upload, Video, X, Check, Linkedin, Twitter, Github, Instagram } from 'lucide-react';
import { brandColors } from '../../utils/colors';
import { updateProfile, getProfile, uploadAvatar } from '../../services/userService';
import { getCurrentUser } from '../../services/authService';

interface ProfileSettingsTabProps {
  userRole: 'founder' | 'expert' | 'investor';
}

export function ProfileSettingsTab({ userRole }: ProfileSettingsTabProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const user = getCurrentUser();
      if (user) {
        try {
          const profile = await getProfile(user.id);
          setFullName(user.name);
          setUsername(user.name.toLowerCase().replace(/\s+/g, ''));
          setBio(profile.profile?.bio || '');
          setLocation(profile.profile?.location || '');
          setWebsite(profile.profile?.website || '');
          setAvatarUrl(profile.avatar || user.avatar || '');
        } catch (error) {
          console.error('Error fetching profile', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, []);

  const handleAvatarPick = () => {
    fileInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await uploadAvatar(file);
      setAvatarUrl(res.avatar);

      const current = getCurrentUser();
      if (current) {
        const updated = { ...current, avatar: res.avatar };
        localStorage.setItem('user', JSON.stringify(updated));
      }

      setMessage('Profile photo updated!');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Failed to upload photo.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProfile({
        bio,
        location,
        website,
        skills: [], // TODO: Add skills selector
        experience: 0, // TODO: Add experience selector
      });
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  const bioCharLimit = 160;

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your public profile information</p>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-lg bg-gray-100 border border-gray-200 text-gray-700">
          {message}
        </div>
      )}

      {/* Section 1: Profile Header */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Profile Header</h2>

        {/* Cover Photo */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Cover Photo</label>
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Change Cover</p>
                <p className="text-xs text-white/80 mt-1">Recommended: 1200×300px</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Picture */}
        <div className="flex items-start gap-6 mb-6">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-orange-600 rounded-full flex items-center justify-center text-white text-4xl font-bold cursor-pointer group overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                'JD'
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-2">Profile Picture</h3>
            <p className="text-sm text-gray-600 mb-3">
              Upload a clear, professional photo. Max 5MB (JPG, PNG)
            </p>
            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
              <button
                onClick={handleAvatarPick}
                disabled={isUploading}
                className="px-4 py-2 rounded-lg font-medium text-sm text-white disabled:opacity-60"
                style={{ background: brandColors.electricBlue }}>
                <Upload className="w-4 h-4 inline mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Photo'}
              </button>
              <button
                onClick={handleTakePhoto}
                disabled={isUploading}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                <Camera className="w-4 h-4 inline mr-2" />
                Take Photo
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50">
                <Trash2 className="w-4 h-4 inline mr-2" />
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Basic Information */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Basic Information</h2>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={50}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">50 characters max</p>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {isUsernameAvailable && username && (
                <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Alphanumeric and underscore only.
              {isUsernameAvailable ? (
                <span className="text-green-600 ml-2">✓ Available</span>
              ) : (
                <span className="text-red-600 ml-2">✗ Username taken</span>
              )}
            </p>
          </div>

          {/* Bio/Tagline */}
          <div>
            <label className="block text-sm font-medium mb-2">Bio/Tagline</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, bioCharLimit))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Founder building the future of..."
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">Appears below your name on your profile</p>
              <p className="text-xs text-gray-500">
                {bio.length}/{bioCharLimit}
              </p>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="City, State, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Founded Date (Founder only) */}
          {userRole === 'founder' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Founded Month</label>
                <select defaultValue="October" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>January</option>
                  <option>February</option>
                  <option>March</option>
                  <option>April</option>
                  <option>May</option>
                  <option>June</option>
                  <option>July</option>
                  <option>August</option>
                  <option>September</option>
                  <option>October</option>
                  <option>November</option>
                  <option>December</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Founded Year</label>
                <select defaultValue="2024" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                  <option>2021</option>
                  <option>2020</option>
                </select>
              </div>
            </div>
          )}

          {/* Current Role (Founder only) */}
          {userRole === 'founder' && (
            <div>
              <label className="block text-sm font-medium mb-2">Current Role</label>
              <select defaultValue="Founder" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Founder</option>
                <option>Co-founder</option>
                <option>Solo Founder</option>
              </select>
            </div>
          )}

          {/* Startup Status (Founder only) */}
          {userRole === 'founder' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Startup Status <span className="text-red-500">*</span>
              </label>
              <select defaultValue="has-startup" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="has-startup">I have a startup</option>
                <option value="wants-to-join">I want to join a startup</option>
                <option value="ideal">I'm ideal (open to both)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                This helps other founders and co-founders find you based on your current situation
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Social Links */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Social Links</h2>

        <div className="space-y-4">
          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-blue-600" />
              LinkedIn
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Required</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                defaultValue="https://linkedin.com/in/johndoe"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-3 py-2 bg-green-50 text-green-700 rounded-lg font-medium flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Connected</span>
              </button>
            </div>
          </div>

          {/* Twitter */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Twitter className="w-4 h-4 text-blue-400" />
              Twitter / X
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://twitter.com/username"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-3 py-2 rounded-lg font-medium text-white whitespace-nowrap"
                style={{ background: brandColors.electricBlue }}>
                <span className="hidden sm:inline">Connect</span>
                <span className="sm:hidden">+</span>
              </button>
            </div>
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://github.com/username"
                defaultValue="https://github.com/johndoe"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-3 py-2 bg-green-50 text-green-700 rounded-lg font-medium flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Connected</span>
              </button>
            </div>
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-600" />
              Instagram
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://instagram.com/username"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-3 py-2 rounded-lg font-medium text-white whitespace-nowrap"
                style={{ background: brandColors.electricBlue }}>
                <span className="hidden sm:inline">Connect</span>
                <span className="sm:hidden">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Profile Video */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">30-Second Intro Video</h2>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <Video className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <h3 className="font-bold mb-2">No video uploaded</h3>
          <p className="text-sm text-gray-600 mb-4">
            Record or upload a 30-second video introducing yourself
          </p>
          <div className="flex gap-3 justify-center">
            <button className="px-6 py-2 rounded-lg font-medium text-white"
              style={{ background: brandColors.electricBlue }}>
              <Video className="w-4 h-4 inline mr-2" />
              Record New
            </button>
            <button className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
              <Upload className="w-4 h-4 inline mr-2" />
              Upload Video
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white rounded-xl p-6 shadow-sm">
        <div className="text-sm text-gray-500">
          Changes saved 2 mins ago
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 rounded-lg font-bold text-white disabled:opacity-60"
            style={{ background: brandColors.electricBlue }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}