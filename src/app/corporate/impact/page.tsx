'use client';

import { useQuery } from '@tanstack/react-query';
import { getTransactions, getCreditBatches } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { FiTrendingUp, FiTarget, FiGlobe, FiAward } from 'react-icons/fi';

function ImpactRing({ value, max, label, color }: { value: number; max: number; label: string; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 120, height: 120 }}>
        <svg width={120} height={120} className="-rotate-90">
          <circle cx={60} cy={60} r={radius} fill="none" stroke="#1f2937" strokeWidth={8} />
          <circle
            cx={60} cy={60} r={radius} fill="none"
            stroke={color} strokeWidth={8} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white">{value.toFixed(1)}</span>
        </div>
      </div>
      <p className="text-gray-400 text-sm mt-2">{label}</p>
    </div>
  );
}

export default function ImpactReportPage() {
  const { profile } = useAuth();

  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => getTransactions().then((r) => r.data.data),
  });

  const { data: batches } = useQuery({
    queryKey: ['creditBatches'],
    queryFn: () => getCreditBatches().then((r) => r.data.data),
  });

  const totalCredits = transactions?.reduce((sum: number, t: any) => sum + (t.credits || 0), 0) || 0;
  const totalSpent = transactions?.reduce((sum: number, t: any) => sum + (t.totalPrice || 0), 0) || 0;
  const totalTransactions = transactions?.length || 0;
  const avgPricePerCredit = totalCredits > 0 ? totalSpent / totalCredits : 0;

  // Environmental equivalents (approximate)
  const treesEquivalent = totalCredits * 45; // ~45 trees per tCO₂e
  const carKmAvoided = totalCredits * 6000; // ~6000 km per tCO₂e
  const householdsSupported = Math.ceil(totalCredits / 5); // 1 household ~5 tCO₂e/yr

  // Monthly breakdown for chart-like display
  const monthlyData: Record<string, { credits: number; spent: number }> = {};
  transactions?.forEach((t: any) => {
    const date = t.createdAt ? new Date(t.createdAt) : new Date();
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyData[key]) monthlyData[key] = { credits: 0, spent: 0 };
    monthlyData[key].credits += t.credits || 0;
    monthlyData[key].spent += t.totalPrice || 0;
  });

  const months = Object.entries(monthlyData).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Impact Report</h1>
        <p className="text-gray-400 mt-1">
          ESG impact summary for {profile?.displayName || 'your organization'}
        </p>
      </div>

      {/* Impact Rings */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 mb-8">
        <h3 className="text-lg font-semibold text-white mb-6 text-center">Environmental Impact</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ImpactRing value={totalCredits} max={100} label="tCO₂e Offset" color="#22c55e" />
          <ImpactRing value={treesEquivalent} max={5000} label="Trees Equivalent" color="#16a34a" />
          <ImpactRing value={carKmAvoided / 1000} max={500} label="1000 km Avoided" color="#3b82f6" />
          <ImpactRing value={householdsSupported} max={20} label="Households Supported" color="#a855f7" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Credits Offset', value: `${totalCredits.toFixed(2)} tCO₂e`, icon: <FiTrendingUp />, color: 'green' },
          { label: 'Total Investment', value: `₹${totalSpent.toLocaleString('en-IN')}`, icon: <FiTarget />, color: 'blue' },
          { label: 'Avg Price/Credit', value: `₹${avgPricePerCredit.toFixed(0)}`, icon: <FiGlobe />, color: 'purple' },
          { label: 'Transactions', value: totalTransactions, icon: <FiAward />, color: 'yellow' },
        ].map((m) => (
          <div key={m.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className={`text-${m.color}-400 mb-2`}>{m.icon}</div>
            <p className="text-2xl font-bold text-white">{m.value}</p>
            <p className="text-sm text-gray-400">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Activity</h3>
          {months.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No activity yet</p>
              <p className="text-sm mt-1">Purchase credits to see your monthly impact</p>
            </div>
          ) : (
            <div className="space-y-3">
              {months.map(([month, data]) => {
                const maxCredits = Math.max(...months.map(([, d]) => d.credits));
                const barWidth = maxCredits > 0 ? (data.credits / maxCredits) * 100 : 0;
                return (
                  <div key={month}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">{month}</span>
                      <span className="text-white font-medium">{data.credits.toFixed(2)} tCO₂e</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Transaction History</h3>
          {!transactions || transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No transactions recorded</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {transactions.map((txn: any, idx: number) => (
                <div key={txn.id || idx} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-white text-sm font-medium">{txn.credits?.toFixed(2)} tCO₂e</p>
                    <p className="text-gray-500 text-xs">
                      {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 text-sm font-semibold">
                      ₹{txn.totalPrice?.toLocaleString('en-IN')}
                    </p>
                    <p className="text-gray-600 text-xs font-mono">
                      #{txn.id?.slice(-8) || idx}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ESG Certificate */}
      {totalCredits > 0 && (
        <div className="mt-8 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-2xl p-8 text-center">
          <FiAward className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">ESG Offset Certificate</h3>
          <p className="text-gray-300 mb-4">
            {profile?.displayName || 'Your Organization'} has offset{' '}
            <span className="text-green-400 font-bold">{totalCredits.toFixed(2)} tCO₂e</span> of carbon emissions through verified Indian agricultural credits.
          </p>
          <p className="text-gray-500 text-sm">
            Equivalent to planting {Math.round(treesEquivalent)} trees or avoiding {(carKmAvoided / 1000).toFixed(0)}k km of car travel.
          </p>
        </div>
      )}
    </div>
  );
}
