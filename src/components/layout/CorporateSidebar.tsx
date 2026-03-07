'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Leaf,
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileBarChart,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

const corporateLinks = [
  { href: '/corporate/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/corporate/batches', label: 'Credit Batches', icon: Package },
  { href: '/corporate/purchase', label: 'Purchase', icon: ShoppingCart },
  { href: '/corporate/impact', label: 'Impact Report', icon: FileBarChart },
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

      <aside className={`w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col fixed left-0 top-0 bottom-0 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <Leaf className="h-7 w-7 text-green-500" />
            <span className="text-xl font-bold text-white">
              Krishi<span className="text-green-500">Carbon</span>
            </span>
          </Link>
          
          <button 
            onClick={onClose}
            className="lg:hidden p-1 text-gray-400 hover:text-white rounded-lg"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-800">
          <p className="text-sm text-gray-400">Welcome,</p>
          <p className="text-white font-medium truncate">{profile?.displayName || 'ESG Buyer'}</p>
          <span className="inline-block mt-1 text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">
            corporate
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {corporateLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
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
    </>
  );
}
