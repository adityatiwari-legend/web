import axios from 'axios';
import { firebaseAuth } from './firebase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Firebase token to every request
api.interceptors.request.use(async (config) => {
  const user = firebaseAuth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ── API Functions ────────────────────────────────────────

// Auth
export const registerUser = (data: { displayName: string; role: string; phone?: string; region?: string }) =>
  api.post('/auth/register', data);
export const getProfile = () => api.get('/auth/me');
export const updateProfile = (data: any) => api.put('/auth/me', data);

// Farmer
export const createFarm = (data: any) => api.post('/farmers/profile', data);
export const getFarms = () => api.get('/farmers/profile');
export const getFarmById = (id: string) => api.get(`/farmers/profile/${id}`);
export const updateFarm = (id: string, data: any) => api.put(`/farmers/profile/${id}`, data);

// Carbon
export const calculateCarbon = (data: any) => api.post('/carbon/calculate', data);
export const getCarbonReports = (farmId?: string) =>
  api.get('/carbon/reports', { params: farmId ? { farmId } : {} });
export const getTotalCredits = () => api.get('/carbon/credits');

// Profit
export const predictProfit = (data: any) => api.post('/profit/predict', data);
export const getProfitReports = () => api.get('/profit/reports');
export const getMandiPrices = () => api.get('/profit/mandi-prices');

// Credits
export const getCreditBatches = (filters?: any) => api.get('/credits/batches', { params: filters });
export const getBatchById = (id: string) => api.get(`/credits/batches/${id}`);
export const purchaseCredits = (data: any) => api.post('/credits/purchase', data);
export const getTransactions = () => api.get('/credits/transactions');
