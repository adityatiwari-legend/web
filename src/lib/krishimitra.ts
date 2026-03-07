/**
 * KrishiMitra ML Backend API Client
 *
 * Connects the React frontend to the Python FastAPI ML backend
 * running at localhost:8000. All functions have try/catch and
 * return null (or []) on failure — never throw.
 */

const BASE_URL = process.env.NEXT_PUBLIC_KRISHIMITRA_URL || "http://localhost:8000";

export const krishimitraAPI = {
  /**
   * Get the latest full sensor reading + predictions.
   */
  getLatest: async (): Promise<any | null> => {
    try {
      const res = await fetch(`${BASE_URL}/api/farm/latest`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  /**
   * Get history of last 50 readings.
   */
  getHistory: async (): Promise<any[]> => {
    try {
      const res = await fetch(`${BASE_URL}/api/farm/history`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  /**
   * Send sensor data and get full report (irrigation + carbon + greenscore).
   */
  getFullReport: async (sensorData: Record<string, any>): Promise<any | null> => {
    try {
      const res = await fetch(`${BASE_URL}/api/farm/full-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sensorData),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  /**
   * Get irrigation prediction (pump ON/OFF + confidence).
   */
  getIrrigationDecision: async (sensorData: Record<string, any>): Promise<any | null> => {
    try {
      const res = await fetch(`${BASE_URL}/api/irrigation/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sensorData),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  /**
   * Get carbon absorption prediction + credit values.
   */
  getCarbonPrediction: async (farmData: Record<string, any>): Promise<any | null> => {
    try {
      const res = await fetch(`${BASE_URL}/api/carbon/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(farmData),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  /**
   * Get GreenScore calculation (weighted formula + KMeans segment).
   */
  getGreenScore: async (farmerData: Record<string, any>): Promise<any | null> => {
    try {
      const res = await fetch(`${BASE_URL}/api/greenscore/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(farmerData),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  /**
   * Health check — verify backend is running.
   */
  getHealth: async (): Promise<any | null> => {
    try {
      const res = await fetch(`${BASE_URL}/api/health`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
};
