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
          <h1 className="text-3xl font-bold text-white">Purchase Credits</h1>
        </div>
        <div className="max-w-lg mx-auto bg-gray-900 border border-green-500/30 rounded-2xl p-8 text-center">
          <FiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Purchase Successful!</h2>
          <p className="text-gray-400 mb-6">Your carbon credits have been recorded.</p>
          <div className="space-y-2 text-sm bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-400">Credits</span>
              <span className="text-white font-medium">{success.credits?.toFixed(2)} tCO₂e</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Cost</span>
              <span className="text-green-400 font-semibold">₹{success.totalPrice?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Transaction ID</span>
              <span className="text-white font-mono text-xs">{success.transactionId?.slice(-12)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setSuccess(null); setCredits(''); setSelectedBatchId(''); }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Buy More
            </button>
            <a
              href="/corporate/impact"
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition text-center"
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
        <h1 className="text-3xl font-bold text-white">Purchase Credits</h1>
        <p className="text-gray-400 mt-1">Buy verified carbon credits to offset your emissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Purchase Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Select &amp; Purchase</h3>
          <form onSubmit={handlePurchase} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Select Batch</label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
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
              <div className="bg-gray-800 rounded-lg p-4 text-sm space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-400">Available Credits</span>
                  <span className="text-white">{selectedBatch.totalCredits?.toFixed(2)} tCO₂e</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price per Credit</span>
                  <span className="text-white">₹{selectedBatch.pricePerCredit?.toLocaleString('en-IN')}</span>
                </div>
                {selectedBatch.region && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Region</span>
                    <span className="text-white">{selectedBatch.region}</span>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-1">Credits to Purchase (tCO₂e)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={selectedBatch?.totalCredits || undefined}
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                required
                placeholder="Enter amount of credits"
              />
            </div>

            {totalCost > 0 && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-400">Total Cost</p>
                <p className="text-3xl font-bold text-green-400">₹{totalCost.toLocaleString('en-IN')}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={purchaseMutation.isPending || !selectedBatchId || !credits}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              <FiShoppingCart />
              {purchaseMutation.isPending ? 'Processing...' : 'Confirm Purchase'}
            </button>
          </form>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Browse Batches', desc: 'Explore aggregated, verified credit batches from Indian farmers.' },
                { step: '2', title: 'Select Credits', desc: 'Choose the amount of carbon credits you want to purchase.' },
                { step: '3', title: 'Confirm Purchase', desc: 'Complete the transaction. Credits are transferred to your account.' },
                { step: '4', title: 'Track Impact', desc: 'Monitor your ESG offset in the impact report dashboard.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <span className="text-green-400 font-bold text-sm">{item.step}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{item.title}</p>
                    <p className="text-gray-400 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Why Buy Carbon Credits?</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2"><FiCheckCircle className="text-green-500 mt-0.5 shrink-0" /> Meet ESG compliance and sustainability targets</li>
              <li className="flex items-start gap-2"><FiCheckCircle className="text-green-500 mt-0.5 shrink-0" /> Support Indian farmers practicing sustainable agriculture</li>
              <li className="flex items-start gap-2"><FiCheckCircle className="text-green-500 mt-0.5 shrink-0" /> Verified carbon credits with transparent provenance</li>
              <li className="flex items-start gap-2"><FiCheckCircle className="text-green-500 mt-0.5 shrink-0" /> Track real-time environmental impact</li>
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
