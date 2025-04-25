// src/constants/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
  scores: (grade: number, classNum: number) =>
    `${API_BASE_URL}/scores/${grade}/class/${classNum}`,
  students: `${API_BASE_URL}/students`,
  studentsList: (grade: number, classNum: number) =>
    `${API_BASE_URL}/students/list?grade=${grade}&class=${classNum}`,
  studentInfo: (id: number) => `${API_BASE_URL}/students/info/${id}`,
};
