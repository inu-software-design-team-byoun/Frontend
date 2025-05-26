import { useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../constants/api";

export type Counsel = {
  id: number;

  date: string;
  content: string;
};

export const useCounselsApi = () => {
  const [counsels, setCounsels] = useState<Counsel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchCounsels = (studentId: number) => {
    if (!studentId) return;
    setLoading(true);
    axios
      .get(`${ENDPOINTS.counsels}?studentId=${studentId}`)
      .then((res) => {
        console.log("Counsels API 응답:", res.data);
        if (Array.isArray(res.data)) {
          setCounsels(res.data);
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
      .delete(`${ENDPOINTS.counsels}/${counselId}`)
      .then(() => {
        console.log(`Counsel ID ${counselId} 삭제 성공`);
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

  const addCounsel = (studentId: number, date: string, content: string) => {
    if (!studentId || !date || !content) return;
    setLoading(true);
    axios
      .post(ENDPOINTS.counsels, { studentId, date, content })
      .then((res) => {
        console.log("Counsel 등록 성공:", res.data); // 응답 데이터 출력
        fetchCounsels(studentId); // 등록 후 목록 새로고침
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
    content: string
  ) => {
    if (!counselId || !studentId || !date || !content) return;
    setLoading(true);
    axios
      .patch(`${ENDPOINTS.counsels}/${counselId}`, { studentId, date, content })
      .then((res) => {
        console.log("Counsel 수정 성공:", res.data); // 응답 데이터 출력
        fetchCounsels(studentId); // 수정 후 목록 새로고침
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
    updateCounsel, // 추가된 메서드 반환
  };
};
