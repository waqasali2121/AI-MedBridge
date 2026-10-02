import { create } from 'zustand';
import { authAPI, type User, type RegisterData } from '@/services/api';
import { storeTokens, clearTokens, getAccessToken } from '@/services/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(email, password);
      await storeTokens(response.data.access, response.data.refresh);
      set({ isAuthenticated: true });
      await get().loadUser();
    } catch (err: any) {
      const message = err.response?.data?.detail || err.response?.data?.message || 'Login failed. Please check your credentials.';
      set({ error: message, isLoading: false, isAuthenticated: false, user: null });
      throw new Error(message);
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await authAPI.register(data);
      // Auto-login after registration
      await get().login(data.email, data.password);
    } catch (err: any) {
      const message = err.response?.data?.detail || err.response?.data?.email?.[0] || 'Registration failed. Please try again.';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await clearTokens();
    } catch (e) {
      // Ignore token clear errors on logout
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  loadUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await getAccessToken();
      if (!token) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      const response = await authAPI.getMe();
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      await clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
