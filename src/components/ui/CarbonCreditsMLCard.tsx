'use client';

import { Leaf, TrendingUp, IndianRupee } from 'lucide-react';

interface CarbonData {
  carbon_absorbed_kg: number;
  carbon_monthly_kg: number;
  credit_value_today_inr: number;
  credit_value_month_inr: number;
}

interface CarbonCreditsCardProps {
  carbon: CarbonData | null;
  connected: boolean;
}

export default function CarbonCreditsMLCard({ carbon, connected }: CarbonCreditsCardProps) {
  const data = carbon || {
    carbon_absorbed_kg: 0,
    carbon_monthly_kg: 0,
    credit_value_today_inr: 0,
    credit_value_month_inr: 0,
  };

  const items = [
    {
      label: 'Today\'s Absorption',
      value: `${data.carbon_absorbed_kg.toFixed(2)} kg`,
      sub: 'CO₂ absorbed today',
      icon: Leaf,
      color: 'text-[#38B26D]',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Monthly Projection',
      value: `${data.carbon_monthly_kg.toFixed(1)} kg`,
      sub: 'CO₂ this month',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Credit Value Today',
      value: `₹${data.credit_value_today_inr.toFixed(2)}`,
      sub: 'Earned today',
      icon: IndianRupee,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Monthly Earnings',
      value: `₹${data.credit_value_month_inr.toFixed(0)}`,
      sub: 'Projected this month',
      icon: IndianRupee,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-[#1F2937]">ML Carbon Predictions</h3>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
          connected ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {connected ? 'Live ML' : 'Simulated'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className={`${item.bgColor} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-xs font-medium text-[#6B7280]">{item.label}</span>
              </div>
              <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-[#6B7280] mt-0.5">{item.sub}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
