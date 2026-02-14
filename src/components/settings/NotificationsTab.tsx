import { useState } from 'react';
import { Bell, Mail, Smartphone, Monitor, Clock } from 'lucide-react';
import { brandColors } from '../../utils/colors';

interface NotificationsTabProps {
  userRole: 'founder' | 'expert' | 'investor';
}

interface NotificationSetting {
  id: string;
  label: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export function NotificationsTab({ userRole }: NotificationsTabProps) {
  const [socialEnabled, setSocialEnabled] = useState(true);
  const [messagesEnabled, setMessagesEnabled] = useState(true);
  const [communitiesEnabled, setCommunitiesEnabled] = useState(true);
  const [fundingEnabled, setFundingEnabled] = useState(true);
  const [eventsEnabled, setEventsEnabled] = useState(true);
  const [platformEnabled, setPlatformEnabled] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [dndEnabled, setDndEnabled] = useState(false);

  const Toggle = ({ checked, onChange }: any) => (
    <label className="relative inline-block w-11 h-6">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div 
        className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-500 transition-colors"
        style={checked ? { background: brandColors.electricBlue } : {}}
      ></div>
      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></div>
    </label>
  );

  const NotificationRow = ({ label, defaultSettings }: { label: string, defaultSettings?: any }) => {
    const [settings, setSettings] = useState(defaultSettings || { email: true, push: true, inApp: true });
    
    return (
      <div className="grid grid-cols-4 gap-4 py-3 border-b border-gray-100 items-center">
        <div className="col-span-1">
          <p className="text-sm font-medium text-gray-700">{label}</p>
        </div>
        <div className="text-center">
          <input 
            type="checkbox" 
            checked={settings.email}
            onChange={(e) => setSettings({ ...settings, email: e.target.checked })}
            className="w-4 h-4"
            style={{ accentColor: brandColors.electricBlue }}
          />
        </div>
        <div className="text-center">
          <input 
            type="checkbox" 
            checked={settings.push}
            onChange={(e) => setSettings({ ...settings, push: e.target.checked })}
            className="w-4 h-4"
            style={{ accentColor: brandColors.electricBlue }}
          />
        </div>
        <div className="text-center">
          <input 
            type="checkbox" 
            checked={settings.inApp}
            onChange={(e) => setSettings({ ...settings, inApp: e.target.checked })}
            className="w-4 h-4"
            style={{ accentColor: brandColors.electricBlue }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Notification Settings</h1>
        <p className="text-gray-600">Choose how you want to be notified</p>
      </div>

      {/* Section 1: Social Activity */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Social Activity</h2>
            <p className="text-sm text-gray-600">Notifications about your posts and social interactions</p>
          </div>
          <Toggle checked={socialEnabled} onChange={(e: any) => setSocialEnabled(e.target.checked)} />
        </div>
        
        {socialEnabled && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="col-span-1"></div>
              <div className="text-center">
                <Mail className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                <p className="text-xs font-bold text-gray-700">Email</p>
              </div>
              <div className="text-center">
                <Smartphone className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                <p className="text-xs font-bold text-gray-700">Push</p>
              </div>
              <div className="text-center">
                <Monitor className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                <p className="text-xs font-bold text-gray-700">In-App</p>
              </div>
            </div>

            <NotificationRow label="Likes on your posts" />
            <NotificationRow label="Comments on your posts" />
            <NotificationRow label="New followers" defaultSettings={{ email: true, push: false, inApp: true }} />
            <NotificationRow label="Mentions" />
            <NotificationRow label="Repost of your content" defaultSettings={{ email: false, push: true, inApp: true }} />
          </>
        )}
      </div>

      {/* Section 2: Messages & Communication */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Messages & Communication</h2>
            <p className="text-sm text-gray-600">Direct messages and chat notifications</p>
          </div>
          <Toggle checked={messagesEnabled} onChange={(e: any) => setMessagesEnabled(e.target.checked)} />
        </div>
        
        {messagesEnabled && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="col-span-1"></div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-700">Email</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-700">Push</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-700">In-App</p>
              </div>
            </div>

            <NotificationRow label="New direct messages" />
            <NotificationRow label="Group messages" />
            <NotificationRow label="Message requests" defaultSettings={{ email: true, push: false, inApp: true }} />
          </>
        )}
      </div>

      {/* Section 3: Communities (Founder-specific) */}
      {userRole === 'founder' && (
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Communities</h2>
              <p className="text-sm text-gray-600">Notifications from community channels you've joined</p>
            </div>
            <Toggle checked={communitiesEnabled} onChange={(e: any) => setCommunitiesEnabled(e.target.checked)} />
          </div>
          
          {communitiesEnabled && (
            <>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="col-span-1"></div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700">Email</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700">Push</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700">In-App</p>
                </div>
              </div>

              <NotificationRow label="Channel mentions (@username)" />
              <NotificationRow label="Replies to your messages" defaultSettings={{ email: true, push: false, inApp: true }} />
              <NotificationRow label="New announcements" defaultSettings={{ email: true, push: false, inApp: true }} />
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium mb-2">Digest Frequency</label>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option selected>Real-time</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                </select>
              </div>
            </>
          )}
        </div>
      )}

      {/* Section 4: Funding & Investor Activity (Founder) */}
      {userRole === 'founder' && (
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Funding & Investor Activity</h2>
              <p className="text-sm text-gray-600">Updates about investors viewing your startup</p>
            </div>
            <Toggle checked={fundingEnabled} onChange={(e: any) => setFundingEnabled(e.target.checked)} />
          </div>
          
          {fundingEnabled && (
            <>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="col-span-1"></div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700">Email</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700">Push</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700">In-App</p>
                </div>
              </div>

              <NotificationRow label="Investor views your pitch" />
              <NotificationRow label="Investor adds to pipeline" />
              <NotificationRow label="Meeting requests" />
              <NotificationRow label="Document requests" />
              <NotificationRow label="Funding status updates" />
            </>
          )}
        </div>
      )}

      {/* Section 5: Client & Booking Notifications (Expert) */}
      {userRole === 'expert' && (
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Client & Booking Notifications</h2>
              <p className="text-sm text-gray-600">Updates about your consultation sessions</p>
            </div>
            <Toggle checked={fundingEnabled} onChange={(e: any) => setFundingEnabled(e.target.checked)} />
          </div>
          
          {fundingEnabled && (
            <>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="col-span-1"></div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700">Email</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700">Push</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700">In-App</p>
                </div>
              </div>

              <NotificationRow label="New booking requests" />
              <NotificationRow label="Booking confirmations" />
              <NotificationRow label="Session reminders (1 hour before)" />
              <NotificationRow label="Client cancellations" />
              <NotificationRow label="Payment received" defaultSettings={{ email: true, push: false, inApp: true }} />
              <NotificationRow label="Client reviews posted" defaultSettings={{ email: true, push: false, inApp: true }} />
            </>
          )}
        </div>
      )}

      {/* Section 6: Deal Flow Notifications (Investor) */}
      {userRole === 'investor' && (
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Deal Flow Notifications</h2>
              <p className="text-sm text-gray-600">AI-matched startups and deal updates</p>
            </div>
            <Toggle checked={fundingEnabled} onChange={(e: any) => setFundingEnabled(e.target.checked)} />
          </div>
          
          {fundingEnabled && (
            <>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="col-span-1"></div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700">Email</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700">Push</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-gray-700">In-App</p>
                </div>
              </div>

              <NotificationRow label="New startup matches (AI)" />
              <NotificationRow label="Startups in target industries" defaultSettings={{ email: true, push: false, inApp: true }} />
              <NotificationRow label="Featured startup listings" defaultSettings={{ email: true, push: false, inApp: true }} />
              <NotificationRow label="Pitch deck updates" />
              <NotificationRow label="Founder responses" />
              <NotificationRow label="Document uploads (Deal Room)" />
            </>
          )}
        </div>
      )}

      {/* Section 7: Events */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Events</h2>
            <p className="text-sm text-gray-600">Reminders and updates about events</p>
          </div>
          <Toggle checked={eventsEnabled} onChange={(e: any) => setEventsEnabled(e.target.checked)} />
        </div>
        
        {eventsEnabled && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="col-span-1"></div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-700">Email</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-700">Push</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-700">In-App</p>
              </div>
            </div>

            <NotificationRow label="Event reminders" />
            <NotificationRow label="New event recommendations" defaultSettings={{ email: true, push: false, inApp: true }} />
            <NotificationRow label="Event cancellations" />
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium mb-2">Reminder Timing</label>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>1 hour before</option>
                <option>1 day before</option>
                <option selected>Both</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Section 8: Platform Updates */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Platform Updates</h2>
            <p className="text-sm text-gray-600">News and updates from NextIgnition</p>
          </div>
          <Toggle checked={platformEnabled} onChange={(e: any) => setPlatformEnabled(e.target.checked)} />
        </div>
        
        {platformEnabled && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="col-span-1"></div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-700">Email</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-700">Push</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-gray-700">In-App</p>
              </div>
            </div>

            <NotificationRow label="Product updates" defaultSettings={{ email: true, push: false, inApp: true }} />
            <NotificationRow label="Newsletter (weekly digest)" defaultSettings={{ email: true, push: false, inApp: false }} />
            <NotificationRow label="Feature announcements" defaultSettings={{ email: true, push: false, inApp: true }} />
            <NotificationRow label="Tips & best practices" defaultSettings={{ email: true, push: false, inApp: false }} />
          </>
        )}
      </div>

      {/* Section 9: Notification Schedule */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Notification Schedule</h2>
        
        {/* Quiet Hours */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold">Quiet Hours</h3>
              <p className="text-sm text-gray-600">Pause notifications during quiet hours</p>
            </div>
            <Toggle checked={quietHoursEnabled} onChange={(e: any) => setQuietHoursEnabled(e.target.checked)} />
          </div>
          
          {quietHoursEnabled && (
            <div className="pl-4 border-l-2 border-blue-500 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Time</label>
                  <input 
                    type="time" 
                    defaultValue="22:00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <input 
                    type="time" 
                    defaultValue="08:00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Days</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option selected>All days</option>
                  <option>Weekdays only</option>
                  <option>Weekends only</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Do Not Disturb */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold">Do Not Disturb</h3>
              <p className="text-sm text-gray-600">Mute all notifications except critical ones</p>
            </div>
            <Toggle checked={dndEnabled} onChange={(e: any) => setDndEnabled(e.target.checked)} />
          </div>
          
          {dndEnabled && (
            <div className="pl-4 border-l-2" style={{ borderColor: brandColors.atomicOrange }}>
              <label className="block text-sm font-medium mb-2">Auto-disable in:</label>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>1 hour</option>
                <option>4 hours</option>
                <option selected>Until tomorrow</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white rounded-xl p-6 shadow-sm">
        <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2">
          <Bell className="w-4 h-4" />
          Test Notification
        </button>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button className="px-6 py-2 rounded-lg font-bold text-white"
            style={{ background: brandColors.electricBlue }}>
            Save Notification Preferences
          </button>
        </div>
      </div>
    </div>
  );
}