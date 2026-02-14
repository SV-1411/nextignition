import { useState } from 'react';
import { Mail, Lock, Shield, Smartphone, Laptop, Trash2, AlertTriangle, Key, QrCode, Download } from 'lucide-react';
import { brandColors } from '../../utils/colors';

export function AccountSecurityTab({ userRole }: any) {
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Account & Security</h1>
        <p className="text-gray-600">Manage your login credentials and security settings</p>
      </div>

      {/* Section 1: Login Credentials */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Login Credentials</h2>
        
        {/* Email Address */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <div className="flex gap-3">
            <input
              type="email"
              value="john.doe@email.com"
              disabled
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
            <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
              Change Email
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">This email is used for login and important notifications</p>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium">Password</label>
            <button 
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="text-sm font-medium hover:underline"
              style={{ color: brandColors.electricBlue }}
            >
              {showPasswordChange ? 'Cancel' : 'Change Password'}
            </button>
          </div>
          
          {!showPasswordChange ? (
            <div className="flex items-center gap-3">
              <input
                type="password"
                value="••••••••••••"
                disabled
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <span className="text-xs text-gray-500">Last updated 45 days ago</span>
            </div>
          ) : (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-xs font-medium mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    At least 8 characters
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                    One uppercase letter
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                    One number
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                    One special character
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="w-full px-4 py-2 rounded-lg font-bold text-white"
                style={{ background: brandColors.electricBlue }}>
                Update Password
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Two-Factor Authentication */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6" style={{ color: brandColors.electricBlue }} />
              Two-Factor Authentication (2FA)
            </h2>
            <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
          </div>
          <label className="relative inline-block w-12 h-6">
            <input 
              type="checkbox" 
              checked={twoFactorEnabled}
              onChange={(e) => {
                setTwoFactorEnabled(e.target.checked);
                if (e.target.checked) setShow2FASetup(true);
              }}
              className="sr-only peer" 
            />
            <div 
              className="w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors"
              style={twoFactorEnabled ? { background: brandColors.electricBlue } : {}}
            ></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform"></div>
          </label>
        </div>

        {twoFactorEnabled ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-700">2FA Enabled ✓</span>
            </div>
            <p className="text-sm text-gray-700 mb-3">Your account is protected with two-factor authentication</p>
            <button className="px-4 py-2 bg-white border border-green-300 rounded-lg text-sm font-medium hover:bg-green-50 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Recovery Codes
            </button>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Enable 2FA for extra security</p>
              <p className="text-sm text-gray-600 mt-1">Protect your account from unauthorized access</p>
            </div>
          </div>
        )}

        {show2FASetup && twoFactorEnabled && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                style={{ background: brandColors.electricBlue }}>1</span>
              Download an authenticator app
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                style={{ background: brandColors.electricBlue }}>2</span>
              Scan this QR code
            </div>
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center">
                <QrCode className="w-32 h-32 text-gray-400" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                style={{ background: brandColors.electricBlue }}>3</span>
              Enter verification code
            </div>
            <input
              type="text"
              placeholder="000000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest"
              maxLength={6}
            />
            <button className="w-full px-4 py-2 rounded-lg font-bold text-white"
              style={{ background: brandColors.electricBlue }}>
              Verify & Enable 2FA
            </button>
          </div>
        )}
      </div>

      {/* Section 3: Active Sessions */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Active Sessions</h2>
        
        <div className="space-y-3">
          {/* Current Session */}
          <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Laptop className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-bold text-sm">Chrome on MacOS</p>
                  <p className="text-xs text-gray-600">Mumbai, India • 2 mins ago</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                This Device
              </span>
            </div>
          </div>

          {/* Other Sessions */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="font-bold text-sm">Mobile App iOS</p>
                  <p className="text-xs text-gray-600">Delhi, India • 2 days ago</p>
                </div>
              </div>
              <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                Sign Out
              </button>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Laptop className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="font-bold text-sm">Firefox on Windows</p>
                  <p className="text-xs text-gray-600">Bangalore, India • 5 days ago</p>
                </div>
              </div>
              <button className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <button className="w-full mt-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50">
          Sign Out All Other Devices
        </button>
      </div>

      {/* Section 4: Account Management */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-6">Account Management</h2>
        
        {/* Deactivate Account */}
        <div className="mb-6 p-4 border border-orange-300 bg-orange-50 rounded-lg">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" style={{ color: brandColors.atomicOrange }} />
            Temporarily Deactivate Account
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Your profile will be hidden. You can reactivate anytime by logging back in.
          </p>
          <button className="px-4 py-2 border-2 rounded-lg font-medium"
            style={{ borderColor: brandColors.atomicOrange, color: brandColors.atomicOrange }}>
            Deactivate Account
          </button>
        </div>

        {/* Delete Account */}
        <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
          <h3 className="font-bold mb-2 flex items-center gap-2 text-red-700">
            <Trash2 className="w-5 h-5" />
            Permanently Delete Account
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
          </p>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">
            Delete Account
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-end items-center bg-white rounded-xl p-6 shadow-sm">
        <button className="px-6 py-2 rounded-lg font-bold text-white"
          style={{ background: brandColors.electricBlue }}>
          Save Security Settings
        </button>
      </div>
    </div>
  );
}
