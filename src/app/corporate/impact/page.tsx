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
    <div className="flex flex-col items-center group">
      <div className="relative transform transition-transform duration-500 group-hover:scale-110" style={{ width: 120, height: 120 }}>
        <svg width={120} height={120} className="-rotate-90">
          <circle cx={60} cy={60} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={8} />
          <circle
            cx={60} cy={60} r={radius} fill="none"
            stroke={color} strokeWidth={8} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-gray-900">{value.toFixed(1)}</span>
        </div>
      </div>
      <p className="text-gray-500 font-medium text-sm mt-3 text-center">{label}</p>
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
        <h1 className="text-3xl font-bold text-gray-900">Impact Report</h1>
        <p className="text-gray-600 mt-1">
          ESG impact summary for {profile?.displayName || 'your organization'}
        </p>
      </div>

      {/* Impact Rings */}
      <div className="bg-white rounded-2xl p-8 mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-8 text-center uppercase tracking-wide opacity-80">Environmental Impact Realized</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <ImpactRing value={totalCredits} max={100} label="tCO₂e Offset" color="#16a34a" /> {/* green-600 */}
          <ImpactRing value={treesEquivalent} max={5000} label="Trees Equivalent" color="#059669" /> {/* emerald-600 */}
          <ImpactRing value={carKmAvoided / 1000} max={500} label="1000 km Avoided" color="#2563eb" /> {/* blue-600 */}
          <ImpactRing value={householdsSupported} max={20} label="Households Supported" color="#9333ea" /> {/* purple-600 */}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Credits Offset', value: `${totalCredits.toFixed(2)} tCO₂e`, icon: <FiTrendingUp />, color: 'green' },
          { label: 'Total Investment', value: `₹${totalSpent.toLocaleString('en-IN')}`, icon: <FiTarget />, color: 'blue' },
          { label: 'Avg Price/Credit', value: `₹${avgPricePerCredit.toFixed(0)}`, icon: <FiGlobe />, color: 'purple' },
          { label: 'Transactions', value: totalTransactions, icon: <FiAward />, color: 'yellow' },
        ].map((m) => (
          <div key={m.label} className={`bg-white border-l-4 border-${m.color}-500 rounded-xl p-6 shadow-sm`}>
            <div className={`text-${m.color}-600 mb-3 text-xl bg-${m.color}-50 w-10 h-10 rounded-lg flex items-center justify-center`}>{m.icon}</div>
            <p className="text-3xl font-bold text-gray-900">{m.value}</p>
            <p className="text-sm text-gray-500 font-medium mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Activity</h3>
          {months.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
              <p>No activity yet</p>
              <p className="text-sm mt-1">Purchase credits to see your monthly impact</p>
            </div>
          ) : (
            <div className="space-y-4">
              {months.map(([month, data]) => {
                const maxCredits = Math.max(...months.map(([, d]) => d.credits));
                const barWidth = maxCredits > 0 ? (data.credits / maxCredits) * 100 : 0;
                return (
                  <div key={month}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 font-medium">{month}</span>
                      <span className="text-gray-900 font-bold">{data.credits.toFixed(2)} tCO₂e</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-700 shadow-sm"
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
        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Transaction History</h3>
          {!transactions || transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
              <p>No transactions recorded</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {transactions.map((txn: any, idx: number) => (
                <div key={txn.id || idx} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition">
                  <div>
                    <p className="text-gray-900 text-sm font-bold">{txn.credits?.toFixed(2)} tCO₂e</p>
                    <p className="text-gray-500 text-xs mt-0.5 font-medium">
                      {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 text-sm font-bold">
                      ₹{txn.totalPrice?.toLocaleString('en-IN')}
                    </p>
                    <p className="text-gray-400 text-xs font-mono mt-0.5">
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
        <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <FiAward className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">ESG Offset Certificate</h3>
            <p className="text-green-50 mb-6 text-lg max-w-2xl mx-auto leading-relaxed opacity-90">
              {profile?.displayName || 'Your Organization'} has offset{' '}
              <span className="text-white font-extrabold text-xl bg-white/20 px-2 rounded">{totalCredits.toFixed(2)} tCO₂e</span> of carbon emissions through verified Indian agricultural credits.
            </p>
            <p className="text-green-100 text-sm font-medium bg-white/10 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
              Equivalent to planting {Math.round(treesEquivalent)} trees or avoiding {(carKmAvoided / 1000).toFixed(0)}k km of car travel.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
