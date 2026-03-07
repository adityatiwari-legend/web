'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Target } from 'lucide-react';

interface CreditChartProps {
  creditsData: { crop: string; credits: number }[];
}

const COLORS = ['#22c55e', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

export default function CreditChart({ creditsData }: CreditChartProps) {
  // Semicircle configuration
  const data = creditsData?.length > 0 ? creditsData : [{ crop: 'Unknown', credits: 1 }];
  const total = data.reduce((sum, item) => sum + item.credits, 0);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Carbon Credits by Crop</h3>
          <p className="text-sm text-gray-500 mt-0.5">Distribution across crops</p>
        </div>
        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
          <Target className="h-5 w-5 text-emerald-500" />
        </div>
      </div>

      <div className="flex-1 min-h-[250px] relative mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="credits"
              stroke="none"
              cornerRadius={6}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#1f2937', fontWeight: 500 }}
              formatter={(value: any) => [`${Number(value).toFixed(1)} Credits`, '']}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text positioned absolutely at the bottom center of the chart area */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-6 pointer-events-none transform -translate-y-4">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">{total.toFixed(0)}</span>
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Credits</span>
        </div>
      </div>

      {/* Legend below semi-circle */}
      <div className="flex flex-wrap justify-center gap-4 mt-2">
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
