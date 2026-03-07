'use client';

import { useAuth } from '@/providers/AuthProvider';
import { Menu } from 'lucide-react';

interface TopNavbarProps {
  onMenuClick?: () => void;
}

export default function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const { profile } = useAuth();
  
  // Get time of day for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button - Visible only on mobile/tablet when sidebar is collapsed */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-[#1F2937]">
            {greeting}, {profile?.displayName?.split(' ')[0] || 'Farmer'}! 👋
          </h1>
          <p className="text-sm text-[#6B7280]">Here's what's happening with your farms today.</p>
        </div>
      </div>
      
      {/* Date or other meaningful top-right content if needed, but keeping it clean */}
      <div className="hidden sm:block text-right">
        <p className="text-sm font-medium text-[#1F2937]">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </header>
  );
}
