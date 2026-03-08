'use client';

import { useState } from 'react';
import ModernSidebar from './ModernSidebar';
import TopNavbar from './TopNavbar';
import RightSidebar from './RightSidebar';
import { PanelRight } from 'lucide-react';

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);

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
            {/* Top Navigation */}
            <div className="sticky top-0 z-30 bg-[#F5F7FA]/80 backdrop-blur-md px-4 py-3 lg:px-8 lg:py-4">
              <div className="flex items-center justify-between">
                <TopNavbar onMenuClick={() => setIsSidebarOpen(true)} />
                {/* Right panel toggle for mobile/tablet */}
                <button
                  onClick={() => setIsRightOpen(true)}
                  className="xl:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors shrink-0 ml-2"
                  aria-label="Open panel"
                >
                  <PanelRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <main className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
              {children}
            </main>
          </div>

          {/* Right Panel - Desktop: visible, Mobile/Tablet: slide-in drawer */}
          {/* Mobile overlay */}
          <div
            className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 xl:hidden ${
              isRightOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsRightOpen(false)}
          />

          <div className={`
            fixed right-0 top-0 bottom-0 z-50 w-[320px] bg-white border-l border-gray-100 shadow-xl
            transition-transform duration-300 ease-in-out
            xl:relative xl:translate-x-0 xl:shadow-none xl:z-auto
            ${isRightOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}
          `}>
            <div className="h-screen overflow-y-auto custom-scrollbar">
              <RightSidebar onClose={() => setIsRightOpen(false)} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}