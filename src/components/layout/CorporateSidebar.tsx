'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Leaf,
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileBarChart,
  Settings,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

const corporateLinks = [
  { href: '/corporate/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/corporate/batches', label: 'Credit Batches', icon: Package },
  { href: '/corporate/purchase', label: 'Purchase', icon: ShoppingCart },
  { href: '/corporate/impact', label: 'Impact Report', icon: FileBarChart },
  { href: '/corporate/settings', label: 'Settings', icon: Settings },
];

interface CorporateSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CorporateSidebar({ isOpen, onClose }: CorporateSidebarProps) {
  const pathname = usePathname();
  const { logout, profile } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside className={`w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 bottom-0 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <Leaf className="h-7 w-7 text-green-600" />
            <span className="text-xl font-bold text-gray-900">
              Krishi<span className="text-green-600">Carbon</span>
            </span>
          </Link>
          
          <button 
            onClick={onClose}
            className="lg:hidden p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-6 py-6 border-b border-gray-100 bg-gray-50/50">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Signed in as</p>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
              {profile?.displayName?.charAt(0) || 'C'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-bold truncate text-sm">{profile?.displayName || 'ESG Buyer'}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                Corporate
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
          {corporateLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-green-50 text-green-700 shadow-sm ring-1 ring-green-100'
                    : 'text-gray-600 hover:text-green-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-green-600'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition w-full group"
          >
            <LogOut className="h-5 w-5 group-hover:text-red-500" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
