// src/hooks/useFeedbackApi.ts
import { useState, useEffect } from "react";
import { ENDPOINTS } from "../constants/api";
import { useAuthStore } from "../hooks/useAuthStore";

export interface Feedback {
  id: number;
  studentId: number;
  date: string; // YYYY-MM-DD
  subject: number;
  content: string;
  release: boolean;
}

export const useFeedbackApi = (studentId: number) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // 1) 피드백 목록 조회
  const fetchFeedbacks = async () => {
    if (!studentId) return;
    setLoading(true);
    setError(null);

    try {
      const token = useAuthStore.getState().accessToken;
      const url = ENDPOINTS.feedbacksByStudent(
        studentId,
        "", // 전체 조회
        ""
      );
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

      const data: Feedback[] = await res.json();

      setFeedbacks(data);
      console.log(data);
    } catch (err) {
      console.error("Feedback 조회 에러:", err);
      setFeedbacks([]);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // 2) 피드백 추가
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
        subject,
        content: content.trim(),
        release,
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
      // 생성 성공 시 목록 갱신
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
        subject,
        content: content.trim(),
        release,
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
      // 수정 성공 시 목록 갱신
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
      // 삭제 성공 시 목록 갱신
      await fetchFeedbacks();
    } catch (err) {
      console.error("Feedback 삭제 에러:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // studentId가 바뀔 때마다 목록을 다시 불러오기
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
