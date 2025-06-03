// src/hooks/useAuthStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  // 공통 필드
  userId: number;
  userName: string; // 모든 role에 공통으로 저장할 이름
  role: "teacher" | "student" | "parent" | "";
  accessToken: string | null;

  // teacher Info 필드
  subjectCode: number;
  teacherName: string; // teacherInfo.name
  teacherGrade: number; // 담임교사의 학년
  teacherClassroom: number; // 담임교사가 맡은 반
  setTeacherName: (name: string) => void;
  setTeacherGrade: (grade: number) => void;
  setTeacherClassroom: (classroom: number) => void;

  // 공통 setter
  setUserId: (userId: number) => void;
  setUserName: (name: string) => void;
  setRole: (role: "teacher" | "student" | "parent") => void;
  setAuth: (
    userId: number,
    userName: string,
    role: "teacher" | "student" | "parent",
    accessToken: string
  ) => void;
  clearAuth: () => void;
  setSubjectCode: (code: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: 0,
      userName: "",
      role: "",
      accessToken: null,
      subjectCode: 1,

      // teacher 초기값
      teacherName: "",
      teacherGrade: 0,
      teacherClassroom: 0,
      setTeacherName: (name) => set({ teacherName: name }),
      setTeacherGrade: (grade) => set({ teacherGrade: grade }),
      setTeacherClassroom: (classroom) => set({ teacherClassroom: classroom }),

      setUserId: (userId) => set({ userId }),
      setUserName: (name) => set({ userName: name }),
      setRole: (role) => set({ role }),

      // setAuth: 로그인 성공 시 한 번에 필요한 필드를 세팅
      setAuth: (userId, userName, role, accessToken) =>
        set({
          userId,
          userName,
          role,
          accessToken,
          // teacherName은 따로 fetch 후에 세팅할 수 있음
        }),

      // 로그아웃 시 userName, role, teacherName을 초기화
      clearAuth: () =>
        set({
          userId: 0,
          userName: "",
          role: "",
          accessToken: null,
          teacherName: "",
          teacherGrade: 0,
          teacherClassroom: 0,
        }),

      setSubjectCode: (code) => set({ subjectCode: code }),
    }),
    {
      name: "auth-storage",
      // storage: createJSONStorage(() => sessionStorage),
    }
  )
);
