'use client';

/**
 * useKrishiMitraData — React hook for real-time ML data polling.
 *
 * Polls the KrishiMitra ML backend every 5 seconds.
 * Falls back to simulated demo data when backend is unreachable.
 *
 * Usage:
 *   const { latestData, historyData, connected, lastUpdate } = useKrishiMitraData();
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { krishimitraAPI } from '@/lib/krishimitra';

// ── Fallback demo data (used when backend is offline) ──
const FALLBACK_DATA = {
  irrigation: {
    pump_on: false,
    confidence: 87.3,
    message: "✅ Pump OFF — Soil OK",
  },
  carbon: {
    carbon_absorbed_kg: 0.847,
    carbon_monthly_kg: 25.4,
    credit_value_today_inr: 2.96,
    credit_value_month_inr: 88.8,
  },
  greenscore: {
    green_score: 67.4,
    tier: "Gold 🥇",
    water_score: 72,
    carbon_score: 58,
    organic_score: 65,
    consistency_score: 71,
    loan_eligible: true,
    premium_seller: false,
  },
  sensors: {
    soil_moisture: 65.0,
    temperature: 31.2,
    humidity: 58.0,
    rain_probability: 0.08,
  },
};

const rand = (min: number, max: number) => Math.random() * (max - min) + min;
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export interface KrishiMitraState {
  latestData: typeof FALLBACK_DATA | null;
  historyData: any[];
  connected: boolean;
  lastUpdate: string;
}

export function useKrishiMitraData(pollInterval = 5000): KrishiMitraState {
  const [latestData, setLatestData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');
  const mountedRef = useRef(true);

  const tick = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      const [latest, history] = await Promise.all([
        krishimitraAPI.getLatest(),
        krishimitraAPI.getHistory(),
      ]);

      if (!mountedRef.current) return;

      if (latest?.irrigation) {
        setLatestData(latest);
        setHistoryData(Array.isArray(history) ? history : []);
        setConnected(true);
      } else {
        throw new Error('No real data');
      }
    } catch {
      if (!mountedRef.current) return;

      setConnected(false);
      setLatestData((prev: any) => {
        const base = prev || FALLBACK_DATA;
        const s = base.sensors;
        const newMoisture = clamp(s.soil_moisture + rand(-2, 2), 10, 85);
        const newRain = clamp(s.rain_probability + rand(-0.02, 0.02), 0, 1);
        return {
          ...base,
          sensors: {
            soil_moisture: newMoisture,
            temperature: clamp(s.temperature + rand(-0.5, 0.5), 18, 48),
            humidity: clamp(s.humidity + rand(-1, 1), 20, 95),
            rain_probability: newRain,
          },
          irrigation: {
            ...base.irrigation,
            pump_on: newMoisture < 35 && newRain < 0.2,
            message:
              newMoisture < 35 && newRain < 0.2
                ? "💧 Pump ON — Irrigating"
                : "✅ Pump OFF — Soil OK",
          },
        };
      });
    }

    if (mountedRef.current) {
      setLastUpdate(new Date().toLocaleTimeString());
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    tick();
    const interval = setInterval(tick, pollInterval);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [tick, pollInterval]);

  return { latestData, historyData, connected, lastUpdate };
}
