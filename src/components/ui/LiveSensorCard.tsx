'use client';

import { Thermometer, Droplets, Wind, CloudRain } from 'lucide-react';

interface SensorData {
  soil_moisture: number;
  temperature: number;
  humidity: number;
  rain_probability: number;
}

interface LiveSensorCardProps {
  sensors: SensorData | null;
  connected: boolean;
  lastUpdate: string;
}

export default function LiveSensorCard({ sensors, connected, lastUpdate }: LiveSensorCardProps) {
  const s = sensors || { soil_moisture: 0, temperature: 0, humidity: 0, rain_probability: 0 };

  const items = [
    {
      label: 'Soil Moisture',
      value: `${s.soil_moisture.toFixed(1)}%`,
      icon: Droplets,
      color: s.soil_moisture < 30 ? 'text-red-500' : s.soil_moisture > 70 ? 'text-blue-500' : 'text-[#38B26D]',
      bgColor: s.soil_moisture < 30 ? 'bg-red-50' : s.soil_moisture > 70 ? 'bg-blue-50' : 'bg-green-50',
    },
    {
      label: 'Temperature',
      value: `${s.temperature.toFixed(1)}°C`,
      icon: Thermometer,
      color: s.temperature > 40 ? 'text-red-500' : s.temperature < 15 ? 'text-blue-500' : 'text-orange-500',
      bgColor: s.temperature > 40 ? 'bg-red-50' : s.temperature < 15 ? 'bg-blue-50' : 'bg-orange-50',
    },
    {
      label: 'Humidity',
      value: `${s.humidity.toFixed(1)}%`,
      icon: Wind,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-50',
    },
    {
      label: 'Rain Chance',
      value: `${(s.rain_probability * 100).toFixed(0)}%`,
      icon: CloudRain,
      color: s.rain_probability > 0.5 ? 'text-blue-600' : 'text-gray-500',
      bgColor: s.rain_probability > 0.5 ? 'bg-blue-50' : 'bg-gray-50',
    },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-[#1F2937]">Live Sensor Feed</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
          <span className="text-xs text-[#6B7280]">
            {connected ? 'Live' : 'Simulated'} · {lastUpdate}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className={`${item.bgColor} rounded-xl p-4 transition-all hover:scale-[1.02]`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-xs font-medium text-[#6B7280]">{item.label}</span>
              </div>
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
