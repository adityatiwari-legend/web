'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Sprout, ShoppingBag, Leaf, UserPlus, ArrowRight, X, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getTransactions, getCarbonReports } from '@/lib/api';

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  return `${diffDay}d ago`;
}

interface Activity {
  id: number;
  type: string;
  message: string;
  detail: string;
  time: string;
  icon: typeof Sprout;
  color: string;
}

const defaultActivities: Activity[] = [
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
  const [showAll, setShowAll] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => getTransactions().then((r) => r.data.data).catch(() => null),
  });

  const { data: carbonReports } = useQuery({
    queryKey: ['carbonReports'],
    queryFn: () => getCarbonReports().then((r) => r.data.data).catch(() => null),
  });

  // Build dynamic activities from real data
  const allActivities = (() => {
    const items: Activity[] = [];
    
    if (carbonReports && carbonReports.length > 0) {
      carbonReports.forEach((report: any, i: number) => {
        items.push({
          id: i + 100,
          type: 'batch',
          message: 'Carbon report generated',
          detail: `${report.cropType || 'Farm'} — ${report.estimatedCredits?.toFixed(1) || '0'} credits`,
          time: report.createdAt ? getRelativeTime(report.createdAt) : '1 day ago',
          icon: Leaf,
          color: 'amber',
        });
      });
    }

    if (transactions && transactions.length > 0) {
      transactions.forEach((txn: any, i: number) => {
        items.push({
          id: i + 200,
          type: 'purchase',
          message: 'Credits purchased',
          detail: `${txn.credits?.toFixed(1) || '0'} tCO₂e for ₹${txn.totalPrice?.toLocaleString('en-IN') || '0'}`,
          time: txn.createdAt ? getRelativeTime(txn.createdAt) : '5 hours ago',
          icon: ShoppingBag,
          color: 'blue',
        });
      });
    }

    return items.length > 0 ? items : defaultActivities;
  })();

  const displayedActivities = showAll ? allActivities : allActivities.slice(0, 4);

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-[#1F2937]">Recent Activity</h3>
          {allActivities.length > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-semibold text-[#38B26D] hover:underline"
            >
              {showAll ? 'Show Less' : `View All (${allActivities.length})`}
            </button>
          )}
        </div>

        <div className="space-y-4">
          {displayedActivities.map((activity) => {
            const Icon = activity.icon;
            return (
              <button
                key={activity.id}
                onClick={() => setSelectedActivity(activity)}
                className="flex gap-3.5 group w-full text-left rounded-xl hover:bg-gray-50 p-1.5 -m-1.5 transition-colors"
              >
                <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${colorMap[activity.color]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm font-medium text-[#1F2937] whitespace-nowrap overflow-hidden text-ellipsis">
                    {activity.message}
                  </p>
                  <p className="text-xs text-[#6B7280]">{activity.detail}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{activity.time}</p>
                </div>
                <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setSelectedActivity(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-[#1F2937]">Activity Detail</h3>
              <button onClick={() => setSelectedActivity(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorMap[selectedActivity.color]}`}>
                  <selectedActivity.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1F2937]">{selectedActivity.message}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{selectedActivity.time}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600">{selectedActivity.detail}</p>
              </div>
              <div className="text-xs text-gray-400">
                <p>Type: <span className="capitalize font-medium text-gray-500">{selectedActivity.type}</span></p>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="w-full py-2.5 bg-[#38B26D]/10 text-[#38B26D] text-sm font-medium rounded-xl hover:bg-[#38B26D]/20 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}