// src/hooks/useScoreApi.ts
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../constants/api";

export type TransformedStudent = {
  id: number;
  studentNum: number | null;
  name: string;
  schoolGrade: number; // 학년
  classroom: number; // 반

  totalScore: number | null;
  averageScore: number | null;

  koreanRawScore: number | null;
  koreanLetterGrade: string | null;
  koreanRank: number | null;
  koreanTotalCount: number | null;
  koreanAverage: number | null;

  mathRawScore: number | null;
  mathLetterGrade: string | null;
  mathRank: number | null;
  mathTotalCount: number | null;
  mathAverage: number | null;

  englishRawScore: number | null;
  englishLetterGrade: string | null;
  englishRank: number | null;
  englishTotalCount: number | null;
  englishAverage: number | null;

  societyRawScore: number | null;
  societyLetterGrade: string | null;
  societyRank: number | null;
  societyTotalCount: number | null;
  societyAverage: number | null;

  scienceRawScore: number | null;
  scienceLetterGrade: string | null;
  scienceRank: number | null;
  scienceTotalCount: number | null;
  scienceAverage: number | null;

  artRawScore: number | null;
  artLetterGrade: string | null;
  artRank: number | null;
  artTotalCount: number | null;
  artAverage: number | null;

  musicRawScore: number | null;
  musicLetterGrade: string | null;
  musicRank: number | null;
  musicTotalCount: number | null;
  musicAverage: number | null;

  physicalRawScore: number | null;
  physicalLetterGrade: string | null;
  physicalRank: number | null;
  physicalTotalCount: number | null;
  physicalAverage: number | null;
};

export const useScoreApi = (schoolGrade: number, classroom: number) => {
  const [data, setData] = useState<TransformedStudent[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch(ENDPOINTS.scores(schoolGrade, classroom));
        if (!res.ok) {
          throw new Error(`응답 에러: ${res.status}`);
        }

        // 1) res.json() 결과를 받아서, 배열인지 확인
        const json = await res.json();
        let studentsData: any[] = [];

        if (Array.isArray(json)) {
          // JSON 전체가 배열인 경우
          studentsData = json;
        } else if (Array.isArray((json as any).students)) {
          // { students: […] } 형태로 오는 경우
          studentsData = (json as any).students;
        } else {
          // 그 외 예상치 못한 형태
          console.error("예상치 못한 응답 형태:", json);
          setData([]);
          return;
        }

        // 2) semester === 1 필터링
        const filtered = studentsData.filter(
          (s) =>
            s.grade === schoolGrade && s.class === classroom && s.semester === 1
        );

        // 3) subjects 내부에서 필요한 필드를 꺼내 TransformedStudent로 매핑
        const transformed: TransformedStudent[] = filtered.map((s) => {
          const sub = s.subjects || {};

          return {
            id: s.studentId,
            // studentNum 필드가 없을 수도 있으므로 null 허용
            studentNum: s.studentNum ?? null,
            // API가 studentName 대신 name 필드를 쓴다면 name을 사용
            name: s.studentName ?? s.name ?? "",
            schoolGrade: s.grade,
            classroom: s.class,

            totalScore: s.totalScore ?? null,
            averageScore: s.averageScore ?? null,

            koreanRawScore: sub.subject1?.score ?? null,
            koreanLetterGrade: sub.subject1?.grade ?? null,
            koreanRank: sub.subject1?.rank ?? null,
            koreanTotalCount: sub.subject1?.totalCount ?? null,
            koreanAverage: sub.subject1?.average ?? null,

            mathRawScore: sub.subject2?.score ?? null,
            mathLetterGrade: sub.subject2?.grade ?? null,
            mathRank: sub.subject2?.rank ?? null,
            mathTotalCount: sub.subject2?.totalCount ?? null,
            mathAverage: sub.subject2?.average ?? null,

            englishRawScore: sub.subject3?.score ?? null,
            englishLetterGrade: sub.subject3?.grade ?? null,
            englishRank: sub.subject3?.rank ?? null,
            englishTotalCount: sub.subject3?.totalCount ?? null,
            englishAverage: sub.subject3?.average ?? null,

            societyRawScore: sub.subject4?.score ?? null,
            societyLetterGrade: sub.subject4?.grade ?? null,
            societyRank: sub.subject4?.rank ?? null,
            societyTotalCount: sub.subject4?.totalCount ?? null,
            societyAverage: sub.subject4?.average ?? null,

            scienceRawScore: sub.subject5?.score ?? null,
            scienceLetterGrade: sub.subject5?.grade ?? null,
            scienceRank: sub.subject5?.rank ?? null,
            scienceTotalCount: sub.subject5?.totalCount ?? null,
            scienceAverage: sub.subject5?.average ?? null,

            artRawScore: sub.subject6?.score ?? null,
            artLetterGrade: sub.subject6?.grade ?? null,
            artRank: sub.subject6?.rank ?? null,
            artTotalCount: sub.subject6?.totalCount ?? null,
            artAverage: sub.subject6?.average ?? null,

            musicRawScore: sub.subject7?.score ?? null,
            musicLetterGrade: sub.subject7?.grade ?? null,
            musicRank: sub.subject7?.rank ?? null,
            musicTotalCount: sub.subject7?.totalCount ?? null,
            musicAverage: sub.subject7?.average ?? null,

            physicalRawScore: sub.subject8?.score ?? null,
            physicalLetterGrade: sub.subject8?.grade ?? null,
            physicalRank: sub.subject8?.rank ?? null,
            physicalTotalCount: sub.subject8?.totalCount ?? null,
            physicalAverage: sub.subject8?.average ?? null,
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
