'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

interface ProfitBarChartProps {
  report?: {
    revenue: number;
    totalCost: number;
    profit: number;
  } | null;
}

export default function ProfitBarChart({ report }: ProfitBarChartProps) {
  if (!report) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No profit data yet. Generate a profit report first.
      </div>
    );
  }

  const data = [
    { name: 'Revenue', amount: report.revenue, fill: '#22c55e' },
    { name: 'Cost', amount: report.totalCost, fill: '#ef4444' },
    { name: 'Profit', amount: report.profit, fill: report.profit >= 0 ? '#16a34a' : '#dc2626' },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
          labelStyle={{ color: '#f3f4f6' }}
          formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
        />
        <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
