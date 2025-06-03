import { create } from "zustand";
import { persist } from "zustand/middleware";
// import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  userId: number;
  accessToken: string | null;
  subjectCode: number;
  setUserId: (userId: number) => void;
  setAuth: (userId: number, accessToken: string) => void;
  clearAuth: () => void;
  setSubjectCode: (code: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: 0,
      accessToken: null,
      subjectCode: 1,
      setUserId: (userId) => set({ userId }),
      setAuth: (userId, accessToken) => set({ userId, accessToken }),
      clearAuth: () => set({ userId: 0, accessToken: null }),
      setSubjectCode: (code) => set({ subjectCode: code }),
    }),
    {
      name: "auth-storage", // storage key
      // storage: createJSONStorage(() => sessionStorage),
    }
  )
);
