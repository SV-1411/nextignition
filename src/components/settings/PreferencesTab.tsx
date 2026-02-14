import { Globe, Clock, Palette } from 'lucide-react';
import { brandColors } from '../../utils/colors';

export function PreferencesTab({ userRole }: any) {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Preferences</h1>
        <p className="text-gray-600">Customize your NextIgnition experience</p>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Language & Region</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option selected>English</option>
              <option>हिन्दी</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Timezone</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option selected>(GMT+5:30) Mumbai, Kolkata, Chennai</option>
              <option>(GMT+0:00) London</option>
              <option>(GMT-5:00) New York</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date Format</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option selected>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Time Format</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option selected>12-hour (AM/PM)</option>
                <option>24-hour</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Feed & Content Preferences</h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium">⚡ Personalized Feed</p>
              <p className="text-sm text-gray-600">AI-recommended content based on your interests</p>
            </div>
            <input type="radio" name="feed" defaultChecked style={{ accentColor: brandColors.electricBlue }} />
          </label>
          <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium">📅 Chronological Feed</p>
              <p className="text-sm text-gray-600">Latest posts first</p>
            </div>
            <input type="radio" name="feed" style={{ accentColor: brandColors.electricBlue }} />
          </label>
        </div>
      </div>

      <div className="flex justify-end bg-white rounded-xl p-6 shadow-sm">
        <button className="px-6 py-2 rounded-lg font-bold text-white"
          style={{ background: brandColors.electricBlue }}>
          Save Preferences
        </button>
      </div>
    </div>
  );
}
