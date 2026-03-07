'use client';

import { useKrishiMitraData } from '@/lib/useKrishiMitraData';
import LiveSensorCard from '@/components/ui/LiveSensorCard';
import { Activity, Wifi, WifiOff, Clock, BarChart3 } from 'lucide-react';

export default function SensorsPage() {
  const { latestData, historyData, connected, lastUpdate } = useKrishiMitraData(3000);

  // Build chart-like trend from last 20 history entries
  const recentHistory = historyData.slice(-20);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1F2937]">Live Sensors</h1>
          <p className="text-[#6B7280] mt-2">Real-time ESP32 sensor data streamed from your field</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
          connected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
        }`}>
          {connected ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-yellow-600" />}
          <span className={`text-sm font-medium ${connected ? 'text-green-700' : 'text-yellow-700'}`}>
            {connected ? 'Connected' : 'Simulated'}
          </span>
        </div>
      </div>

      {/* Main Sensor Card */}
      <LiveSensorCard
        sensors={latestData?.sensors ?? null}
        connected={connected}
        lastUpdate={lastUpdate}
      />

      {/* Sensor History Trend */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
        <div className="flex items-center gap-3 mb-5">
          <BarChart3 className="h-5 w-5 text-[#6B7280]" />
          <h3 className="text-lg font-bold text-[#1F2937]">Sensor Trend (Last {recentHistory.length} Readings)</h3>
        </div>

        {recentHistory.length === 0 ? (
          <p className="text-[#6B7280] text-center py-8">
            Waiting for sensor data...
          </p>
        ) : (
          <div className="overflow-x-auto">
            {/* Simple bar visualization for soil moisture trend */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-[#6B7280] mb-3">Soil Moisture Trend</h4>
              <div className="flex items-end gap-1 h-32">
                {recentHistory.map((entry, i) => {
                  const val = entry?.sensors?.soil_moisture || 0;
                  const height = Math.max((val / 100) * 100, 4);
                  const color = val < 30 ? 'bg-red-400' : val > 70 ? 'bg-blue-400' : 'bg-[#38B26D]';
                  return (
                    <div
                      key={i}
                      className={`${color} rounded-t flex-1 min-w-[8px] transition-all duration-300 relative group`}
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        {val.toFixed(1)}%
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-[#6B7280]">Oldest</span>
                <span className="text-[10px] text-[#6B7280]">Latest</span>
              </div>
            </div>

            {/* Temperature trend */}
            <div>
              <h4 className="text-sm font-medium text-[#6B7280] mb-3">Temperature Trend</h4>
              <div className="flex items-end gap-1 h-32">
                {recentHistory.map((entry, i) => {
                  const val = entry?.sensors?.temperature || 0;
                  const pct = Math.max(((val - 10) / 40) * 100, 4); // normalize 10-50°C
                  const color = val > 40 ? 'bg-red-400' : val > 30 ? 'bg-orange-400' : 'bg-cyan-400';
                  return (
                    <div
                      key={i}
                      className={`${color} rounded-t flex-1 min-w-[8px] transition-all duration-300 relative group`}
                      style={{ height: `${Math.min(pct, 100)}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        {val.toFixed(1)}°C
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-[#6B7280]">Oldest</span>
                <span className="text-[10px] text-[#6B7280]">Latest</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Raw Data Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
        <div className="flex items-center gap-3 mb-5">
          <Clock className="h-5 w-5 text-[#6B7280]" />
          <h3 className="text-lg font-bold text-[#1F2937]">Raw Sensor Log</h3>
        </div>

        {recentHistory.length === 0 ? (
          <p className="text-[#6B7280] text-center py-8">No data yet.</p>
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
                </tr>
              </thead>
              <tbody>
                {[...recentHistory].reverse().map((entry, i) => (
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
