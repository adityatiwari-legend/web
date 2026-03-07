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
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
};

export default function ActivityPanel() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
        <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">View All</button>
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
                <p className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-500 mb-0.5">{activity.detail}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
              <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
        <button className="w-full py-2.5 px-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
          View Activity Log
        </button>
      </div>
    </div>
  );
}