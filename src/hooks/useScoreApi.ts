import { useEffect, useState } from "react";
import { dummyScores } from "../data/dummyScores";
import { ENDPOINTS } from "../constants/api";

export type TransformedStudent = {
  id: number;
  name: string;
  [subject: string]: string | number;
};

export const useScoreApi = (grade: number, classNum: number) => {
  const [data, setData] = useState<TransformedStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        // 실제 API 사용할 경우
        // const res = await fetch(ENDPOINTS.studentsList(grade, classNum));
        // const json = await res.json();

        // ⬇️ dummyScores에서 학년/반 필터
        const filtered = dummyScores.filter((s) => {
          const sid = String(s.studentid).padStart(5, "0"); // ex: 20304
          const sGrade = Number(sid.charAt(0));
          const sClass = Number(sid.substring(1, 3));
          return sGrade === grade && sClass === classNum;
        });

        const transformed = filtered.map((student: any) => {
          const result: TransformedStudent = {
            id: student.studentid,
            name: student.name,
          };

          const subjects = [
            "korean",
            "math",
            "english",
            "society",
            "science",
            "art",
            "music",
            "physical",
          ];
          subjects.forEach((subj) => {
            result[subj] = student[subj];
          });

          return result;
        });

        setData(transformed);
      } catch (err) {
        console.error("Score API fetch error:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [grade, classNum]);

  return { data, loading };
};
