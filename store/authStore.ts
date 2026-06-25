import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, University } from '../types';
import { mmkvStorage } from './storage';

interface AuthStore {
  isAuthenticated: boolean;
  isGuest: boolean;
  currentUser: User | null;
  selectedUniversity: University | null;
  hasCompletedOnboarding: boolean;

  // Actions
  setUser: (user: User) => void;
  setGuest: (university: University) => void;
  setSelectedUniversity: (university: University) => void;
  setOnboardingComplete: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isGuest: false,
      currentUser: null,
      selectedUniversity: null,
      hasCompletedOnboarding: false,

      setUser: (user: User) =>
        set({
          isAuthenticated: true,
          isGuest: false,
          currentUser: user,
          selectedUniversity: user.university,
        }),

      setGuest: (university: University) =>
        set({
          isAuthenticated: false,
          isGuest: true,
          currentUser: null,
          selectedUniversity: university,
        }),

      setSelectedUniversity: (university: University) =>
        set({ selectedUniversity: university }),

      setOnboardingComplete: () =>
        set({ hasCompletedOnboarding: true }),

      logout: () =>
        set({
          isAuthenticated: false,
          isGuest: false,
          currentUser: null,
        }),
    }),
    {
      name: 'campulse-auth',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
