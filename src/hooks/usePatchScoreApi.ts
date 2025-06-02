import { useCallback } from "react";
import { ENDPOINTS } from "../constants/api";

export const usePatchScoreApi = () => {
  // subjectName: 국어,수학,영어... → subject1,subject2,subject3...
  const subjectMap: Record<string, number> = {
    국어: 1,
    수학: 2,
    영어: 3,
    사회: 4,
    과학: 5,
    미술: 6,
    음악: 7,
    체육: 8,
  };

  const patchScore = useCallback(
    async ({
      studentId,
      grade,
      semester = 1,
      subjectName,
      value,
    }: {
      studentId: number;
      grade: number;
      semester?: number;
      subjectName: string;
      value: number;
    }) => {
      const subjectNum = subjectMap[subjectName];
      if (!subjectNum) throw new Error("Unknown subject name");
      const body: Record<string, any> = {
        studentId,
        grade,
        semester,
        ["subject" + subjectNum]: value,
      };
      const res = await fetch(ENDPOINTS.patchScore, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Score patch failed");
      return await res.json();
    },
    []
  );

  return { patchScore };
};
