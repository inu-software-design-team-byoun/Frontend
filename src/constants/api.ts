// src/constants/api.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
  // 반별 학생조회
  scores: (grade: number, classroom: number) =>
    `${API_BASE_URL}/scores/classroom?grade=${grade}&classroom=${classroom}`,
  // 학생별 성적 생성 및 수정
  patchScore: `${API_BASE_URL}/scores`,
  // 전체 학생 조회
  students: `${API_BASE_URL}/students`,
  studentsList: (
    grade: number,
    classroom: number // 학년, 반 별 학생 조회
  ) => `${API_BASE_URL}/students?grade=${grade}&classroom=${classroom}`,
  studentInfo: (id: number) => `${API_BASE_URL}/students/${id}`,
  auth: `${API_BASE_URL}/auth/google`,
  teachers: `${API_BASE_URL}/teachers`,
  check: `${API_BASE_URL}/auth/check-user`,
  counsels: `${API_BASE_URL}/counsels`,
  counselList: (
    studentId: number,
    startDate: string,
    endDate: string,
    subject: number
  ) =>
    `${API_BASE_URL}/counsels?studentId=${studentId}&startDate=${startDate}&endDate=${endDate}&subject=${subject}`,
};
