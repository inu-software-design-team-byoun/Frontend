// src/constants/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
  scores: (grade: number, classroom: number) =>
    `${API_BASE_URL}/scores/class?grade=${grade}&class=${classroom}`,
  students: `${API_BASE_URL}/students`, // 전체 학생 조회
  studentsList: (
    grade: number,
    classroom: number // 학년, 반 별 학생 조회
  ) => `${API_BASE_URL}/students?grade=${grade}&class=${classroom}`,
  studentInfo: (id: number) => `${API_BASE_URL}/students/${id}`,
};
