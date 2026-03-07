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
  LogOut
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

const sidebarLinks = [
  { href: '/farmer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/farmer/farm-profile', label: 'Farm Profiles', icon: Sprout },
  { href: '/farmer/carbon-report', label: 'Carbon Reports', icon: Wind },
  { href: '/farmer/profit-report', label: 'Profit Insights', icon: TrendingUp },
  { href: '/farmer/sustainability', label: 'Credit Marketplace', icon: ShoppingCart },
  { href: '#', label: 'Analytics', icon: PieChart },
  { href: '#', label: 'Messages', icon: MessageSquare },
  { href: '#', label: 'Settings', icon: Settings },
];

export default function ModernSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col fixed left-0 top-0 bottom-0 z-50 transition-colors">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-green-500 p-2 rounded-xl">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
            KrishiCarbon
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {sidebarLinks.map((link) => {
          // just use exact match or simple startsWith logic
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Upgrade Card */}
      <div className="p-4 mx-4 mb-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-2xl border border-green-100 dark:border-green-500/20 shadow-sm">
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Pro Plan</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get advanced analytics & premium support</p>
        </div>
        <button className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors shadow-sm">
          Upgrade Now
        </button>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
