import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { TransformedStudent } from "../hooks/useScoreApi";

interface StudentScoreStore {
  students: TransformedStudent[];
  setStudents: (students: TransformedStudent[]) => void;
  clearStudents: () => void;
}

export const useStudentScoreStore = create<StudentScoreStore>()(
  persist(
    (set) => ({
      students: [],
      setStudents: (students) => set({ students }),
      clearStudents: () => set({ students: [] }),
    }),
    {
      name: "student-score-store", // 저장소 키 이름
      //   getStorage: () => sessionStorage,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
