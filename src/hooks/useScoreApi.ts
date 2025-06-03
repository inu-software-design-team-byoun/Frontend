// src/hooks/useScoreApi.ts
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../constants/api";

export type TransformedStudent = {
  id: number;
  studentNum: number;
  name: string;
  schoolGrade: number; // 학년
  classroom: number; // 반
  phoneNum: string;
  birthday: string;

  totalScore: number | null;
  averageScore: number | null;

  // 과목별 rawScore + letterGrade
  koreanRawScore: number | null;
  koreanLetterGrade: string | null;

  mathRawScore: number | null;
  mathLetterGrade: string | null;

  englishRawScore: number | null;
  englishLetterGrade: string | null;

  societyRawScore: number | null;
  societyLetterGrade: string | null;

  scienceRawScore: number | null;
  scienceLetterGrade: string | null;

  artRawScore: number | null;
  artLetterGrade: string | null;

  musicRawScore: number | null;
  musicLetterGrade: string | null;

  physicalRawScore: number | null;
  physicalLetterGrade: string | null;
};

export const useScoreApi = (schoolGrade: number, classroom: number) => {
  const [data, setData] = useState<TransformedStudent[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch(ENDPOINTS.scores(schoolGrade, classroom));
        const json = await res.json();
        console.log("score api 응답: ", json);
        const studentsData: any[] = json.students;

        // grade, class, semester(1) 매칭
        const filtered = studentsData.filter(
          (s) =>
            s.grade === schoolGrade && s.class === classroom && s.semester === 1
        );

        const transformed: TransformedStudent[] = filtered.map((s) => {
          // subjects 안에 subject1 ~ subject8이 { score, grade } 형태로 들어옴
          const sub = s.subjects || {};

          return {
            id: s.studentId,
            studentNum: s.studentNum,
            name: s.studentName,
            schoolGrade: s.grade,
            classroom: s.class,
            phoneNum: s.phoneNum,
            birthday: s.birthday,
            totalScore: s.totalScore ?? null,
            averageScore: s.averageScore ?? null,

            koreanRawScore: sub.subject1?.score ?? null,
            koreanLetterGrade: sub.subject1?.grade ?? null,

            mathRawScore: sub.subject2?.score ?? null,
            mathLetterGrade: sub.subject2?.grade ?? null,

            englishRawScore: sub.subject3?.score ?? null,
            englishLetterGrade: sub.subject3?.grade ?? null,

            societyRawScore: sub.subject4?.score ?? null,
            societyLetterGrade: sub.subject4?.grade ?? null,

            scienceRawScore: sub.subject5?.score ?? null,
            scienceLetterGrade: sub.subject5?.grade ?? null,

            artRawScore: sub.subject6?.score ?? null,
            artLetterGrade: sub.subject6?.grade ?? null,

            musicRawScore: sub.subject7?.score ?? null,
            musicLetterGrade: sub.subject7?.grade ?? null,

            physicalRawScore: sub.subject8?.score ?? null,
            physicalLetterGrade: sub.subject8?.grade ?? null,
          };
        });

        setData(transformed);
      } catch (err) {
        console.error("Score API fetch error:", err);
        setData([]);
      }
    };

    fetchScores();
  }, [schoolGrade, classroom]);

  return { data };
};
