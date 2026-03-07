'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sprout,
  Wind,
  TrendingUp,
  ShoppingCart,
  PieChart,
  MessageSquare,
  Settings,
  Leaf,
  LogOut,
  X,
  Droplets,
  Activity,
  Award,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

const sidebarLinks = [
  { href: '/farmer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/farmer/irrigation', label: 'Irrigation AI', icon: Droplets },
  { href: '/farmer/sensors', label: 'Live Sensors', icon: Activity },
  { href: '/farmer/carbon-report', label: 'Carbon Credits', icon: Wind },
  { href: '/farmer/farm-profile', label: 'Farm Data', icon: Sprout },
  { href: '/farmer/sustainability', label: 'Green Score', icon: Award },
  { href: '/farmer/settings', label: 'Settings', icon: Settings },
];

interface ModernSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModernSidebar({ isOpen, onClose }: ModernSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside className={`
        fixed left-0 top-0 bottom-0 z-50 
        flex flex-col items-center py-6
        transition-transform duration-300 ease-in-out
        w-64 lg:w-[80px]
        bg-gradient-to-b from-[#38B26D] to-[#2F9E5B]
        text-white shadow-xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          {/* Mobile Only Label */}
          <span className="lg:hidden font-bold text-xl">KrishiCarbon</span>
          
          <button 
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-1 text-white/80 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 w-full px-3 space-y-4 overflow-y-auto no-scrollbar flex flex-col items-center">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '#' && pathname.startsWith(link.href));
            const Icon = link.icon;
            
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className={`
                  relative group flex items-center justify-center
                  w-12 h-12 lg:w-12 lg:h-12 rounded-2xl transition-all duration-200
                  ${isActive 
                    ? 'bg-white text-[#38B26D] shadow-lg translate-y-[-2px]' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white hover:translate-y-[-2px]'
                  }
                `}
                title={link.label}
              >
                <Icon className="h-6 w-6" />
                
                {/* Mobile Label */}
                <span className="lg:hidden ml-4 font-medium whitespace-nowrap absolute left-14 bg-white text-[#38B26D] px-3 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {link.label}
                </span>

                {/* Desktop Tooltip */}
                <span className="hidden lg:block absolute left-14 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Avatar */}
        <div className="mt-auto pt-4 border-t border-white/10 w-full flex flex-col items-center gap-4">
           {/* Placeholder Avatar */}
           <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold border-2 border-white/30 cursor-pointer hover:border-white transition-colors">
             U
           </div>

          <button
            onClick={logout}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>
    </>
  );
}
