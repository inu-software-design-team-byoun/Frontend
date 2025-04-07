// useScoreApi.ts
import { useEffect, useState } from "react";
import { dummyScores } from "../data/dummyScores"; // 실제 API 연결 전용 임시 데이터
import { ENDPOINTS } from "../constants/api";

interface ScoreItem {
  subject: string;
  score: number;
  grade: string;
}

interface StudentScore {
  student_id: number;
  name: string;
  scores: ScoreItem[];
}

export const useScoreApi = (grade: number, classNum: number) => {
  const [data, setData] = useState<StudentScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        // 실제 API 사용 시 주석 해제
        // const res = await fetch(ENDPOINTS.scores(grade, classNum));
        // const json = await res.json();

        // 실제 API 사용시 주석처리
        const json = dummyScores; // 임시 데이터로 대체

        // GradeTable과 GradeRow에서 사용 중인 형식으로 변환
        const transformed = json.students.map((student: any) => {
          const result: { [subject: string]: string } = {
            id: student.student_id,
            name: student.name,
          };

          student.scores.forEach((item: ScoreItem) => {
            result[item.subject] = item.grade; // 점수(score)가 아닌 등급(grade) 기준
          });

          return result;
        });

        setData(transformed);
      } catch (err) {
        console.error("Score API fetch error:", err);
        setData([]); // 실패 시 빈 배열
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [grade, classNum]);

  return { data, loading };
};
