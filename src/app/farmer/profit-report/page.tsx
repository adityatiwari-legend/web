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
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-[#1F2937]">Profit Report</h1>
        <p className="text-[#6B7280] mt-2">Predict your farming profits and analyze costs</p>
      </div>

      {/* Mandi Prices Reference */}
      {mandiPrices && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h4 className="text-sm font-bold text-[#1F2937] mb-4 uppercase tracking-wider">Current Mandi Prices (₹/quintal)</h4>
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm">
            {Object.entries(mandiPrices).map(([crop, prices]: [string, any]) => (
              <span key={crop} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                <span className="capitalize font-semibold text-[#1F2937]">{crop}</span>
                <span className="text-[#38B26D] font-bold">₹{prices.avg}</span>
                <span className="text-[#6B7280] text-xs font-medium">(₹{prices.min}–₹{prices.max})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
          <h3 className="text-xl font-bold text-[#1F2937] mb-6">Profit Predictor</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            {farms && farms.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">Select Farm (Optional)</label>
                <select
                  value={form.farmId}
                  onChange={(e) => setForm({ ...form, farmId: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
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
                <label className="block text-sm font-medium text-[#1F2937] mb-2">Crop Type</label>
                <select
                  value={form.cropType}
                  onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                >
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="soybean">Soybean</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">Land Area (ha)</label>
                <input
                  type="number" step="0.01"
                  value={form.landArea}
                  onChange={(e) => setForm({ ...form, landArea: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">Seed Cost (₹)</label>
                <input
                  type="number"
                  value={form.seedCost}
                  onChange={(e) => setForm({ ...form, seedCost: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">Fertilizer Cost (₹)</label>
                <input
                  type="number"
                  value={form.fertilizerCost}
                  onChange={(e) => setForm({ ...form, fertilizerCost: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">Irrigation Cost (₹)</label>
                <input
                  type="number"
                  value={form.irrigationCost}
                  onChange={(e) => setForm({ ...form, irrigationCost: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">Labor Cost (₹)</label>
                <input
                  type="number"
                  value={form.laborCost}
                  onChange={(e) => setForm({ ...form, laborCost: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">Mandi Price (₹/quintal)</label>
              <input
                type="number"
                value={form.mandiPrice}
                onChange={(e) => setForm({ ...form, mandiPrice: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                required
              />
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <input
                type="checkbox"
                checked={form.isOrganic}
                onChange={(e) => setForm({ ...form, isOrganic: e.target.checked })}
                className="h-5 w-5 accent-[#38B26D] rounded border-gray-300 focus:ring-[#38B26D]"
              />
              <label className="text-sm font-medium text-[#1F2937]">Organic farming (+10% yield bonus)</label>
            </div>

            <button
              type="submit"
              disabled={predictMutation.isPending}
              className="w-full bg-[#38B26D] hover:bg-[#2F9E5B] shadow-lg shadow-[#38B26D]/20 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition hover:translate-y-[-2px]"
            >
              {predictMutation.isPending ? 'Predicting...' : 'Predict Profit'}
            </button>
          </form>
        </div>

        {/* Result */}
        <div className="space-y-6">
          {result && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
              <h3 className="text-xl font-bold text-[#1F2937] mb-6">Prediction Results</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-[#6B7280]">Predicted Yield</span>
                  <span className="text-[#1F2937] font-semibold">{result.predictedYield} quintals</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-[#6B7280]">Revenue</span>
                  <span className="text-[#38B26D] font-semibold">₹{result.revenue?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-[#6B7280]">Total Cost</span>
                  <span className="text-red-500 font-semibold">₹{result.totalCost?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-gray-50 rounded-xl px-4 -mx-4">
                  <span className="text-[#1F2937] font-bold">Total Profit</span>
                  <span className={`font-bold text-2xl ${result.profit >= 0 ? 'text-[#38B26D]' : 'text-red-500'}`}>
                    ₹{result.profit?.toLocaleString('en-IN')}
                  </span>
                </div>
                {result.organicBonus > 0 && (
                  <div className="flex justify-between py-2 px-2">
                    <span className="text-[#6B7280] text-sm">Organic Bonus</span>
                    <span className="text-[#38B26D] text-sm font-medium">+{(result.organicBonus * 100).toFixed(0)}%</span>
                  </div>
                )}
                {result.fertilizerOverusePenalty > 0 && (
                  <div className="flex justify-between py-2 px-2">
                    <span className="text-[#6B7280] text-sm">Overuse Penalty</span>
                    <span className="text-red-500 text-sm font-medium">-{(result.fertilizerOverusePenalty * 100).toFixed(0)}%</span>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <ProfitBarChart report={result} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
