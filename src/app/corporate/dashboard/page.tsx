'use client';

import { useQuery } from '@tanstack/react-query';
import { getCreditBatches, getTransactions } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import StatCard from '@/components/ui/StatCard';
import { FiPackage, FiDollarSign, FiTrendingUp, FiShoppingCart } from 'react-icons/fi';

export default function CorporateDashboardPage() {
  const { profile } = useAuth();

  const { data: batches } = useQuery({
    queryKey: ['creditBatches'],
    queryFn: () => getCreditBatches({ status: 'available' }).then((r) => r.data.data),
  });

  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => getTransactions().then((r) => r.data.data),
  });

  const availableBatches = batches?.length || 0;
  const totalAvailableCredits = batches?.reduce((sum: number, b: any) => sum + (b.totalCredits || 0), 0) || 0;
  const totalPurchased = transactions?.reduce((sum: number, t: any) => sum + (t.credits || 0), 0) || 0;
  const totalSpent = transactions?.reduce((sum: number, t: any) => sum + (t.totalPrice || 0), 0) || 0;

  // Recent transactions
  const recentTxns = transactions?.slice(0, 5) || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Corporate Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Welcome back, {profile?.displayName || 'ESG Buyer'}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Available Batches"
          value={availableBatches}
          icon={<FiPackage className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Available Credits"
          value={`${totalAvailableCredits.toFixed(1)} tCO₂e`}
          icon={<FiTrendingUp className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Credits Purchased"
          value={`${totalPurchased.toFixed(1)} tCO₂e`}
          icon={<FiShoppingCart className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Total Invested"
          value={`₹${totalSpent.toLocaleString('en-IN')}`}
          icon={<FiDollarSign className="h-6 w-6" />}
          color="yellow"
        />
      </div>

      {/* Quick Actions + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/corporate/batches"
              className="flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-750 rounded-lg transition group"
            >
              <div className="p-2 bg-green-500/10 rounded-lg">
                <FiPackage className="text-green-400 h-5 w-5" />
              </div>
              <div>
                <p className="text-white font-medium group-hover:text-green-400 transition">Browse Credit Batches</p>
                <p className="text-gray-400 text-sm">Explore verified carbon credit batches</p>
              </div>
            </a>
            <a
              href="/corporate/purchase"
              className="flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-750 rounded-lg transition group"
            >
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <FiShoppingCart className="text-blue-400 h-5 w-5" />
              </div>
              <div>
                <p className="text-white font-medium group-hover:text-blue-400 transition">Purchase Credits</p>
                <p className="text-gray-400 text-sm">Buy carbon credits to offset emissions</p>
              </div>
            </a>
            <a
              href="/corporate/impact"
              className="flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-750 rounded-lg transition group"
            >
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <FiTrendingUp className="text-purple-400 h-5 w-5" />
              </div>
              <div>
                <p className="text-white font-medium group-hover:text-purple-400 transition">View Impact Report</p>
                <p className="text-gray-400 text-sm">Track your ESG impact and offset history</p>
              </div>
            </a>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
          {recentTxns.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FiShoppingCart className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No purchases yet</p>
              <p className="text-sm mt-1">Start by browsing available credit batches</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTxns.map((txn: any) => (
                <div key={txn.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-white text-sm font-medium">
                      {txn.credits?.toFixed(2)} tCO₂e
                    </p>
                    <p className="text-gray-400 text-xs">
                      Batch #{txn.batchId?.slice(-6)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 text-sm font-semibold">
                      ₹{txn.totalPrice?.toLocaleString('en-IN')}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString('en-IN') : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
