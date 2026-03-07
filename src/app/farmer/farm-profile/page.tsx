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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Farm Profiles</h1>
          <p className="text-gray-400 mt-1">Manage your farm details</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
        >
          <Plus className="h-5 w-5" /> Add Farm
        </button>
      </div>

      {/* Add Farm Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">New Farm Profile</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Farm Name</label>
              <input
                value={form.farmName}
                onChange={(e) => setForm({ ...form, farmName: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Region</label>
              <input
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">State</label>
              <input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">District</label>
              <input
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Land Area (hectares)</label>
              <input
                type="number"
                step="0.01"
                value={form.landArea}
                onChange={(e) => setForm({ ...form, landArea: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
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
                <option value="wheat">Wheat</option>
                <option value="rice">Rice</option>
                <option value="soybean">Soybean</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Soil Type (optional)</label>
              <input
                value={form.soilType}
                onChange={(e) => setForm({ ...form, soilType: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Irrigation Type (optional)</label>
              <input
                value={form.irrigationType}
                onChange={(e) => setForm({ ...form, irrigationType: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                checked={form.organicCertified}
                onChange={(e) => setForm({ ...form, organicCertified: e.target.checked })}
                className="h-4 w-4 accent-green-500"
              />
              <label className="text-sm text-gray-300">Organic Certified</label>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Farm'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Farm List */}
      {isLoading ? (
        <div className="text-gray-500">Loading farms...</div>
      ) : !farms || farms.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <Sprout className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No farms yet. Add your first farm profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm: any) => (
            <div key={farm.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-green-500/30 transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{farm.farmName}</h3>
                  <p className="text-sm text-gray-400">{farm.district}, {farm.state}</p>
                </div>
                {farm.organicCertified && (
                  <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full">
                    Organic
                  </span>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Region</span>
                  <span className="text-white">{farm.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Land Area</span>
                  <span className="text-white">{farm.landArea} ha</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Crop</span>
                  <span className="text-white capitalize">{farm.cropType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
