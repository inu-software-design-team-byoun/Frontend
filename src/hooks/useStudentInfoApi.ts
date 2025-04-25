// hooks/useStudentInfoApi.ts
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../constants/api";

const mockStudentInfo = [
  {
    studentid: 20401,
    name: "안세균",
    phoneNum: "010-1010-1010",
    avgScore: "98",
    birthday: "2010-02-23",
    avgGrade: "A",
  },
  {
    studentid: 20402,
    name: "박존슨",
    phoneNum: "010-2222-3333",
    avgScore: "91",
    birthday: "2010-04-12",
    avgGrade: "B+",
  },
  // 필요한 만큼 추가 가능
];

interface StudentInfo {
  studentid: number;
  name: string;
  phoneNum: string;
  avgScore: string;
  birthday: string;
  avgGrade: string;
}

export const useStudentInfoApi = (id: number) => {
  const [data, setData] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        // const res = await fetch(ENDPOINTS.studentInfo(id));
        // const json = await res.json();
        // setData(json[0]); // 배열로 감싸져 있으므로 첫 번째 요소만

        const found = mockStudentInfo.find((s) => s.studentid === id);
        setData(found ?? null);
      } catch (err) {
        console.error("Student Info fetch error:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentInfo();
  }, [id]);

  return { data, loading };
};
