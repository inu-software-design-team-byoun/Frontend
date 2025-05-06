// src/hooks/useStudentsListApi.ts
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../constants/api";

export interface StudentBrief {
  id: number;
  studentNum: number;
  name: string;
  grade: number;
  classroom: number;
  phoneNum: string;
  birthday: string;
}

export const useStudentsListApi = (
  grade: number,
  classroom: number
): { data: StudentBrief[] } => {
  const [data, setData] = useState<StudentBrief[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(ENDPOINTS.studentsList(grade, classroom));
        if (!res.ok) throw new Error(`${res.status}`);
        const json: StudentBrief[] = await res.json();
        setData(json);
      } catch (err) {
        console.error("students list fetch error", err);
      }
    })();
  }, [grade, classroom]);

  return { data };
};
