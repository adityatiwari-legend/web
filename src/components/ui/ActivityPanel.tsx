'use client';

import { Sprout, ShoppingBag, Leaf, UserPlus, ArrowRight } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'registration',
    message: 'New farm registered',
    detail: 'Green Valley Extension',
    time: '2 hours ago',
    icon: Sprout,
    color: 'emerald',
  },
  {
    id: 2,
    type: 'purchase',
    message: 'Corporate purchased credits',
    detail: 'TechCorp Inc. bought 500 credits',
    time: '5 hours ago',
    icon: ShoppingBag,
    color: 'blue',
  },
  {
    id: 3,
    type: 'batch',
    message: 'Carbon batch created',
    detail: 'Batch #CB-2024-001 verified',
    time: '1 day ago',
    icon: Leaf,
    color: 'amber',
  },
  {
    id: 4,
    type: 'join',
    message: 'ESG buyer joined',
    detail: 'Global Sustain Networks',
    time: '2 days ago',
    icon: UserPlus,
    color: 'purple',
  },
];

const colorMap: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
  amber: 'bg-amber-100 text-amber-600',
  purple: 'bg-purple-100 text-purple-600',
};

export default function ActivityPanel() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-medium text-[#1F2937]">Recent Activity</h3>
        <button className="text-xs font-semibold text-[#38B26D] hover:underline">View All</button>
      </div>

      <div className="space-y-6">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex gap-4 group">
              <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorMap[activity.color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-medium text-[#1F2937] whitespace-nowrap overflow-hidden text-ellipsis">
                  {activity.message}
                </p>
                <p className="text-xs text-[#6B7280] mb-0.5">{activity.detail}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
              <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-100">
        <button className="w-full py-2.5 px-4 bg-[#38B26D]/10 text-[#38B26D] text-sm font-medium rounded-xl hover:bg-[#38B26D]/20 transition-colors">
          View Activity Log
        </button>
      </div>
    </div>
  );
}