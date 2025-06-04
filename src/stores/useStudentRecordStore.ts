// src/stores/useStudentRecordStore.ts
import { create } from "zustand";

interface StudentRecordState {
  isOpen: boolean;
  studentId: number | null;
  openModal: (id: number) => void;
  closeModal: () => void;
}

export const useStudentRecordStore = create<StudentRecordState>((set) => ({
  isOpen: false,
  studentId: null,
  openModal: (id: number) => set({ isOpen: true, studentId: id }),
  closeModal: () => set({ isOpen: false, studentId: null }),
}));
