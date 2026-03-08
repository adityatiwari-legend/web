'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { updateProfile } from '@/lib/api';
import { User, Bell, Shield, Globe, Save, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CorporateSettingsPage() {
  const { profile, user, refreshProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'account'>('profile');
  const [saving, setSaving] = useState(false);

  const [profileForm, setProfileForm] = useState({
    displayName: '',
    phone: '',
    region: '',
  });

  const [notifications, setNotifications] = useState({
    purchaseAlerts: true,
    batchUpdates: true,
    impactReports: true,
    weeklyDigest: true,
    emailNotifications: false,
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        displayName: profile.displayName || '',
        phone: profile.phone || '',
        region: profile.region || '',
      });
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profileForm);
      await refreshProfile();
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.error?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('corporate_notification_prefs', JSON.stringify(notifications));
    toast.success('Notification preferences saved!');
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'account' as const, label: 'Account', icon: Shield },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your corporate account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors ${
                    isActive
                      ? 'bg-green-50 text-green-700 border-l-4 border-green-600'
                      : 'text-gray-500 hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium text-sm">{tab.label}</span>
                  <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${isActive ? 'rotate-90' : ''}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-green-50 p-2 rounded-lg">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
                  <p className="text-sm text-gray-500">Update your corporate profile</p>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {profile?.displayName?.charAt(0)?.toUpperCase() || 'C'}
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{profile?.displayName || 'Corporate User'}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">
                    {profile?.role || 'corporate'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Company / Display Name</label>
                  <input
                    value={profileForm.displayName}
                    onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                  <input
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number</label>
                    <input
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Region</label>
                    <input
                      value={profileForm.region}
                      onChange={(e) => setProfileForm({ ...profileForm, region: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition"
                      placeholder="e.g. Mumbai, Maharashtra"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-green-600/20 transition-all hover:translate-y-[-2px] flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Notification Preferences</h3>
                  <p className="text-sm text-gray-500">Manage your ESG and credit alerts</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { key: 'purchaseAlerts', label: 'Purchase Alerts', description: 'Get notified when credit purchases are confirmed' },
                  { key: 'batchUpdates', label: 'Batch Updates', description: 'New verified carbon credit batches available' },
                  { key: 'impactReports', label: 'Impact Reports', description: 'ESG impact report updates and milestones' },
                  { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Weekly summary of market activity and your portfolio' },
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={handleSaveNotifications}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-green-600/20 transition-all hover:translate-y-[-2px] flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Account Settings</h3>
                    <p className="text-sm text-gray-500">Manage your account security</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Account Type</p>
                        <p className="text-xs text-gray-500 mt-0.5 capitalize">{profile?.role || 'Corporate'} Account</p>
                      </div>
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full">Active</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">User ID</p>
                        <p className="text-xs text-gray-500 mt-0.5 font-mono">{profile?.uid || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Language</p>
                        <p className="text-xs text-gray-500 mt-0.5">English (India)</p>
                      </div>
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-red-100 rounded-2xl shadow-sm p-8">
                <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
                <p className="text-sm text-gray-500 mb-6">These actions are irreversible.</p>
                <button
                  onClick={logout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-2.5 rounded-xl font-medium text-sm transition-colors border border-red-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
