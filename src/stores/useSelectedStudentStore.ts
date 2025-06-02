// store/useSelectedStudentStore.ts
import { create } from "zustand";
import { StudentBrief } from "../hooks/useStudentListApi";

export interface SelectedStudent {
  id: number;
  name: string;
  grade: number;
  classroom: number;
  phoneNum: string;
  birthday: string;
  totalScore?: number;
  averageScore?: number;
  picture?: string;
}

interface SelectedStudentStore {
  selectedStudent: SelectedStudent | StudentBrief | null;
  setSelectedStudent: (student: SelectedStudent | StudentBrief) => void;
  clearSelectedStudent: () => void;
}

export const useSelectedStudentStore = create<SelectedStudentStore>((set) => ({
  selectedStudent: null,
  setSelectedStudent: (student) => set({ selectedStudent: student }),
  clearSelectedStudent: () => set({ selectedStudent: null }),
}));
