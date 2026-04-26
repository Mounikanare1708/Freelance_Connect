import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Bell, Shield, Moon, Sun, Monitor, Key, LogOut, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    // Mock API call
    toast.error('Changing password is not implemented yet.');
  };

  const handleDeactivate = () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
      toast.error('Account deactivation is not implemented yet.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="section-title text-2xl">Account Settings</h1>
        <p className="text-gray-400 mt-1">Manage your preferences, security, and application settings.</p>
      </div>

      {/* Appearance Settings */}
      <div className="card space-y-5">
        <h2 className="text-lg font-semibold text-white border-b border-surface-border pb-3 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-primary-400" /> Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white mb-1">Theme</h3>
            <p className="text-sm text-gray-400">Choose your preferred visual mode.</p>
          </div>
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-elevated border border-surface-border hover:border-primary-500 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            <span className="text-sm font-medium text-white">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="card space-y-5">
        <h2 className="text-lg font-semibold text-white border-b border-surface-border pb-3 flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary-400" /> Notification Preferences
        </h2>
        
        <div className="space-y-4">
          <label className="flex items-start justify-between cursor-pointer group">
            <div>
              <h3 className="font-medium text-white mb-1">Email Notifications</h3>
              <p className="text-sm text-gray-400">Receive emails for new orders and messages.</p>
            </div>
            <div className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-surface-elevated border border-surface-border">
              <input type="checkbox" className="sr-only peer" checked={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} />
              <div className={`w-4 h-4 rounded-full transition-transform ${emailNotifs ? 'translate-x-6 bg-primary-500' : 'translate-x-1 bg-gray-500'}`} />
            </div>
          </label>

          <label className="flex items-start justify-between cursor-pointer group">
            <div>
              <h3 className="font-medium text-white mb-1">Push Notifications</h3>
              <p className="text-sm text-gray-400">Receive real-time alerts in your browser.</p>
            </div>
            <div className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-surface-elevated border border-surface-border">
              <input type="checkbox" className="sr-only peer" checked={pushNotifs} onChange={() => setPushNotifs(!pushNotifs)} />
              <div className={`w-4 h-4 rounded-full transition-transform ${pushNotifs ? 'translate-x-6 bg-primary-500' : 'translate-x-1 bg-gray-500'}`} />
            </div>
          </label>

          <label className="flex items-start justify-between cursor-pointer group">
            <div>
              <h3 className="font-medium text-white mb-1">Marketing & Promotions</h3>
              <p className="text-sm text-gray-400">Receive special offers and newsletter updates.</p>
            </div>
            <div className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-surface-elevated border border-surface-border">
              <input type="checkbox" className="sr-only peer" checked={marketingEmails} onChange={() => setMarketingEmails(!marketingEmails)} />
              <div className={`w-4 h-4 rounded-full transition-transform ${marketingEmails ? 'translate-x-6 bg-primary-500' : 'translate-x-1 bg-gray-500'}`} />
            </div>
          </label>
        </div>
      </div>

      {/* Security */}
      <div className="card space-y-5">
        <h2 className="text-lg font-semibold text-white border-b border-surface-border pb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary-400" /> Security
        </h2>
        
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div className="form-group">
            <label className="input-label">Current Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="input-label">New Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="input-label">Confirm New Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                className="input pl-10"
              />
            </div>
          </div>
          <button type="submit" className="btn-secondary text-sm">
            Update Password
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-500/20 bg-red-500/[0.02] space-y-5">
        <h2 className="text-lg font-semibold text-red-400 border-b border-red-500/20 pb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Danger Zone
        </h2>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-white mb-1">Deactivate Account</h3>
            <p className="text-sm text-gray-400">Permanently remove your account and all data.</p>
          </div>
          <button 
            onClick={handleDeactivate}
            className="btn-primary bg-red-500 hover:bg-red-600 text-sm whitespace-nowrap"
          >
            Deactivate Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
