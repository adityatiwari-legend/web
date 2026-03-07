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
    <div className="bg-white rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-medium text-[#1F2937]">Farm Activity Chart</h3>
          <p className="text-xs text-[#6B7280] mt-1">Carbon capture trends over time</p>
        </div>
        <div className="p-2 bg-[#38B26D]/10 rounded-xl">
          <TrendingUp className="h-5 w-5 text-[#38B26D]" />
        </div>
      </div>

      <div className="flex-1 w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSequestration" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38B26D" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#38B26D" stopOpacity={0} />
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
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="sequestration" 
              stroke="#38B26D" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSequestration)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
