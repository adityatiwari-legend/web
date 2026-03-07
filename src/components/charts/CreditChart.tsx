'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Target } from 'lucide-react';

interface CreditChartProps {
  creditsData: { crop: string; credits: number }[];
}

const COLORS = ['#22c55e', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

export default function CreditChart({ creditsData }: CreditChartProps) {
  // Semi-circle configuration
  const data = creditsData?.length > 0 ? creditsData : [{ crop: 'Unknown', credits: 1 }];
  const total = data.reduce((sum, item) => sum + item.credits, 0);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Credit Distribution</h3>
          <p className="text-sm text-gray-500 mt-0.5">Credits generated per crop</p>
        </div>
        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
          <Target className="h-5 w-5 text-emerald-500" />
        </div>
      </div>

      <div className="flex-1 min-h-[200px] relative mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%" // Shift center down for semi-circle
              startAngle={180}
              endAngle={0}
              innerRadius={80}
              outerRadius={110}
              paddingAngle={2}
              dataKey="credits"
              stroke="none"
              cornerRadius={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#1f2937', fontWeight: 500 }}
              formatter={(value: any) => [`${Number(value).toFixed(1)} tCO₂e`, 'Credits']}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute bottom-0 w-full flex flex-col items-center justify-end pb-4 pointer-events-none">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{total.toFixed(0)}</span>
          <span className="text-sm font-medium text-emerald-500">Total Credits</span>
        </div>
      </div>

      {/* Legend below semi-circle */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {data.map((entry, index) => (
          <div key={entry.crop} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{entry.crop}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
