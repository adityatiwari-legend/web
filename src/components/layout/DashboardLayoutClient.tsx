'use client';

import { useState } from 'react';
import ModernSidebar from './ModernSidebar';
import TopNavbar from './TopNavbar';
import RightSidebar from './RightSidebar';

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-[#F5F7FA] min-h-screen text-[#1F2937] font-sans">
      {/* Sidebar - Fixed Left */}
      <ModernSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Content Wrapper */}
      <div className="lg:pl-[80px] transition-all duration-300">
        <div className="flex flex-col lg:flex-row min-h-screen">
          
          {/* Main Analytics Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Navigation (Mobile Toggle + Breadcrumbs/Title) */}
            <div className="sticky top-0 z-30 bg-[#F5F7FA]/80 backdrop-blur-md px-4 py-3 lg:px-8 lg:py-4">
               <TopNavbar onMenuClick={() => setIsSidebarOpen(true)} />
            </div>

            <main className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
              {children}
            </main>
          </div>

          {/* Right Panel - Responsive */}
          {/* Desktop: Fixed width, sticky height. Tablet/Mobile: Stacked below content */}
          <div className="lg:w-[320px] w-full shrink-0 border-l border-gray-100 bg-white">
            <div className="sticky top-0 h-screen overflow-y-auto custom-scrollbar">
              <RightSidebar />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}