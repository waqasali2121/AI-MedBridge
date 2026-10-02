import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';
import { getAccessToken, clearTokens } from './auth';
import { router } from 'expo-router';

// Types
export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'patient' | 'caregiver' | 'pharmacist';
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role: 'patient' | 'caregiver';
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface Prescription {
  id: number;
  file_name: string;
  status: string;
  medicine_count: number;
  created_at: string;
  updated_at: string;
}

export interface PrescriptionDetail extends Prescription {
  file: string;
  patient: number;
  preferred_language: string;
}

export interface Medicine {
  id: number;
  prescription: number;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  confidence_score: number;
  source: 'ocr' | 'user_edit';
  is_confirmed: boolean;
}

export interface HandoverContent {
  id: number;
  prescription: number;
  language: string;
  content: {
    medicines?: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      explanation: string;
      purpose: string;
      precautions: string;
    }>;
    schedule?: Array<{
      time_of_day: string;
      medicines: string[];
      instructions: string;
    }>;
    questions_for_pharmacist?: string[];
    review_status?: string;
  };
  generated_at: string;
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await clearTokens();
      router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login/', { email, password }),
  register: (data: RegisterData) =>
    api.post<User>('/auth/register/', data),
  refresh: (refresh: string) =>
    api.post<{ access: string }>('/auth/token/refresh/', { refresh }),
  getMe: () => api.get<User>('/auth/me/'),
  updateMe: (data: Partial<User>) => api.patch<User>('/auth/me/', data),
};

// Prescriptions API
export const prescriptionsAPI = {
  upload: (formData: FormData) =>
    api.post<Prescription>('/prescriptions/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  list: () => api.get<Prescription[]>('/prescriptions/'),
  get: (id: number) => api.get<PrescriptionDetail>(`/prescriptions/${id}/`),
  getMedicines: (prescriptionId: number) =>
    api.get<Medicine[]>(`/prescriptions/${prescriptionId}/medicines/`),
  updateMedicine: (
    prescriptionId: number,
    medicineId: number,
    data: Partial<Medicine>
  ) =>
    api.patch<Medicine>(
      `/prescriptions/${prescriptionId}/medicines/${medicineId}/`,
      data
    ),
  confirm: (id: number) => api.post(`/prescriptions/${id}/confirm/`),
  setLanguage: (id: number, language: string) =>
    api.post(`/prescriptions/${id}/set-language/`, { language }),
  generate: (id: number) => api.post(`/prescriptions/${id}/generate/`),
  getHandover: (id: number) =>
    api.get<HandoverContent>(`/prescriptions/${id}/handover/`),
  getStatus: (id: number) =>
    api.get<{ status: string }>(`/prescriptions/${id}/status/`),
};

export default api;
