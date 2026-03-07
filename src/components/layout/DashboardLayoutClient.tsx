'use client';

import { useState } from 'react';
import ModernSidebar from './ModernSidebar';
import TopNavbar from './TopNavbar';

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
      {/* Sidebar - Mobile Responsive */}
      <ModernSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-full transition-all duration-300">
        <TopNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar w-full max-w-[100vw]">
          {children}
        </main>
      </div>
    </div>
  );
}