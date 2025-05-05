// useScoreApi.ts
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../constants/api";

export type TransformedStudent = {
  id: number;
  name: string;
  korean: number | null;
  math: number | null;
  english: number | null;
  society: number | null;
  science: number | null;
  art: number | null;
  music: number | null;
  physical: number | null;
};

export const useScoreApi = (grade: number, classroom: number) => {
  const [data, setData] = useState<TransformedStudent[]>([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch(ENDPOINTS.scores(grade, classroom));
        const json = await res.json();

        const transformed: TransformedStudent[] = json.students.map(
          (student: any) => {
            const subjects = student.subjects || {};

            return {
              id: student.studentId,
              name: student.name,
              korean: subjects.subject1 ?? null,
              math: subjects.subject2 ?? null,
              english: subjects.subject3 ?? null,
              society: subjects.subject4 ?? null,
              science: subjects.subject5 ?? null,
              art: subjects.subject6 ?? null,
              music: subjects.subject7 ?? null,
              physical: subjects.subject8 ?? null,
              totalScore: student.totalScore ?? null,
              averageScore: student.averageScore ?? null,
            };
          }
        );

        setData(transformed);
      } catch (err) {
        console.error("Score API fetch error:", err);
        setData([]);
      } finally {
        // setLoading(false);
      }
    };

    fetchScores();
  }, [grade, classroom]);

  return { data };
};
