'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { calculateCarbon, getCarbonReports, getFarms } from '@/lib/api';
import { Leaf, Brain } from 'lucide-react';
import EmissionPieChart from '@/components/charts/EmissionPieChart';
import CarbonCreditsMLCard from '@/components/ui/CarbonCreditsMLCard';
import { useKrishiMitraData } from '@/lib/useKrishiMitraData';
import toast from 'react-hot-toast';

export default function CarbonReportPage() {
  const queryClient = useQueryClient();
  const { latestData, connected } = useKrishiMitraData();
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Carbon Report</h1>
          <p className="text-[#6B7280] mt-2">Calculate and track your farm&apos;s carbon footprint</p>
        </div>
      </div>

      {/* ML Carbon Predictions */}
      <CarbonCreditsMLCard carbon={latestData?.carbon ?? null} connected={connected} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#38B26D]/10 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-[#38B26D]" />
            </div>
            <h3 className="text-xl font-bold text-[#1F2937]">Carbon Calculator</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {farms && farms.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-2">Select Farm (Optional)</label>
                <select
                  value={form.farmId}
                  onChange={(e) => setForm({ ...form, farmId: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                >
                  <option value="">Just calculate (don&apos;t save)</option>
                  {farms.map((f: any) => (
                    <option key={f.id} value={f.id}>{f.farmName}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">Land Area (hectares)</label>
              <input
                type="number"
                step="0.01"
                value={form.landArea}
                onChange={(e) => setForm({ ...form, landArea: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                placeholder="e.g. 5"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">Crop Type</label>
              <select
                value={form.cropType}
                onChange={(e) => setForm({ ...form, cropType: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
              >
                <option value="wheat">Wheat (2.5 t CO2/ha)</option>
                <option value="rice">Rice (3.0 t CO2/ha)</option>
                <option value="soybean">Soybean (2.0 t CO2/ha)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">Fertilizer Quantity (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.fertilizerQuantity}
                onChange={(e) => setForm({ ...form, fertilizerQuantity: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                placeholder="e.g. 200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">Diesel Usage (liters)</label>
              <input
                type="number"
                step="0.1"
                value={form.dieselUsage}
                onChange={(e) => setForm({ ...form, dieselUsage: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                placeholder="e.g. 50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">Electricity Usage (kWh)</label>
              <input
                type="number"
                step="0.1"
                value={form.electricityUsage}
                onChange={(e) => setForm({ ...form, electricityUsage: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                placeholder="e.g. 300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={calculateMutation.isPending}
              className="w-full bg-[#38B26D] hover:bg-[#2F9E5B] disabled:opacity-50 text-white py-3 rounded-xl font-semibold shadow-lg shadow-[#38B26D]/20 transition-all hover:translate-y-[-2px]"
            >
              {calculateMutation.isPending ? 'Calculating...' : 'Calculate Carbon'}
            </button>
          </form>
        </div>

        {/* Result & History Column */}
        <div className="space-y-6">
          {/* Result Card */}
          {result && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
              <h3 className="text-xl font-bold text-[#1F2937] mb-6">Calculation Results</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-[#6B7280]">Carbon Absorbed</span>
                  <span className="text-[#38B26D] font-bold text-lg">{result.carbonAbsorbed} t CO2</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-[#6B7280]">Total Emissions</span>
                  <span className="text-red-500 font-bold text-lg">{result.totalEmissions} t CO2</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-[#6B7280]">Net Carbon</span>
                  <span className={`font-bold text-xl ${result.netCarbon >= 0 ? 'text-[#38B26D]' : 'text-red-500'}`}>
                    {result.netCarbon} t CO2
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 bg-blue-50 rounded-xl px-4 -mx-4">
                  <span className="text-blue-700 font-medium">Estimated Credits</span>
                  <span className="text-blue-700 font-bold text-xl">{result.estimatedCredits}</span>
                </div>
              </div>

              <div className="mt-8">
                <EmissionPieChart report={result} />
              </div>
            </div>
          )}

          {/* History Card */}
          {reports && reports.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
              <h3 className="text-xl font-bold text-[#1F2937] mb-6">Report History</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {reports.map((r: any) => (
                  <div key={r.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 p-2 rounded-lg transition">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#1F2937] capitalize">{r.cropType}</span>
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-500 font-medium">{r.landArea} ha</span>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-1">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold block ${r.netCarbon >= 0 ? 'text-[#38B26D]' : 'text-red-500'}`}>
                        {r.netCarbon} t
                      </span>
                      <span className="text-xs text-[#6B7280]">Net Carbon</span>
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
