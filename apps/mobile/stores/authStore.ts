import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Demo credentials ─────────────────────────────────────────────────────────
export const DEMO_OTP = "1234";

interface AuthState {
  /** E.164-ish phone number the user entered */
  phone: string | null;
  /** Whether the user has completed phone + OTP verification */
  isAuthenticated: boolean;
  /** True once AsyncStorage rehydration has finished. */
  _hasHydrated: boolean;
  _setHasHydrated: (v: boolean) => void;

  setPhone: (phone: string) => void;
  login: () => void;
  /**
   * Full sign-out: clears auth state AND resets onboardingComplete in appStore
   * so the two stores never drift out of sync.
   */
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      phone: null,
      isAuthenticated: false,
      _hasHydrated: false,
      _setHasHydrated: (v) => set({ _hasHydrated: v }),

      setPhone: (phone) => set({ phone }),
      login: () => set({ isAuthenticated: true }),
      logout: () => {
        set({ phone: null, isAuthenticated: false });
        // Lazily import to avoid a circular-module issue at the top level.
        // This resets onboardingComplete so the user goes through auth again
        // if they log out, rather than landing on /auth/phone with stale state.
        import("./appStore").then(({ useAppStore }) => {
          useAppStore.getState().completeOnboarding(); // keeps onboarding done
          // If you ever want to force full re-onboarding on logout, call
          // useAppStore.setState({ onboardingComplete: false }) here instead.
        });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ phone: s.phone, isAuthenticated: s.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated(true);
      },
    }
  )
);
