'use client';

import { Globe, Leaf, Zap } from 'lucide-react';

interface ImpactCardProps {
  totalCredits: number;
  regionsCount: number;
  averageScore: number;
}

export default function ImpactCard({ totalCredits, regionsCount, averageScore }: ImpactCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">ESG Impact</h3>
          <p className="text-sm text-gray-500 mt-0.5">Platform-wide contribution</p>
        </div>
        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
          <Leaf className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 flex-1">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex items-center justify-between group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Credits Available</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{totalCredits.toFixed(1)} tCO₂e</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">+12%</span>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex items-center justify-between group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
              <Globe className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Contributing Regions</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{regionsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 flex items-center justify-between group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
              <Leaf className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Avg Sustainability Score</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">{averageScore.toFixed(0)}/100</p>
            </div>
          </div>
          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${averageScore}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
