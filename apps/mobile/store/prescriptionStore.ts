import { create } from 'zustand';
import {
  prescriptionsAPI,
  type Prescription,
  type PrescriptionDetail,
  type Medicine,
} from '@/services/api';

interface PrescriptionState {
  prescriptions: Prescription[];
  currentPrescription: PrescriptionDetail | null;
  medicines: Medicine[];
  isLoading: boolean;
  error: string | null;
  fetchPrescriptions: () => Promise<void>;
  fetchPrescription: (id: number) => Promise<void>;
  fetchMedicines: (prescriptionId: number) => Promise<void>;
  updateMedicine: (prescriptionId: number, medicineId: number, data: Partial<Medicine>) => Promise<void>;
  confirmPrescription: (id: number) => Promise<void>;
  uploadPrescription: (formData: FormData) => Promise<Prescription>;
  generateHandover: (id: number, language?: string) => Promise<void>;
  clearError: () => void;
  clearCurrent: () => void;
}

export const usePrescriptionStore = create<PrescriptionState>((set, get) => ({
  prescriptions: [],
  currentPrescription: null,
  medicines: [],
  isLoading: false,
  error: null,

  fetchPrescriptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await prescriptionsAPI.list();
      set({ prescriptions: response.data, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to fetch prescriptions.';
      set({ error: message, isLoading: false });
    }
  },

  fetchPrescription: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await prescriptionsAPI.get(id);
      set({ currentPrescription: response.data });
      // Fetch medicines alongside
      await get().fetchMedicines(id);
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to fetch prescription details.';
      set({ error: message, isLoading: false });
    }
  },

  fetchMedicines: async (prescriptionId: number) => {
    try {
      const response = await prescriptionsAPI.getMedicines(prescriptionId);
      set({ medicines: response.data, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to fetch medicines.';
      set({ error: message, isLoading: false });
    }
  },

  updateMedicine: async (prescriptionId: number, medicineId: number, data: Partial<Medicine>) => {
    set({ error: null });
    try {
      const response = await prescriptionsAPI.updateMedicine(prescriptionId, medicineId, data);
      set((state) => ({
        medicines: state.medicines.map((m) => (m.id === medicineId ? response.data : m)),
      }));
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to update medicine.';
      set({ error: message });
      throw new Error(message);
    }
  },

  confirmPrescription: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await prescriptionsAPI.confirm(id);
      set((state) => ({
        currentPrescription: state.currentPrescription
          ? { ...state.currentPrescription, status: 'confirmed' }
          : null,
        isLoading: false,
      }));
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to confirm prescription.';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  uploadPrescription: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await prescriptionsAPI.upload(formData);
      const newPrescription = response.data;
      set((state) => ({
        prescriptions: [newPrescription, ...state.prescriptions],
        isLoading: false,
      }));
      return newPrescription;
    } catch (err: any) {
      const message = err.response?.data?.detail || err.response?.data?.message || 'Failed to upload prescription.';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  generateHandover: async (id: number, language: string = 'en') => {
    set({ isLoading: true, error: null });
    try {
      await prescriptionsAPI.setLanguage(id, language);
      await prescriptionsAPI.generate(id);
      set({ isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to generate handover card.';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  clearError: () => set({ error: null }),
  clearCurrent: () => set({ currentPrescription: null, medicines: [] }),
}));
