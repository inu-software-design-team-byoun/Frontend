// src/hooks/useFeedbackApi.ts
import { useState, useEffect } from "react";
import { ENDPOINTS } from "../constants/api";
import { useAuthStore } from "../hooks/useAuthStore";

// 원시(raw)로 내려오는 인터페이스
export interface RawFeedback {
  id: number;
  student: { id: number /* … */ };
  teacher: { id: number; subject: number | null /* … */ } | null;
  date: string; // "YYYY-MM-DD"
  subject: string; // "" 또는 "01", "02", … "10", "11" 등
  content: string;
  release: string; // "" 또는 "1"
}

// 컴포넌트 내에서 실제로 사용할 파싱된(feedback) 타입
export interface ParsedFeedback {
  id: number;
  studentId: number;
  date: string; // "YYYY-MM-DD"
  subject: number | null; // 숫자(1~99) 또는 null (빈 문자열)
  content: string;
  release: boolean; // true ("1") / false ("" 또는 "0")
}

export const useFeedbackApi = (studentId: number) => {
  const [feedbacks, setFeedbacks] = useState<ParsedFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // “RawFeedback[] → ParsedFeedback[]”로 변환하는 헬퍼
  const parseFeedbackArray = (rawArr: RawFeedback[]): ParsedFeedback[] => {
    return rawArr.map((raw) => {
      // subject: ""이면 null, 두 글자 문자열이면 parseInt로 숫자 변환
      const subjNum: number | null =
        raw.subject === "" ? null : parseInt(raw.subject, 10);

      // release: "1"이면 true, 그 외는 false
      const releaseBool = raw.release === "1";

      return {
        id: raw.id,
        studentId: raw.student.id,
        date: raw.date,
        subject: subjNum,
        content: raw.content,
        release: releaseBool,
      };
    });
  };

  // 1) 피드백 목록 조회
  const fetchFeedbacks = async () => {
    if (!studentId) return;
    setLoading(true);
    setError(null);

    try {
      const token = useAuthStore.getState().accessToken;
      const url = ENDPOINTS.feedbacksByStudent(studentId, "", "");
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        throw new Error(`피드백 조회 실패: ${res.status}`);
      }

      const rawData: RawFeedback[] = await res.json();
      const parsedData: ParsedFeedback[] = parseFeedbackArray(rawData);
      setFeedbacks(parsedData);
    } catch (err) {
      console.error("Feedback 조회 에러:", err);
      setFeedbacks([]);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // 2) 피드백 생성
  const createFeedback = async (
    date: string,
    subject: number,
    content: string,
    release: boolean
  ) => {
    if (!studentId || !date || !content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const token = useAuthStore.getState().accessToken;
      const url = ENDPOINTS.feedbacks;
      const body = {
        studentId,
        date,
        // 두 글자 문자열로 보내야 한다면 padStart 사용 가능 (“01”, “02”, …)
        subject: subject.toString().padStart(2, "0"),
        content: content.trim(),
        release: release ? "1" : "0",
      };
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`피드백 생성 실패: ${res.status} ${errText}`);
      }
      await fetchFeedbacks();
    } catch (err) {
      console.error("Feedback 생성 에러:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // 3) 피드백 수정
  const updateFeedback = async (
    feedbackId: number,
    date: string,
    subject: number,
    content: string,
    release: boolean
  ) => {
    if (!feedbackId || !studentId || !date || !content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const token = useAuthStore.getState().accessToken;
      const url = ENDPOINTS.feedbacksById(feedbackId);
      const body = {
        studentId,
        date,
        subject: subject.toString().padStart(2, "0"),
        content: content.trim(),
        release: release ? "1" : "0",
      };
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`피드백 수정 실패: ${res.status} ${errText}`);
      }
      await fetchFeedbacks();
    } catch (err) {
      console.error("Feedback 수정 에러:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // 4) 피드백 삭제
  const deleteFeedback = async (feedbackId: number) => {
    if (!feedbackId) return;
    setLoading(true);
    setError(null);
    try {
      const token = useAuthStore.getState().accessToken;
      const url = ENDPOINTS.feedbacksById(feedbackId);
      const res = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) {
        throw new Error(`피드백 삭제 실패: ${res.status}`);
      }
      await fetchFeedbacks();
    } catch (err) {
      console.error("Feedback 삭제 에러:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // studentId가 바뀔 때마다 목록 다시 불러오기
  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  return {
    feedbacks,
    loading,
    error,
    fetchFeedbacks,
    createFeedback,
    updateFeedback,
    deleteFeedback,
  };
};
