'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { calculateCarbon, getCarbonReports, getFarms } from '@/lib/api';
import { Leaf } from 'lucide-react';
import EmissionPieChart from '@/components/charts/EmissionPieChart';
import toast from 'react-hot-toast';

export default function CarbonReportPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    farmId: '',
    landArea: '',
    cropType: 'wheat',
    fertilizerQuantity: '',
    dieselUsage: '',
    electricityUsage: '',
  });
  const [result, setResult] = useState<any>(null);

  const { data: farms } = useQuery({
    queryKey: ['farms'],
    queryFn: () => getFarms().then((r) => r.data.data),
  });

  const { data: reports, isLoading } = useQuery({
    queryKey: ['carbonReports'],
    queryFn: () => getCarbonReports().then((r) => r.data.data),
  });

  const calculateMutation = useMutation({
    mutationFn: (data: any) => calculateCarbon(data),
    onSuccess: (response) => {
      setResult(response.data.data);
      queryClient.invalidateQueries({ queryKey: ['carbonReports'] });
      queryClient.invalidateQueries({ queryKey: ['totalCredits'] });
      toast.success('Carbon report generated!');
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || 'Calculation failed'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateMutation.mutate({
      farmId: form.farmId || undefined,
      landArea: parseFloat(form.landArea),
      cropType: form.cropType,
      fertilizerQuantity: parseFloat(form.fertilizerQuantity),
      dieselUsage: parseFloat(form.dieselUsage),
      electricityUsage: parseFloat(form.electricityUsage),
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Carbon Report</h1>
        <p className="text-gray-400 mt-1">Calculate your farm&apos;s carbon footprint</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Carbon Calculator</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {farms && farms.length > 0 && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Farm (optional — saves report)</label>
                <select
                  value={form.farmId}
                  onChange={(e) => setForm({ ...form, farmId: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                >
                  <option value="">Just calculate (don&apos;t save)</option>
                  {farms.map((f: any) => (
                    <option key={f.id} value={f.id}>{f.farmName}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-1">Land Area (hectares)</label>
              <input
                type="number"
                step="0.01"
                value={form.landArea}
                onChange={(e) => setForm({ ...form, landArea: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                placeholder="e.g. 5"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Crop Type</label>
              <select
                value={form.cropType}
                onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              >
                <option value="wheat">Wheat (2.5 t CO2/ha)</option>
                <option value="rice">Rice (3.0 t CO2/ha)</option>
                <option value="soybean">Soybean (2.0 t CO2/ha)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Fertilizer Quantity (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.fertilizerQuantity}
                onChange={(e) => setForm({ ...form, fertilizerQuantity: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                placeholder="e.g. 200"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Diesel Usage (liters)</label>
              <input
                type="number"
                step="0.1"
                value={form.dieselUsage}
                onChange={(e) => setForm({ ...form, dieselUsage: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                placeholder="e.g. 50"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Electricity Usage (kWh)</label>
              <input
                type="number"
                step="0.1"
                value={form.electricityUsage}
                onChange={(e) => setForm({ ...form, electricityUsage: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                placeholder="e.g. 300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={calculateMutation.isPending}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition"
            >
              {calculateMutation.isPending ? 'Calculating...' : 'Calculate Carbon'}
            </button>
          </form>
        </div>

        {/* Result */}
        <div className="space-y-6">
          {result && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Results</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Carbon Absorbed</span>
                  <span className="text-green-400 font-semibold">{result.carbonAbsorbed} t CO2</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Total Emissions</span>
                  <span className="text-red-400 font-semibold">{result.totalEmissions} t CO2</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Net Carbon</span>
                  <span className={`font-bold text-lg ${result.netCarbon >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {result.netCarbon} t CO2
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Estimated Credits</span>
                  <span className="text-blue-400 font-bold text-lg">{result.estimatedCredits}</span>
                </div>
              </div>

              <div className="mt-6">
                <EmissionPieChart report={result} />
              </div>
            </div>
          )}

          {/* History */}
          {reports && reports.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Report History</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {reports.map((r: any) => (
                  <div key={r.id} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                    <div>
                      <span className="text-sm text-gray-300 capitalize">{r.cropType}</span>
                      <span className="text-xs text-gray-500 ml-2">{r.landArea} ha</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${r.netCarbon >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {r.netCarbon} t
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
