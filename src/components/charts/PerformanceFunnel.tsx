'use client';

import { Activity } from 'lucide-react';

interface FunnelData {
  registered: number;
  calculated: number;
  generated: number;
  aggregated: number;
  sold: number;
}

export default function PerformanceFunnel({ data }: { data: FunnelData }) {
  const steps = [
    { label: 'Farms Registered', value: data.registered, color: 'bg-emerald-100 dark:bg-emerald-950/40', barColor: 'bg-emerald-500' },
    { label: 'Carbon Calculated', value: data.calculated, color: 'bg-emerald-200 dark:bg-emerald-900/40', barColor: 'bg-emerald-500' },
    { label: 'Credits Generated', value: data.generated, color: 'bg-emerald-300 dark:bg-emerald-800/40', barColor: 'bg-emerald-500' },
    { label: 'Credits Aggregated', value: data.aggregated, color: 'bg-emerald-400 dark:bg-emerald-700/40', barColor: 'bg-emerald-500' },
    { label: 'Credits Sold', value: data.sold, color: 'bg-emerald-500 dark:bg-emerald-600/40', barColor: 'bg-emerald-500' },
  ];

  const maxVal = Math.max(...steps.map(s => s.value), 1);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Performance Funnel</h3>
          <p className="text-sm text-gray-500 mt-0.5">Credit generation lifecycle</p>
        </div>
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <Activity className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => {
          const percentage = (step.value / maxVal) * 100;
          return (
            <div key={idx} className="relative group">
              <div className="flex justify-between text-sm font-medium mb-1.5 px-1 relative z-10">
                <span className="text-gray-700 dark:text-gray-300">{step.label}</span>
                <span className="text-gray-900 dark:text-white">{step.value}</span>
              </div>
              <div className="h-8 w-full bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-hidden relative">
                <div 
                  className={`absolute left-0 top-0 bottom-0 ${step.color} transition-all duration-700 ease-out`}
                  style={{ width: `${percentage}%` }}
                >
                  <div className={`absolute right-0 top-0 bottom-0 w-1 ${step.barColor} group-hover:w-2 transition-all`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
