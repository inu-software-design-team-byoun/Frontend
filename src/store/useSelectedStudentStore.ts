// store/useSelectedStudentStore.ts
import { create } from "zustand";

interface SelectedStudent {
  id: number;
  name: string;
  grade: number;
  classroom: number;
  phoneNum: string;
  birthday: string;
  totalScore: number;
  averageScore: number;
}

interface SelectedStudentStore {
  selectedStudent: SelectedStudent | null;
  setSelectedStudent: (student: SelectedStudent) => void;
  clearSelectedStudent: () => void;
}

export const useSelectedStudentStore = create<SelectedStudentStore>((set) => ({
  selectedStudent: null,
  setSelectedStudent: (student) => set({ selectedStudent: student }),
  clearSelectedStudent: () => set({ selectedStudent: null }),
}));
