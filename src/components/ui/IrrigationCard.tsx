'use client';

import { Droplets, Power, ShieldCheck } from 'lucide-react';

interface IrrigationData {
  pump_on: boolean;
  confidence: number;
  message: string;
}

interface IrrigationCardProps {
  irrigation: IrrigationData | null;
  connected: boolean;
}

export default function IrrigationCard({ irrigation, connected }: IrrigationCardProps) {
  const data = irrigation || { pump_on: false, confidence: 0, message: 'Waiting for data...' };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-[#1F2937]">Irrigation AI</h3>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#38B26D]" />
          <span className="text-xs text-[#6B7280]">ML Model</span>
        </div>
      </div>

      {/* Pump Status */}
      <div className={`rounded-xl p-5 mb-4 flex items-center gap-4 transition-all ${
        data.pump_on
          ? 'bg-blue-50 border border-blue-200'
          : 'bg-green-50 border border-green-200'
      }`}>
        <div className={`p-3 rounded-full ${data.pump_on ? 'bg-blue-500' : 'bg-green-500'}`}>
          {data.pump_on ? (
            <Droplets className="h-6 w-6 text-white animate-pulse" />
          ) : (
            <Power className="h-6 w-6 text-white" />
          )}
        </div>
        <div>
          <p className={`text-lg font-bold ${data.pump_on ? 'text-blue-700' : 'text-green-700'}`}>
            Pump {data.pump_on ? 'ON' : 'OFF'}
          </p>
          <p className="text-sm text-[#6B7280]">{data.message}</p>
        </div>
      </div>

      {/* Confidence Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[#6B7280]">Model Confidence</span>
          <span className="text-sm font-bold text-[#1F2937]">{data.confidence.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-700 ${
              data.confidence > 80 ? 'bg-[#38B26D]' : data.confidence > 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(data.confidence, 100)}%` }}
          />
        </div>
      </div>

      {!connected && (
        <p className="text-xs text-yellow-600 mt-3 bg-yellow-50 px-3 py-1.5 rounded-lg">
          ⚠ Using simulated data — start ML backend to see live predictions
        </p>
      )}
    </div>
  );
}
