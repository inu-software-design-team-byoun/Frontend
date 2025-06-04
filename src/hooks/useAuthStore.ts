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

  // student Info 필드
  studentId: number; // 로그인된 학생이라면 studentInfo.id
  setStudentId: (id: number) => void;

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

      // student 초기값
      studentId: 0,

      // setters
      setTeacherName: (name) => set({ teacherName: name }),
      setTeacherGrade: (grade) => set({ teacherGrade: grade }),
      setTeacherClassroom: (classroom) => set({ teacherClassroom: classroom }),

      setStudentId: (id) => set({ studentId: id }),

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
          // teacherName, studentId 등은 fetchUserId에서 따로 세팅
        }),

      // 로그아웃 시 모든 필드 초기화
      clearAuth: () =>
        set({
          userId: 0,
          userName: "",
          role: "",
          accessToken: null,
          teacherName: "",
          teacherGrade: 0,
          teacherClassroom: 0,
          studentId: 0,
        }),

      setSubjectCode: (code) => set({ subjectCode: code }),
    }),
    {
      name: "auth-storage",
      // storage: createJSONStorage(() => sessionStorage),
    }
  )
);
