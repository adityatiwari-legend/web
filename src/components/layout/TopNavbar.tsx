'use client';

import { useAuth } from '@/providers/AuthProvider';
import { Search, Bell, Menu } from 'lucide-react';
import { FiUser } from 'react-icons/fi';

interface TopNavbarProps {
  onMenuClick?: () => void;
}

export default function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const { profile } = useAuth();
  
  // Get time of day for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <header className="h-16 md:h-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between transition-colors w-full">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div>
          <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white truncate max-w-[200px] md:max-w-none">
            {greeting}, {profile?.displayName?.split(' ')[0] || 'Farmer'}! 👋
          </h2>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Here's what's happening with your farms today.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        {/* Search */}
        <div className="relative group hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
          <input
            type="text"
            placeholder="Search reports, farms..."
            className="w-48 lg:w-64 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-950"></span>
        </button>

        {/* Profile Dropdown (Simplified) */}
        <div className="flex items-center gap-3 pl-2 md:pl-6 border-l border-gray-200 dark:border-gray-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[100px]">{profile?.displayName || 'Farmer'}</p>
            <p className="text-xs text-green-500">Premium Member</p>
          </div>
          <div className="h-8 w-8 md:h-10 md:w-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center border border-green-200 dark:border-green-500/20 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <FiUser className="h-4 w-4 md:h-5 md:w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
