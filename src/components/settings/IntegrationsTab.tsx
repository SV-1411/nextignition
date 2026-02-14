import { Calendar, Video, MessageSquare, Check, Link2 } from 'lucide-react';
import { brandColors } from '../../utils/colors';

export function IntegrationsTab({ userRole }: any) {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Integrations</h1>
        <p className="text-gray-600">Connect your favorite tools and services</p>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Calendar Integrations</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-bold">Google Calendar</p>
                <p className="text-sm text-gray-600">johndoe@gmail.com</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" />
                Connected
              </span>
              <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                Disconnect
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-blue-500" />
              <div>
                <p className="font-bold">Outlook Calendar</p>
                <p className="text-sm text-gray-600">Sync meetings with experts/investors</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg font-medium text-white"
              style={{ background: brandColors.electricBlue }}>
              Connect
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Communication Tools</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Video className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-bold">Zoom</p>
                <p className="text-sm text-gray-600">One-click meeting scheduling</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" />
                Connected
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-purple-600" />
              <div>
                <p className="font-bold">Slack</p>
                <p className="text-sm text-gray-600">Get NextIgnition notifications in Slack</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg font-medium text-white"
              style={{ background: brandColors.electricBlue }}>
              Connect
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end bg-white rounded-xl p-6 shadow-sm">
        <button className="px-6 py-2 rounded-lg font-bold text-white"
          style={{ background: brandColors.electricBlue }}>
          Save Integration Settings
        </button>
      </div>
    </div>
  );
}