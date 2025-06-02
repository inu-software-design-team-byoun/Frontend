import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  userId: number;
  accessToken: string | null;
  setAuth: (userId: number, accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: 0,
      accessToken: null,
      setAuth: (userId, accessToken) => set({ userId, accessToken }),
      clearAuth: () => set({ userId: 0, accessToken: null }),
    }),
    {
      name: "auth-storage", // storage key
      // storage: createJSONStorage(() => sessionStorage),
    }
  )
);
