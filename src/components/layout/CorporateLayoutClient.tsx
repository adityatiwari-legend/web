'use client';

import { useState } from 'react';
import CorporateSidebar from './CorporateSidebar';
import { Menu } from 'lucide-react';

export default function CorporateLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gray-950 min-h-screen text-gray-100 relative">
      <CorporateSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full transition-all duration-300">
        
        {/* Mobile Header (Only visible on lg:hidden) */}
        <header className="lg:hidden h-16 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="ml-3 font-semibold text-white">KrishiCarbon</span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar w-full max-w-[100vw]">
          {children}
        </main>
      </div>
    </div>
  );
}