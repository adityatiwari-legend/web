'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CarbonReport {
  netCarbon: number;
  estimatedCredits: number;
  createdAt: string | Date;
}

interface CarbonTrendLineProps {
  reports: CarbonReport[];
}

export default function CarbonTrendLine({ reports }: CarbonTrendLineProps) {
  if (!reports || reports.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No carbon reports yet. Generate reports to see trends.
      </div>
    );
  }

  // Sort by date ascending for trend
  const data = [...reports]
    .reverse()
    .map((r, i) => ({
      name: `Report ${i + 1}`,
      netCarbon: r.netCarbon,
      credits: r.estimatedCredits,
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip
          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
          labelStyle={{ color: '#f3f4f6' }}
          itemStyle={{ color: '#d1d5db' }}
        />
        <Line type="monotone" dataKey="netCarbon" stroke="#22c55e" strokeWidth={2} name="Net Carbon (t)" />
        <Line type="monotone" dataKey="credits" stroke="#3b82f6" strokeWidth={2} name="Credits" />
      </LineChart>
    </ResponsiveContainer>
  );
}
