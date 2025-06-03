// src/hooks/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  userId: number;
  accessToken: string | null;
  subjectCode: number;

  teacherName: string;
  setTeacherName: (name: string) => void;

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
      teacherName: "",
      setTeacherName: (name) => set({ teacherName: name }),

      setUserId: (userId) => set({ userId }),
      setAuth: (userId, accessToken) => set({ userId, accessToken }),
      clearAuth: () => set({ userId: 0, accessToken: null, teacherName: "" }), // 로그아웃 시 이름까지 초기화
      setSubjectCode: (code) => set({ subjectCode: code }),
    }),
    {
      name: "auth-storage",
      // storage: createJSONStorage(() => sessionStorage),
    }
  )
);
