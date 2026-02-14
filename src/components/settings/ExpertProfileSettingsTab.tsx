import { Briefcase, Award, DollarSign, Calendar, Clock, Users, Plus, X } from 'lucide-react';
import { brandColors } from '../../utils/colors';
import { useEffect, useState } from 'react';
import { updateProfile, getProfile } from '../../services/userService';
import { getCurrentUser } from '../../services/authService';

export function ExpertProfileSettingsTab({ userRole }: any) {
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [hourlyRate, setHourlyRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const user = getCurrentUser();
      if (user) {
        try {
          const profile = await getProfile(user.id);
          setSpecializations(profile.profile?.expertise || []);
          setExperience(profile.profile?.experience || '');
          setHourlyRate(profile.profile?.hourlyRate || 0);
        } catch (error) {
          console.error('Error fetching profile', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProfile({
        expertise: specializations,
        experience,
        hourlyRate,
      });
      setMessage('Expert settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  const addSpecialization = () => {
    const input = document.getElementById('new-spec') as HTMLInputElement;
    if (input && input.value) {
      setSpecializations([...specializations, input.value]);
      input.value = '';
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Expert Profile Settings</h1>
        <p className="text-gray-600">Manage your expertise and service offerings</p>
        {message && <p className={`mt-2 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
      </div>

      {/* Section 1: Expertise & Credentials */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Expertise & Credentials</h2>

        <div className="space-y-4">
          {/* Areas of Specialization */}
          <div>
            <label className="block text-sm font-medium mb-2">Areas of Specialization</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {specializations.map((spec) => (
                <span key={spec} className="px-3 py-1.5 rounded-lg text-sm font-medium text-white flex items-center gap-2"
                  style={{ background: brandColors.electricBlue }}>
                  {spec}
                  <button onClick={() => setSpecializations(specializations.filter(s => s !== spec))}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                id="new-spec"
                type="text"
                placeholder="Add custom tag..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={addSpecialization}
                className="px-4 py-2 rounded-lg font-medium text-white"
                style={{ background: brandColors.electricBlue }}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Years of Experience */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Years of Experience</label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Industries</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option selected>SaaS, FinTech, AI/ML</option>
              </select>
            </div>
          </div>

          {/* Certifications */}
          <div>
            <label className="block text-sm font-medium mb-2">Certifications</label>
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-sm">Certified Product Manager</p>
                  <p className="text-xs text-gray-600">Product School • 2020</p>
                </div>
                <button className="text-red-600 hover:bg-red-50 p-2 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50">
              <Plus className="w-4 h-4 inline mr-2" />
              Add Certification
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Service Offerings */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Service Offerings</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Base Hourly Rate (₹)</label>
          <input
            type="number"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Mentorship Packages */}
        <div className="space-y-3 mb-4">
          <div className="grid grid-cols-5 gap-3 p-3 bg-gray-50 rounded-lg font-medium text-sm text-gray-700">
            <div>Package Name</div>
            <div>Duration</div>
            <div>Price</div>
            <div>Description</div>
            <div className="text-center">Status</div>
          </div>

          <div className="grid grid-cols-5 gap-3 p-3 border border-gray-200 rounded-lg items-center">
            <div className="font-medium text-sm">1-on-1 Consultation</div>
            <div className="text-sm">1 hour</div>
            <div className="font-bold text-sm">₹2,500</div>
            <div className="text-sm text-gray-600">Growth strategy</div>
            <div className="text-center">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Active</span>
            </div>
          </div>
        </div>

        <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg font-medium text-gray-600 hover:border-blue-500 hover:text-blue-600">
          <Plus className="w-4 h-4 inline mr-2" />
          Add Package
        </button>
      </div>

      {/* Section 3: Availability & Calendar */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Availability & Calendar</h2>

        <div className="space-y-4">
          {/* Working Hours */}
          <div>
            <label className="block text-sm font-medium mb-3">Working Hours</label>
            <div className="space-y-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-24">
                    <p className="text-sm font-medium">{day}</p>
                  </div>
                  <input type="time" defaultValue="09:00" className="px-3 py-2 border border-gray-300 rounded-lg" />
                  <span className="text-gray-500">to</span>
                  <input type="time" defaultValue="18:00" className="px-3 py-2 border border-gray-300 rounded-lg" />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked style={{ accentColor: brandColors.electricBlue }} />
                    <span className="text-sm">Available</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Buffer Time & Limits */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Buffer Time Between Sessions</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>15 minutes</option>
                <option selected>30 minutes</option>
                <option>1 hour</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Sessions Per Day</label>
              <input
                type="number"
                defaultValue="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Revenue Settings */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Revenue Settings</h2>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <h3 className="font-bold mb-2">Commission Structure</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-700">NextIgnition fee</p>
              <p className="text-2xl font-bold" style={{ color: brandColors.electricBlue }}>15%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-700">Your earnings</p>
              <p className="text-2xl font-bold text-green-600">85%</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">💡 Reduced to 10% for Expert Tier subscribers</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Payout Frequency</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option>Weekly</option>
              <option selected>Bi-weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Minimum Payout Threshold</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                defaultValue="1000"
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-end bg-white rounded-xl p-6 shadow-sm">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 rounded-lg font-bold text-white disabled:opacity-50"
          style={{ background: brandColors.electricBlue }}>
          {loading ? 'Saving...' : 'Save Expert Settings'}
        </button>
      </div>
    </div>
  );
}
