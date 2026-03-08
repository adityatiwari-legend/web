'use client';

import { Sprout, TrendingUp, MoreHorizontal } from 'lucide-react';

interface Farm {
  id: string;
  name: string;
  crop: string;
  landArea: number;
  creditsGenerated: number;
  carbonReduction: number;
  estimatedEarnings: number;
}

interface FarmTableProps {
  farms: Farm[];
}

export default function FarmTable({ farms }: FarmTableProps) {
  const displayFarms = farms?.length > 0 ? farms : [
    { id: '1', name: 'Green Valley', crop: 'Wheat', landArea: 12.5, creditsGenerated: 125, carbonReduction: 15.2, estimatedEarnings: 250000 },
    { id: '2', name: 'Sunny Acres', crop: 'Rice', landArea: 8.2, creditsGenerated: 98, carbonReduction: 11.5, estimatedEarnings: 196000 },
    { id: '3', name: 'Riverside Fields', crop: 'Soybean', landArea: 15.0, creditsGenerated: 145, carbonReduction: 18.1, estimatedEarnings: 290000 },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#1F2937]">Top Carbon Producing Farms</h3>
          <p className="text-sm text-[#6B7280] mt-0.5">Performance leaders this season</p>
        </div>
        <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
          <MoreHorizontal className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Farm Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Crop</th>
              <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Land Area</th>
              <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Credits Generated</th>
              <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Carbon Reduction</th>
              <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Est. Earnings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayFarms.map((farm) => (
              <tr key={farm.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                      <Sprout className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1F2937] group-hover:text-emerald-600 transition-colors">{farm.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-[#1F2937] capitalize">
                    {farm.crop}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-[#6B7280]">{farm.landArea} Ac</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#1F2937]">{farm.creditsGenerated}</span>
                    <span className="text-xs text-[#6B7280]">Credits</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span className="text-sm font-medium">{farm.carbonReduction}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-[#1F2937]">
                    ₹{farm.estimatedEarnings.toLocaleString('en-IN')}
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
