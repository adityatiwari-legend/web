'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface EmissionPieChartProps {
  report?: {
    fertilizerEmission: number;
    dieselEmission: number;
    electricityEmission: number;
  } | null;
}

const COLORS = ['#f59e0b', '#ef4444', '#3b82f6'];

export default function EmissionPieChart({ report }: EmissionPieChartProps) {
  if (!report) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No emission data yet. Generate a carbon report first.
      </div>
    );
  }

  const data = [
    { name: 'Fertilizer', value: report.fertilizerEmission },
    { name: 'Diesel', value: report.dieselEmission },
    { name: 'Electricity', value: report.electricityEmission },
  ].filter((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
          labelStyle={{ color: '#f3f4f6' }}
          itemStyle={{ color: '#d1d5db' }}
          formatter={(value: number) => [`${value.toFixed(4)} t CO2`, '']}
        />
        <Legend
          wrapperStyle={{ color: '#9ca3af' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
