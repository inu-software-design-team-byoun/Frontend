// useScoreApi.ts
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../constants/api";

export type TransformedStudent = {
  id: number;
  name: string;
  grade: number; // 추가
  classroom: number; // 추가
  phoneNum: string; // 추가
  birthday: string; // 추가
  totalScore: number | null;
  averageScore: number | null;
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

        console.log("score api 응답: ", json);

        const filtered = json.scores.find(
          (s: any) => s.grade === grade && s.semester === 1 // semester는 필요에 따라 수정
        );

        if (!filtered) {
          console.error("해당 학년/학기의 성적이 없습니다.");
          return;
        }

        const subjects = filtered.subjects || {};

        const transformed: TransformedStudent[] = [
          {
            id: json.studentId,
            name: json.studentName,
            grade: json.grade,
            classroom: classroom,
            // phoneNum: student.phoneNum,
            // birthday: student.birthday,
            phoneNum: "", // 다른 API에서 채움
            birthday: "",
            korean: subjects.subject1 ?? null,
            math: subjects.subject2 ?? null,
            english: subjects.subject3 ?? null,
            society: subjects.subject4 ?? null,
            science: subjects.subject5 ?? null,
            art: subjects.subject6 ?? null,
            music: subjects.subject7 ?? null,
            physical: subjects.subject8 ?? null,
            totalScore: filtered.totalScore ?? null,
            averageScore: filtered.averageScore ?? null,
          },
        ];

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
