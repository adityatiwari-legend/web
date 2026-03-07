'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface AnalyticsData {
  month: string;
  sequestration: number;
}

const defaultData = [
  { month: 'Jan', sequestration: 12 },
  { month: 'Feb', sequestration: 19 },
  { month: 'Mar', sequestration: 15 },
  { month: 'Apr', sequestration: 25 },
  { month: 'May', sequestration: 32 },
  { month: 'Jun', sequestration: 28 },
  { month: 'Jul', sequestration: 38 },
];

export default function AnalyticsChart({ data }: { data?: AnalyticsData[] }) {
  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Carbon Sequestration Trends</h3>
          <p className="text-sm text-gray-500 mt-0.5">Monthly performance data</p>
        </div>
        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSequestration" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
            />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#1f2937', fontWeight: 600 }}
              formatter={(value: any) => [`${Number(value).toFixed(1)} tCO₂e`, 'Sequestration']}
            />
            <Area 
              type="monotone" 
              dataKey="sequestration" 
              stroke="#22C55E" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSequestration)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
