// useScoreApi.ts
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../constants/api";

export type TransformedStudent = {
  id: number;
  studentNum: number;
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
        const studentsData: any[] = json.students;

        // grade, class, semester(1) 매칭
        const filtered = studentsData.filter(
          (s) => s.grade === grade && s.class === classroom && s.semester === 1
        );

        // const filtered = json.students.find(
        //   (s: any) => s.grade === grade && s.semester === 1 // semester는 필요에 따라 수정
        // );

        // if (!filtered) {
        //   console.error("해당 학년/학기의 성적이 없습니다.");
        //   return;
        // }

        // const subjects = filtered.subjects || {};

        const transformed: TransformedStudent[] = filtered.map((s) => ({
          id: s.studentId,
          // studentNum: json.studentNum,
          studentNum: 0,
          // name: s.studentName,
          name: "",
          grade: s.grade,
          classroom: s.class,
          // phoneNum: student.phoneNum,
          // birthday: student.birthday,
          phoneNum: "", // 다른 API에서 채움
          birthday: "",
          korean: s.subjects.subject1 ?? null,
          math: s.subjects.subject2 ?? null,
          english: s.subjects.subject3 ?? null,
          society: s.subjects.subject4 ?? null,
          science: s.subjects.subject5 ?? null,
          art: s.subjects.subject6 ?? null,
          music: s.subjects.subject7 ?? null,
          physical: s.subjects.subject8 ?? null,
          totalScore: s.totalScore ?? null,
          averageScore: s.averageScore ?? null,
        }));

        setData(transformed);
      } catch (err) {
        console.error("Score API fetch error:", err);
        setData([]);
      }
    };

    fetchScores();
  }, [grade, classroom]);

  return { data };
};
