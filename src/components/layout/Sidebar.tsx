'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Leaf,
  LayoutDashboard,
  Sprout,
  BarChart3,
  TrendingUp,
  Award,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

const farmerLinks = [
  { href: '/farmer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/farmer/farm-profile', label: 'Farm Profile', icon: Sprout },
  { href: '/farmer/carbon-report', label: 'Carbon Report', icon: Leaf },
  { href: '/farmer/profit-report', label: 'Profit Report', icon: TrendingUp },
  { href: '/farmer/sustainability', label: 'Sustainability', icon: Award },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, profile } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-green-500" />
          <span className="text-xl font-bold text-white">
            Krishi<span className="text-green-500">Carbon</span>
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-gray-800">
        <p className="text-sm text-gray-400">Welcome,</p>
        <p className="text-white font-medium truncate">{profile?.displayName || 'Farmer'}</p>
        <span className="inline-block mt-1 text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">
          {profile?.role || 'farmer'}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {farmerLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 transition w-full"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
