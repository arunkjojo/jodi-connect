import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Registration Progress Store
interface RegistrationState {
  currentStep: number;
  totalSteps: number;
  formData: Record<string, any>;
  isCompleted: boolean;
  lastSavedAt: Date | null;
  referralCode: string;
  
  // Actions
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Record<string, any>) => void;
  setReferralCode: (code: string) => void;
  markCompleted: () => void;
  resetProgress: () => void;
  saveProgress: () => void;
}

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      totalSteps: 4,
      formData: {},
      isCompleted: false,
      lastSavedAt: null,
      referralCode: '',

      setCurrentStep: (step) => set({ currentStep: step }),
      
      updateFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data },
        lastSavedAt: new Date()
      })),
      
      setReferralCode: (code) => set({ referralCode: code }),
      
      markCompleted: () => set({ isCompleted: true, lastSavedAt: new Date() }),
      
      resetProgress: () => set({
        currentStep: 1,
        formData: {},
        isCompleted: false,
        lastSavedAt: null,
        referralCode: ''
      }),
      
      saveProgress: () => set({ lastSavedAt: new Date() })
    }),
    {
      name: 'registration-progress',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// App State Store
interface AppState {
  language: string;
  isOnline: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  setLanguage: (lang: string) => void;
  setOnlineStatus: (status: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      isOnline: navigator.onLine,
      loading: false,
      error: null,

      setLanguage: (lang) => set({ language: lang }),
      setOnlineStatus: (status) => set({ isOnline: status }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'app-state',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Auth State Store
interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  applicationStatus: 'incomplete' | 'completed' | 'pending';
  
  // Actions
  setUser: (user: any) => void;
  setApplicationStatus: (status: 'incomplete' | 'completed' | 'pending') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      applicationStatus: 'incomplete',

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      setApplicationStatus: (status) => set({ applicationStatus: status }),
      
      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        applicationStatus: 'incomplete'
      })
    }),
    {
      name: 'auth-state',
      storage: createJSONStorage(() => localStorage),
    }
  )
);