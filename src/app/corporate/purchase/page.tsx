'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCreditBatches, getBatchById, purchaseCredits } from '@/lib/api';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiShoppingCart } from 'react-icons/fi';

function PurchaseForm() {
  const searchParams = useSearchParams();
  const preselectedBatch = searchParams.get('batch');
  const queryClient = useQueryClient();

  const [selectedBatchId, setSelectedBatchId] = useState(preselectedBatch || '');
  const [credits, setCredits] = useState('');
  const [success, setSuccess] = useState<any>(null);

  const { data: batches } = useQuery({
    queryKey: ['availableBatches'],
    queryFn: () => getCreditBatches({ status: 'available' }).then((r) => r.data.data),
  });

  const { data: selectedBatch } = useQuery({
    queryKey: ['batch', selectedBatchId],
    queryFn: () => getBatchById(selectedBatchId).then((r) => r.data.data),
    enabled: !!selectedBatchId,
  });

  useEffect(() => {
    if (preselectedBatch) setSelectedBatchId(preselectedBatch);
  }, [preselectedBatch]);

  const purchaseMutation = useMutation({
    mutationFn: (data: any) => purchaseCredits(data),
    onSuccess: (response) => {
      setSuccess(response.data.data);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['availableBatches'] });
      queryClient.invalidateQueries({ queryKey: ['creditBatches'] });
      toast.success('Credits purchased successfully!');
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || 'Purchase failed'),
  });

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId || !credits) return;
    purchaseMutation.mutate({
      batchId: selectedBatchId,
      credits: parseFloat(credits),
    });
  };

  const totalCost =
    selectedBatch && credits
      ? parseFloat(credits) * (selectedBatch.pricePerCredit || 0)
      : 0;

  if (success) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Purchase Credits</h1>
        </div>
        <div className="max-w-lg mx-auto bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center">
          <FiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Purchase Successful!</h2>
          <p className="text-gray-600 mb-6">Your carbon credits have been recorded.</p>
          <div className="space-y-3 text-sm bg-gray-50 border border-gray-100 rounded-xl p-5 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Credits</span>
              <span className="text-gray-900 font-bold">{success.credits?.toFixed(2)} tCO₂e</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-500 font-medium">Total Cost</span>
              <span className="text-green-600 font-bold text-lg">₹{success.totalPrice?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-gray-400 font-medium">Txn ID</span>
              <span className="text-gray-500 font-mono text-xs">{success.transactionId?.slice(-12)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setSuccess(null); setCredits(''); setSelectedBatchId(''); }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition shadow-md hover:shadow-lg"
            >
              Buy More
            </button>
            <a
              href="/corporate/impact"
              className="flex-1 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 py-3 rounded-xl font-bold transition text-center shadow-sm hover:shadow-md"
            >
              View Impact
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Purchase Credits</h1>
        <p className="text-gray-600 mt-1">Buy verified carbon credits to offset your emissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Purchase Form */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Select &amp; Purchase</h3>
          <form onSubmit={handlePurchase} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-500 font-medium mb-1">Select Batch</label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition"
                required
              >
                <option value="">Choose a credit batch...</option>
                {batches?.map((b: any) => (
                  <option key={b.id} value={b.id}>
                    Batch #{b.id.slice(-8)} — {b.totalCredits?.toFixed(1)} tCO₂e @ ₹{b.pricePerCredit}/credit
                  </option>
                ))}
              </select>
            </div>

            {selectedBatch && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Available Credits</span>
                  <span className="text-gray-900 font-bold">{selectedBatch.totalCredits?.toFixed(2)} tCO₂e</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Price per Credit</span>
                  <span className="text-gray-900 font-bold">₹{selectedBatch.pricePerCredit?.toLocaleString('en-IN')}</span>
                </div>
                {selectedBatch.region && (
                  <div className="flex justify-between pt-2 border-t border-green-200">
                    <span className="text-gray-600 font-medium">Region</span>
                    <span className="text-gray-900">{selectedBatch.region}</span>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-500 font-medium mb-1">Credits to Purchase (tCO₂e)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={selectedBatch?.totalCredits || undefined}
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition"
                required
                placeholder="Enter amount of credits"
              />
            </div>

            {totalCost > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 font-medium">Total Cost</p>
                <p className="text-3xl font-bold text-green-600">₹{totalCost.toLocaleString('en-IN')}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={purchaseMutation.isPending || !selectedBatchId || !credits}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <FiShoppingCart className="h-5 w-5" />
              {purchaseMutation.isPending ? 'Processing...' : 'Confirm Purchase'}
            </button>
          </form>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">How It Works</h3>
            <div className="space-y-6">
              {[
                { step: '1', title: 'Browse Batches', desc: 'Explore aggregated, verified credit batches from Indian farmers.' },
                { step: '2', title: 'Select Credits', desc: 'Choose the amount of carbon credits you want to purchase.' },
                { step: '3', title: 'Confirm Purchase', desc: 'Complete the transaction. Credits are transferred to your account.' },
                { step: '4', title: 'Track Impact', desc: 'Monitor your ESG offset in the impact report dashboard.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-green-600 font-bold text-lg">{item.step}</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-base">{item.title}</p>
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Why Buy Carbon Credits?</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <div className="bg-white/20 p-1 rounded-full mt-0.5"><FiCheckCircle className="text-white h-3 w-3" /></div>
                <span className="font-medium opacity-90">Meet ESG compliance and sustainability targets</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-white/20 p-1 rounded-full mt-0.5"><FiCheckCircle className="text-white h-3 w-3" /></div>
                <span className="font-medium opacity-90">Support Indian farmers practicing sustainable agriculture</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-white/20 p-1 rounded-full mt-0.5"><FiCheckCircle className="text-white h-3 w-3" /></div>
                <span className="font-medium opacity-90">Verified carbon credits with transparent provenance</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-white/20 p-1 rounded-full mt-0.5"><FiCheckCircle className="text-white h-3 w-3" /></div>
                <span className="font-medium opacity-90">Track real-time environmental impact</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PurchasePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading purchase options...</div>}>
      <PurchaseForm />
    </Suspense>
  );
}
