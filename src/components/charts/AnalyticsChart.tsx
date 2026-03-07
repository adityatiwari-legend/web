'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface EmissionData {
  fertilizer: number;
  diesel: number;
  electricity: number;
}

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];

export default function AnalyticsChart({ data }: { data: EmissionData }) {
  const chartData = [
    { name: 'Fertilizer', value: data.fertilizer || 10 },
    { name: 'Diesel', value: data.diesel || 5 },
    { name: 'Electricity', value: data.electricity || 8 },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Emissions Breakdown</h3>
          <p className="text-sm text-gray-500 mt-0.5">Where your emissions come from</p>
        </div>
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <PieChartIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 min-h-[200px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#1f2937', fontWeight: 500 }}
              formatter={(value: number) => [`${value.toFixed(1)} tCO₂e`, 'Emissions']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-8">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{total.toFixed(1)}</span>
          <span className="text-xs text-gray-500">tCO₂e</span>
        </div>
      </div>
    </div>
  );
}
