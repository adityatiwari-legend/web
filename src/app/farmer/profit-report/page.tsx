'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { predictProfit, getProfitReports, getFarms, getMandiPrices } from '@/lib/api';
import ProfitBarChart from '@/components/charts/ProfitBarChart';
import toast from 'react-hot-toast';

export default function ProfitReportPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    farmId: '',
    cropType: 'wheat',
    landArea: '',
    fertilizerCost: '',
    irrigationCost: '',
    seedCost: '',
    laborCost: '',
    mandiPrice: '',
    isOrganic: false,
  });
  const [result, setResult] = useState<any>(null);

  const { data: farms } = useQuery({
    queryKey: ['farms'],
    queryFn: () => getFarms().then((r) => r.data.data),
  });

  const { data: reports } = useQuery({
    queryKey: ['profitReports'],
    queryFn: () => getProfitReports().then((r) => r.data.data),
  });

  const { data: mandiPrices } = useQuery({
    queryKey: ['mandiPrices'],
    queryFn: () => getMandiPrices().then((r) => r.data.data),
  });

  const predictMutation = useMutation({
    mutationFn: (data: any) => predictProfit(data),
    onSuccess: (response) => {
      setResult(response.data.data);
      queryClient.invalidateQueries({ queryKey: ['profitReports'] });
      toast.success('Profit predicted!');
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || 'Prediction failed'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    predictMutation.mutate({
      farmId: form.farmId || undefined,
      cropType: form.cropType,
      landArea: parseFloat(form.landArea),
      fertilizerCost: parseFloat(form.fertilizerCost),
      irrigationCost: parseFloat(form.irrigationCost),
      seedCost: parseFloat(form.seedCost),
      laborCost: parseFloat(form.laborCost),
      mandiPrice: parseFloat(form.mandiPrice),
      isOrganic: form.isOrganic,
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Profit Report</h1>
        <p className="text-gray-400 mt-1">Predict your farming profits</p>
      </div>

      {/* Mandi Prices Reference */}
      {mandiPrices && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Current Mandi Prices (₹/quintal)</h4>
          <div className="flex gap-6 text-sm">
            {Object.entries(mandiPrices).map(([crop, prices]: [string, any]) => (
              <span key={crop} className="text-gray-400">
                <span className="capitalize text-white">{crop}</span>: ₹{prices.avg}
                <span className="text-gray-600 ml-1">(₹{prices.min}–₹{prices.max})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Profit Predictor</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {farms && farms.length > 0 && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Farm (optional)</label>
                <select
                  value={form.farmId}
                  onChange={(e) => setForm({ ...form, farmId: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                >
                  <option value="">Just predict (don&apos;t save)</option>
                  {farms.map((f: any) => (
                    <option key={f.id} value={f.id}>{f.farmName}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Crop Type</label>
                <select
                  value={form.cropType}
                  onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                >
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="soybean">Soybean</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Land Area (ha)</label>
                <input
                  type="number" step="0.01"
                  value={form.landArea}
                  onChange={(e) => setForm({ ...form, landArea: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Seed Cost (₹)</label>
                <input
                  type="number"
                  value={form.seedCost}
                  onChange={(e) => setForm({ ...form, seedCost: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Fertilizer Cost (₹)</label>
                <input
                  type="number"
                  value={form.fertilizerCost}
                  onChange={(e) => setForm({ ...form, fertilizerCost: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Irrigation Cost (₹)</label>
                <input
                  type="number"
                  value={form.irrigationCost}
                  onChange={(e) => setForm({ ...form, irrigationCost: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Labor Cost (₹)</label>
                <input
                  type="number"
                  value={form.laborCost}
                  onChange={(e) => setForm({ ...form, laborCost: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Mandi Price (₹/quintal)</label>
              <input
                type="number"
                value={form.mandiPrice}
                onChange={(e) => setForm({ ...form, mandiPrice: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.isOrganic}
                onChange={(e) => setForm({ ...form, isOrganic: e.target.checked })}
                className="h-4 w-4 accent-green-500"
              />
              <label className="text-sm text-gray-300">Organic farming (+10% yield bonus)</label>
            </div>

            <button
              type="submit"
              disabled={predictMutation.isPending}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition"
            >
              {predictMutation.isPending ? 'Predicting...' : 'Predict Profit'}
            </button>
          </form>
        </div>

        {/* Result */}
        <div className="space-y-6">
          {result && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Prediction Results</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Predicted Yield</span>
                  <span className="text-white font-semibold">{result.predictedYield} quintals</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Revenue</span>
                  <span className="text-green-400 font-semibold">₹{result.revenue?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Total Cost</span>
                  <span className="text-red-400 font-semibold">₹{result.totalCost?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Profit</span>
                  <span className={`font-bold text-xl ${result.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ₹{result.profit?.toLocaleString('en-IN')}
                  </span>
                </div>
                {result.organicBonus > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">Organic Bonus</span>
                    <span className="text-green-400">+{(result.organicBonus * 100).toFixed(0)}%</span>
                  </div>
                )}
                {result.fertilizerOverusePenalty > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">Overuse Penalty</span>
                    <span className="text-red-400">-{(result.fertilizerOverusePenalty * 100).toFixed(0)}%</span>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <ProfitBarChart report={result} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
