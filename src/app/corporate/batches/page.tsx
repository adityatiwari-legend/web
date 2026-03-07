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
    available: 'text-green-700 bg-green-100 border border-green-200',
    sold: 'text-gray-600 bg-gray-100 border border-gray-200',
    pending: 'text-yellow-700 bg-yellow-100 border border-yellow-200',
  };

  const statusIcon: Record<string, React.ReactNode> = {
    available: <FiCheckCircle className="h-4 w-4" />,
    sold: <FiShoppingCart className="h-4 w-4" />,
    pending: <FiClock className="h-4 w-4" />,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Credit Batches</h1>
        <p className="text-gray-600 mt-1">Browse verified carbon credit batches from Indian farmers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Batches</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{batches?.length || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Available</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {batches?.filter((b: any) => b.status === 'available').length || 0}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Credits (tCO₂e)</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {batches?.reduce((sum: number, b: any) => sum + (b.totalCredits || 0), 0).toFixed(1) || '0'}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-500">Loading batches...</div>
      ) : !batches || batches.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <FiPackage className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium">No credit batches available</p>
          <p className="text-gray-400 text-sm mt-1">
            Batches are created when farmers aggregate enough carbon credits (300+ tCO₂e)
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch: any) => (
            <div
              key={batch.id}
              className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-gray-900 font-bold text-lg group-hover:text-green-600 transition">Batch #{batch.id?.slice(-8)}</h4>
                  <p className="text-gray-500 text-xs mt-1 font-medium">
                    {batch.reportIds?.length || 0} reports aggregated
                  </p>
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${statusColor[batch.status] || statusColor.pending}`}>
                  {statusIcon[batch.status] || statusIcon.pending}
                  {batch.status}
                </span>
              </div>

              <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Total Credits</span>
                  <span className="text-gray-900 font-bold">{batch.totalCredits?.toFixed(2)} tCO₂e</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Price per Credit</span>
                  <span className="text-gray-900 font-bold">₹{batch.pricePerCredit?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-200 mt-2">
                  <span className="text-gray-600 font-semibold">Total Value</span>
                  <span className="text-green-600 font-bold text-lg">
                    ₹{((batch.totalCredits || 0) * (batch.pricePerCredit || 0)).toLocaleString('en-IN')}
                  </span>
                </div>
                {batch.region && (
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200 mt-2">
                    <span className="text-gray-500 font-medium">Region</span>
                    <span className="text-gray-900">{batch.region}</span>
                  </div>
                )}
              </div>

              {batch.status === 'available' && (
                <a
                  href={`/corporate/purchase?batch=${batch.id}`}
                  className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-4"
                >
                  Purchase Credits
                </a>
              )}

              <p className="text-gray-500 text-xs mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 font-medium">
                <FiClock className="h-3 w-3 text-gray-400" />
                Created: {batch.createdAt ? new Date(batch.createdAt).toLocaleDateString('en-IN') : 'N/A'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
