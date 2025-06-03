// useCounselsApi.ts
import { useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../constants/api";
import { useAuthStore } from "../hooks/useAuthStore";

export type Counsel = {
  id: number;
  date: string;
  title: string;
  content: string;
  teacherName: string; // API의 teacher.name을 여기에 넣을 예정
};

export const useCounselsApi = () => {
  const [counsels, setCounsels] = useState<Counsel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // 액세스 토큰
  const accessToken = useAuthStore((state) => state.accessToken);
  const authHeader = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : {};

  const fetchCounsels = (studentId: number) => {
    if (!studentId) return;
    setLoading(true);
    axios
      .get(`${ENDPOINTS.counsels}?studentId=${studentId}`, {
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
      })
      .then((res) => {
        console.log("Counsels API 응답:", res.data);
        if (Array.isArray(res.data)) {
          // 원시 배열을 순회하면서 teacherName만 꺼내서 새로운 배열 생성
          const parsed: Counsel[] = res.data.map((item: any) => ({
            id: item.id,
            date: item.date,
            title: item.title,
            content: item.content,
            // teacher 객체가 있을 때만 name 필드 사용
            teacherName: item.teacher ? item.teacher.name : "",
          }));
          setCounsels(parsed);
        } else {
          setCounsels([]);
        }
      })
      .catch((err) => {
        console.error("Counsels API 에러:", err);
        setCounsels([]);
        setError(err);
      })
      .finally(() => setLoading(false));
  };

  const deleteCounsel = (counselId: number) => {
    if (!counselId) return;
    setLoading(true);
    axios
      .delete(`${ENDPOINTS.counsels}/${counselId}`, {
        headers: {
          "Content-Type": "application/json",
          ...authHeader,
        },
      })
      .then(() => {
        setCounsels((prev) =>
          prev.filter((counsel) => counsel.id !== counselId)
        );
      })
      .catch((err) => {
        console.error("Counsel 삭제 에러:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  };

  const addCounsel = (
    studentId: number,
    date: string,
    title: string,
    content: string
  ) => {
    if (!studentId || !date || !title || !content) return;
    setLoading(true);
    axios
      .post(
        ENDPOINTS.counsels,
        { studentId, date, title, content },
        {
          headers: {
            "Content-Type": "application/json",
            ...authHeader,
          },
        }
      )
      .then((res) => {
        fetchCounsels(studentId);
      })
      .catch((err) => {
        console.error("Counsel 등록 에러:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  };

  const updateCounsel = (
    counselId: number,
    studentId: number,
    date: string,
    title: string,
    content: string
  ) => {
    if (!counselId || !studentId || !date || !title || !content) return;
    setLoading(true);
    axios
      .patch(
        `${ENDPOINTS.counsels}/${counselId}`,
        { studentId, date, title, content },
        {
          headers: {
            "Content-Type": "application/json",
            ...authHeader,
          },
        }
      )
      .then((res) => {
        fetchCounsels(studentId);
      })
      .catch((err) => {
        console.error("Counsel 수정 에러:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  };

  return {
    counsels,
    loading,
    error,
    fetchCounsels,
    deleteCounsel,
    addCounsel,
    updateCounsel,
  };
};
