import { Eye, EyeOff, Download, Shield } from 'lucide-react';
import { brandColors } from '../../utils/colors';

export function PrivacyDataTab({ userRole }: any) {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Privacy & Data</h1>
        <p className="text-gray-600">Control who can see your information</p>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Profile Visibility</h2>
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input type="radio" name="visibility" defaultChecked className="mt-1" style={{ accentColor: brandColors.electricBlue }} />
            <div>
              <p className="font-medium">🌐 Public</p>
              <p className="text-sm text-gray-600">Anyone on the internet can see your profile</p>
            </div>
          </label>
          <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input type="radio" name="visibility" className="mt-1" style={{ accentColor: brandColors.electricBlue }} />
            <div>
              <p className="font-medium">🔗 NextIgnition Members Only</p>
              <p className="text-sm text-gray-600">Only registered members can view</p>
            </div>
          </label>
          <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
            <input type="radio" name="visibility" className="mt-1" style={{ accentColor: brandColors.electricBlue }} />
            <div>
              <p className="font-medium">👥 Connections Only</p>
              <p className="text-sm text-gray-600">Only people you're connected with</p>
            </div>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Contact & Messaging</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Who Can Message You</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option selected>Everyone</option>
              <option>Connections Only</option>
              <option>No One</option>
            </select>
          </div>
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Message Requests</p>
              <p className="text-sm text-gray-600">Allow non-connections to send requests</p>
            </div>
            <input type="checkbox" defaultChecked style={{ accentColor: brandColors.electricBlue }} />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Data Management</h2>
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Download className="w-5 h-5" style={{ color: brandColors.electricBlue }} />
            Download Your Data
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Request a copy of your profile, posts, messages, and analytics
          </p>
          <button className="px-4 py-2 rounded-lg font-medium text-white"
            style={{ background: brandColors.electricBlue }}>
            Request Data Export
          </button>
          <p className="text-xs text-gray-500 mt-2">Last export: Jan 10, 2026</p>
        </div>
      </div>

      <div className="flex justify-end bg-white rounded-xl p-6 shadow-sm">
        <button className="px-6 py-2 rounded-lg font-bold text-white"
          style={{ background: brandColors.electricBlue }}>
          Save Privacy Settings
        </button>
      </div>
    </div>
  );
}
