'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { updateProfile } from '@/lib/api';
import { User, Bell, Shield, Globe, Save, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { profile, user, refreshProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'account'>('profile');
  const [saving, setSaving] = useState(false);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    phone: '',
    region: '',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    carbonAlerts: true,
    marketUpdates: true,
    irrigationAlerts: true,
    weeklyReport: true,
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
    // Save to localStorage for now (could be an API call in production)
    localStorage.setItem('notification_prefs', JSON.stringify(notifications));
    toast.success('Notification preferences saved!');
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'account' as const, label: 'Account', icon: Shield },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-[#1F2937]">Settings</h1>
        <p className="text-[#6B7280] mt-2">Manage your account and preferences</p>
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
                      ? 'bg-[#38B26D]/10 text-[#38B26D] border-l-4 border-[#38B26D]'
                      : 'text-[#6B7280] hover:bg-gray-50 border-l-4 border-transparent'
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
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-[#38B26D]/10 p-2 rounded-lg">
                  <User className="h-6 w-6 text-[#38B26D]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1F2937]">Profile Information</h3>
                  <p className="text-sm text-[#6B7280]">Update your personal details</p>
                </div>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#38B26D] to-emerald-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {profile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-lg font-bold text-[#1F2937]">{profile?.displayName || 'User'}</p>
                  <p className="text-sm text-[#6B7280]">{user?.email}</p>
                  <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#38B26D]/10 text-[#38B26D] capitalize">
                    {profile?.role || 'farmer'}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-2">Display Name</label>
                  <input
                    value={profileForm.displayName}
                    onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-2">Email</label>
                  <input
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-[#6B7280] cursor-not-allowed"
                  />
                  <p className="text-xs text-[#6B7280] mt-1">Email is managed through Firebase and cannot be changed here.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-2">Phone Number</label>
                    <input
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1F2937] mb-2">Region</label>
                    <input
                      value={profileForm.region}
                      onChange={(e) => setProfileForm({ ...profileForm, region: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                      placeholder="e.g. Maharashtra"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#38B26D] hover:bg-[#2F9E5B] disabled:opacity-50 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-[#38B26D]/20 transition-all hover:translate-y-[-2px] flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1F2937]">Notification Preferences</h3>
                  <p className="text-sm text-[#6B7280]">Choose what updates you want to receive</p>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { key: 'carbonAlerts', label: 'Carbon Credit Alerts', description: 'Get notified when new carbon credits are generated or verified' },
                  { key: 'marketUpdates', label: 'Market Updates', description: 'Receive updates on carbon credit market prices and trends' },
                  { key: 'irrigationAlerts', label: 'Irrigation Alerts', description: 'Smart irrigation recommendations from KrishiMitra AI' },
                  { key: 'weeklyReport', label: 'Weekly Report', description: 'Receive a weekly summary of your farm performance' },
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email in addition to in-app alerts' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-[#1F2937]">{item.label}</p>
                      <p className="text-xs text-[#6B7280] mt-0.5">{item.description}</p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications] ? 'bg-[#38B26D]' : 'bg-gray-300'
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
                    className="bg-[#38B26D] hover:bg-[#2F9E5B] text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-[#38B26D]/20 transition-all hover:translate-y-[-2px] flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-purple-500/10 p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1F2937]">Account Settings</h3>
                    <p className="text-sm text-[#6B7280]">Manage your account security and preferences</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Account Info */}
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-[#1F2937]">Account Type</p>
                        <p className="text-xs text-[#6B7280] mt-0.5 capitalize">{profile?.role || 'Farmer'} Account</p>
                      </div>
                      <span className="px-3 py-1 bg-[#38B26D]/10 text-[#38B26D] text-xs font-semibold rounded-full">Active</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-[#1F2937]">User ID</p>
                        <p className="text-xs text-[#6B7280] mt-0.5 font-mono">{profile?.uid || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-[#1F2937]">Language</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">English (India)</p>
                      </div>
                      <Globe className="h-5 w-5 text-[#6B7280]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-white border border-red-100 rounded-2xl shadow-sm p-8">
                <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
                <p className="text-sm text-[#6B7280] mb-6">These actions are irreversible. Please proceed with caution.</p>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={logout}
                    className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-2.5 rounded-xl font-medium text-sm transition-colors border border-red-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
