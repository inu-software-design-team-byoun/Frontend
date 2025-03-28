// useGradeApi.ts
import { useState, useEffect } from "react";
import { Grade } from "./types";

export const useGradeApi = () => {
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    fetchGrades();
  }, []);

  // 임시 데이터가 없는 fetchGrades함수
  //   const fetchGrades = async () => {
  //     const res = await fetch("/api/grades"); // 예시
  //     const data = await res.json();
  //     setGrades(data);
  //   };
  const fetchGrades = async () => {
    try {
      // 실제 API 요청
      const res = await fetch("/api/grades");
      if (!res.ok) throw new Error("API 실패");

      const data = await res.json();
      setGrades(data);
    } catch {
      // 👇 임시 데이터 fallback
      const dummyGrades: Grade[] = [
        {
          id: 1,
          name: "안세균",
          korean: 98,
          math: 98,
          english: 98,
          society: 98,
          science: 98,
          art: 98,
          music: 98,
          pe: 98,
        },
        {
          id: 2,
          name: "박존슨",
          korean: 98,
          math: 98,
          english: 98,
          society: 98,
          science: 98,
          art: 98,
          music: 98,
          pe: 98,
        },
      ];
      setGrades(dummyGrades);
    }
  };

  const addGrade = async (grade: Omit<Grade, "id">) => {
    const res = await fetch("/api/grades", {
      method: "POST",
      body: JSON.stringify(grade),
    });
    const newGrade = await res.json();
    setGrades((prev) => [...prev, newGrade]);
  };

  const updateGrade = async (id: number, updated: Partial<Grade>) => {
    await fetch(`/api/grades/${id}`, {
      method: "PUT",
      body: JSON.stringify(updated),
    });
    setGrades((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updated } : g))
    );
  };

  const deleteGrade = async (id: number) => {
    await fetch(`/api/grades/${id}`, { method: "DELETE" });
    setGrades((prev) => prev.filter((g) => g.id !== id));
  };

  return { grades, addGrade, updateGrade, deleteGrade };
};
