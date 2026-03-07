'use client';

import { useQuery } from '@tanstack/react-query';
import { getCreditBatches } from '@/lib/api';
import { FiPackage, FiCheckCircle, FiClock, FiShoppingCart } from 'react-icons/fi';

export default function CreditBatchesPage() {
  const { data: batches, isLoading } = useQuery({
    queryKey: ['allBatches'],
    queryFn: () => getCreditBatches().then((r) => r.data.data),
  });

  const statusColor: Record<string, string> = {
    available: 'text-green-400 bg-green-500/10',
    sold: 'text-gray-400 bg-gray-500/10',
    pending: 'text-yellow-400 bg-yellow-500/10',
  };

  const statusIcon: Record<string, React.ReactNode> = {
    available: <FiCheckCircle className="h-4 w-4" />,
    sold: <FiShoppingCart className="h-4 w-4" />,
    pending: <FiClock className="h-4 w-4" />,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Credit Batches</h1>
        <p className="text-gray-400 mt-1">Browse verified carbon credit batches from Indian farmers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-400">Total Batches</p>
          <p className="text-2xl font-bold text-white">{batches?.length || 0}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-400">Available</p>
          <p className="text-2xl font-bold text-green-400">
            {batches?.filter((b: any) => b.status === 'available').length || 0}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-400">Total Credits (tCO₂e)</p>
          <p className="text-2xl font-bold text-white">
            {batches?.reduce((sum: number, b: any) => sum + (b.totalCredits || 0), 0).toFixed(1) || '0'}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500">Loading batches...</div>
      ) : !batches || batches.length === 0 ? (
        <div className="text-center py-20">
          <FiPackage className="h-12 w-12 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">No credit batches available</p>
          <p className="text-gray-500 text-sm mt-1">
            Batches are created when farmers aggregate enough carbon credits (300+ tCO₂e)
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch: any) => (
            <div
              key={batch.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-500/30 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-white font-semibold">Batch #{batch.id?.slice(-8)}</h4>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {batch.reportIds?.length || 0} reports aggregated
                  </p>
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColor[batch.status] || statusColor.pending}`}>
                  {statusIcon[batch.status] || statusIcon.pending}
                  {batch.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Credits</span>
                  <span className="text-white font-medium">{batch.totalCredits?.toFixed(2)} tCO₂e</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price per Credit</span>
                  <span className="text-white font-medium">₹{batch.pricePerCredit?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Value</span>
                  <span className="text-green-400 font-semibold">
                    ₹{((batch.totalCredits || 0) * (batch.pricePerCredit || 0)).toLocaleString('en-IN')}
                  </span>
                </div>
                {batch.region && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Region</span>
                    <span className="text-white">{batch.region}</span>
                  </div>
                )}
              </div>

              {batch.status === 'available' && (
                <a
                  href={`/corporate/purchase?batch=${batch.id}`}
                  className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition text-sm"
                >
                  Purchase Credits
                </a>
              )}

              <p className="text-gray-600 text-xs mt-3">
                Created: {batch.createdAt ? new Date(batch.createdAt).toLocaleDateString('en-IN') : 'N/A'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
