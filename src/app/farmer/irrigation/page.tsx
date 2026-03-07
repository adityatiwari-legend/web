'use client';

import { useKrishiMitraData } from '@/lib/useKrishiMitraData';
import LiveSensorCard from '@/components/ui/LiveSensorCard';
import IrrigationCard from '@/components/ui/IrrigationCard';
import { Droplets, Brain, History, TrendingDown, TrendingUp } from 'lucide-react';

export default function IrrigationPage() {
  const { latestData, historyData, connected, lastUpdate } = useKrishiMitraData();

  // Compute stats from history
  const pumpOnCount = historyData.filter((h) => h?.irrigation?.pump_on).length;
  const pumpOffCount = historyData.length - pumpOnCount;
  const avgMoisture =
    historyData.length > 0
      ? historyData.reduce((sum, h) => sum + (h?.sensors?.soil_moisture || 0), 0) / historyData.length
      : 0;
  const avgConfidence =
    historyData.length > 0
      ? historyData.reduce((sum, h) => sum + (h?.irrigation?.confidence || 0), 0) / historyData.length
      : 0;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1F2937]">Irrigation AI</h1>
        <p className="text-[#6B7280] mt-2">
          ML-powered smart irrigation decisions based on real-time sensor data
        </p>
      </div>

      {/* Status Banner */}
      <div className={`rounded-2xl p-5 flex items-center gap-4 ${
        connected
          ? 'bg-green-50 border border-green-200'
          : 'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className={`p-3 rounded-xl ${connected ? 'bg-green-500' : 'bg-yellow-500'}`}>
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className={`font-bold ${connected ? 'text-green-700' : 'text-yellow-700'}`}>
            {connected ? 'ML Backend Connected' : 'Running in Demo Mode'}
          </p>
          <p className="text-sm text-[#6B7280]">
            {connected
              ? `Receiving live predictions · Last update: ${lastUpdate}`
              : 'Start the KrishiMitra ML server for real-time predictions'}
          </p>
        </div>
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IrrigationCard irrigation={latestData?.irrigation ?? null} connected={connected} />
        <LiveSensorCard sensors={latestData?.sensors ?? null} connected={connected} lastUpdate={lastUpdate} />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-[#6B7280]">Pump ON Events</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{pumpOnCount}</p>
          <p className="text-xs text-[#6B7280] mt-1">out of {historyData.length} readings</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-green-500" />
            <span className="text-xs text-[#6B7280]">Pump OFF Events</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{pumpOffCount}</p>
          <p className="text-xs text-[#6B7280] mt-1">water saved</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="h-4 w-4 text-cyan-500" />
            <span className="text-xs text-[#6B7280]">Avg Moisture</span>
          </div>
          <p className="text-2xl font-bold text-cyan-600">{avgMoisture.toFixed(1)}%</p>
          <p className="text-xs text-[#6B7280] mt-1">across readings</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-[#38B26D]" />
            <span className="text-xs text-[#6B7280]">Avg Confidence</span>
          </div>
          <p className="text-2xl font-bold text-[#38B26D]">{avgConfidence.toFixed(1)}%</p>
          <p className="text-xs text-[#6B7280] mt-1">model accuracy</p>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
        <div className="flex items-center gap-3 mb-5">
          <History className="h-5 w-5 text-[#6B7280]" />
          <h3 className="text-lg font-bold text-[#1F2937]">Recent Predictions</h3>
        </div>

        {historyData.length === 0 ? (
          <p className="text-[#6B7280] text-center py-8">
            No history yet. Data will appear as the ML backend processes sensor readings.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-3 text-[#6B7280] font-medium">Time</th>
                  <th className="text-left py-3 px-3 text-[#6B7280] font-medium">Moisture</th>
                  <th className="text-left py-3 px-3 text-[#6B7280] font-medium">Temp</th>
                  <th className="text-left py-3 px-3 text-[#6B7280] font-medium">Humidity</th>
                  <th className="text-left py-3 px-3 text-[#6B7280] font-medium">Rain %</th>
                  <th className="text-left py-3 px-3 text-[#6B7280] font-medium">Pump</th>
                  <th className="text-left py-3 px-3 text-[#6B7280] font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {historyData.slice(0, 20).map((entry, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                    <td className="py-2.5 px-3 text-[#6B7280]">
                      {entry?.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-[#1F2937] font-medium">
                      {entry?.sensors?.soil_moisture?.toFixed(1) ?? '-'}%
                    </td>
                    <td className="py-2.5 px-3 text-[#1F2937]">
                      {entry?.sensors?.temperature?.toFixed(1) ?? '-'}°C
                    </td>
                    <td className="py-2.5 px-3 text-[#1F2937]">
                      {entry?.sensors?.humidity?.toFixed(1) ?? '-'}%
                    </td>
                    <td className="py-2.5 px-3 text-[#1F2937]">
                      {entry?.sensors?.rain_probability != null
                        ? (entry.sensors.rain_probability * 100).toFixed(0) + '%'
                        : '-'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        entry?.irrigation?.pump_on
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {entry?.irrigation?.pump_on ? '💧 ON' : '✅ OFF'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#1F2937] font-medium">
                      {entry?.irrigation?.confidence?.toFixed(1) ?? '-'}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
