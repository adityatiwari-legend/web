'use client';

import { Sprout, TrendingUp, MoreHorizontal } from 'lucide-react';

interface Farm {
  id: string;
  name: string;
  crop: string;
  creditsGenerated: number;
  carbonReduction: number;
  estimatedRevenue: number;
}

interface FarmTableProps {
  farms: Farm[];
}

export default function FarmTable({ farms }: FarmTableProps) {
  // If no farms, provide some empty state or dummy data for visual layout testing
  const displayFarms = farms?.length > 0 ? farms : [
    { id: '1', name: 'Green Valley Farm', crop: 'wheat', creditsGenerated: 12.5, carbonReduction: 4.2, estimatedRevenue: 25000 },
    { id: '2', name: 'Sunny Acres', crop: 'rice', creditsGenerated: 18.2, carbonReduction: 5.8, estimatedRevenue: 36400 },
    { id: '3', name: 'Riverside Fields', crop: 'soybean', creditsGenerated: 9.8, carbonReduction: 3.1, estimatedRevenue: 19600 },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Performing Farms</h3>
          <p className="text-sm text-gray-500 mt-0.5">Highest credit generators this season</p>
        </div>
        <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">
          <MoreHorizontal className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/30">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Farm Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Crop</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Credits</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Carbon Reduction</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {displayFarms.map((farm) => (
              <tr key={farm.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Sprout className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{farm.name}</p>
                      <p className="text-xs text-gray-500">ID: #{farm.id.slice(0,6)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 capitalize">
                    {farm.crop}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{farm.creditsGenerated.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">tCO₂e</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="text-sm font-medium">{farm.carbonReduction.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    ₹{farm.estimatedRevenue.toLocaleString('en-IN')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
