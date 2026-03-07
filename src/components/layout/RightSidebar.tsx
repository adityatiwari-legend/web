'use client';

import { Search, Bell, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import ActivityPanel from '@/components/ui/ActivityPanel'; // We can reuse or inline it

export default function RightSidebar() {
  return (
    <aside className="w-full lg:w-[320px] bg-white border-l border-gray-100 flex flex-col h-full lg:h-screen lg:fixed lg:right-0 lg:top-0 lg:overflow-y-auto custom-scrollbar z-40 shadow-xl lg:shadow-none">
      <div className="p-6 space-y-8">
        
        {/* Search & Notifications */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#38B26D]/20 outline-none text-gray-600 placeholder:text-gray-400"
            />
          </div>
          <button className="relative p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        {/* Verification Tasks */}
        <div>
          <h3 className="text-lg font-bold text-[#1F2937] mb-4">Verification Tasks</h3>
          <div className="space-y-3">
            <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1F2937]">Farm Verification</h4>
                  <p className="text-xs text-[#6B7280] mt-1">Green Valley Extension requesting audit.</p>
                  <button className="mt-3 text-xs font-semibold text-[#38B26D] hover:underline">Review Request</button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1F2937]">Token Minting</h4>
                  <p className="text-xs text-[#6B7280] mt-1">Batch #CB-2024-001 ready for tokens.</p>
                  <button className="mt-3 text-xs font-semibold text-blue-600 hover:underline">Approve Minting</button>
                </div>
              </div>
            </div>
            
             <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1F2937]">Marketplace</h4>
                  <p className="text-xs text-[#6B7280] mt-1">New bid on Batch #CB-2023-089</p>
                  <button className="mt-3 text-xs font-semibold text-purple-600 hover:underline">View Bid</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="pt-4 border-t border-gray-100">
           {/* Reusing logic from ActivityPanel but styling it here mainly or importing */}
           {/* For now, I'll just embed a simplified version or the component if it fits */}
           <ActivityPanel />
        </div>

      </div>
    </aside>
  );
}
