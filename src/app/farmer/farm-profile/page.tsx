'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFarm, getFarms } from '@/lib/api';
import { Sprout, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FarmProfilePage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    farmName: '',
    region: '',
    state: '',
    district: '',
    landArea: '',
    cropType: 'wheat',
    soilType: '',
    irrigationType: '',
    organicCertified: false,
  });

  const { data: farms, isLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: () => getFarms().then((r) => r.data.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => createFarm(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      toast.success('Farm profile created!');
      setShowForm(false);
      setForm({
        farmName: '', region: '', state: '', district: '',
        landArea: '', cropType: 'wheat', soilType: '', irrigationType: '', organicCertified: false,
      });
    },
    onError: (err: any) => toast.error(err.response?.data?.error?.message || 'Failed to create farm'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      landArea: parseFloat(form.landArea),
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Farm Profiles</h1>
          <p className="text-[#6B7280] mt-2">Manage and track your farm details</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#38B26D] hover:bg-[#2F9E5B] shadow-lg shadow-[#38B26D]/20 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all hover:translate-y-[-2px]"
        >
          <Plus className="h-5 w-5" /> Add Farm
        </button>
      </div>

      {/* Add Farm Form */}
      {showForm && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#38B26D]/10 p-2 rounded-lg">
              <Sprout className="h-6 w-6 text-[#38B26D]" />
            </div>
            <h3 className="text-xl font-bold text-[#1F2937]">New Farm Profile</h3>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">Farm Name</label>
              <input
                value={form.farmName}
                onChange={(e) => setForm({ ...form, farmName: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">Region</label>
              <input
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">State</label>
              <input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">District</label>
              <input
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">Land Area (hectares)</label>
              <input
                type="number"
                step="0.01"
                value={form.landArea}
                onChange={(e) => setForm({ ...form, landArea: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
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
                <option value="wheat">Wheat</option>
                <option value="rice">Rice</option>
                <option value="soybean">Soybean</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">Soil Type (optional)</label>
              <input
                value={form.soilType}
                onChange={(e) => setForm({ ...form, soilType: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1F2937] mb-2">Irrigation Type (optional)</label>
              <input
                value={form.irrigationType}
                onChange={(e) => setForm({ ...form, irrigationType: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[#1F2937] focus:border-[#38B26D] focus:ring-1 focus:ring-[#38B26D] focus:outline-none transition"
              />
            </div>
            <div className="flex items-center gap-3 md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <input
                type="checkbox"
                checked={form.organicCertified}
                onChange={(e) => setForm({ ...form, organicCertified: e.target.checked })}
                className="h-5 w-5 accent-[#38B26D] rounded border-gray-300 focus:ring-[#38B26D]"
              />
              <label className="text-sm font-medium text-[#1F2937]">Organic Certified Farm</label>
            </div>
            <div className="md:col-span-2 flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-[#38B26D] hover:bg-[#2F9E5B] shadow-lg shadow-[#38B26D]/20 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:translate-y-[-2px]"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Farm'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-[#1F2937] px-8 py-3 rounded-xl font-medium transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Farm List */}
      {isLoading ? (
        <div className="text-[#6B7280] text-center py-12">Loading farms...</div>
      ) : !farms || farms.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <div className="bg-gray-50 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Sprout className="h-10 w-10 text-[#6B7280]" />
          </div>
          <h3 className="text-lg font-bold text-[#1F2937] mb-2">No farms yet</h3>
          <p className="text-[#6B7280]">Add your first farm profile to get started tracking carbon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm: any) => (
            <div key={farm.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#38B26D]/30 transition group">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1F2937] group-hover:text-[#38B26D] transition-colors">{farm.farmName}</h3>
                  <p className="text-sm text-[#6B7280] flex items-center gap-1 mt-1">
                    {farm.district}, {farm.state}
                  </p>
                </div>
                {farm.organicCertified && (
                  <span className="text-xs bg-[#38B26D]/10 text-[#38B26D] px-2.5 py-1 rounded-full font-semibold border border-[#38B26D]/20">
                    Organic
                  </span>
                )}
              </div>
              
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#6B7280]">Region</span>
                  <span className="text-[#1F2937] font-medium">{farm.region}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#6B7280]">Land Area</span>
                  <span className="text-[#1F2937] font-medium">{farm.landArea} ha</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#6B7280]">Crop</span>
                  <span className="text-[#1F2937] font-medium capitalize flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#38B26D]"></span>
                    {farm.cropType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
