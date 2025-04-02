import { useState, useEffect } from "react";
import { Grade } from "./types";
import { dummyGradeData } from "../data/dummyGrades";

export const useGradeApi = (
  selectedSemester: string,
  selectedGrade: string,
  selectedClass: string
) => {
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    fetchGrades();
  }, [selectedSemester, selectedGrade, selectedClass]);

  const fetchGrades = async () => {
    try {
      const res = await fetch("/api/grades");
      if (!res.ok) throw new Error("API 실패");

      const data = await res.json();
      setGrades(data);
    } catch {
      // fallback 구조 탐색
      const fallback =
        dummyGradeData[selectedSemester]?.[`${selectedGrade}학년`]?.[
          `${selectedClass}반`
        ] || [];
      setGrades(fallback);
    }
  };

  const addGrade = async (grade: Omit<Grade, "id">) => {
    const newGrade = { ...grade, id: Date.now() };
    setGrades((prev) => [...prev, newGrade]);
  };

  const updateGrade = async (id: number, updated: Partial<Grade>) => {
    setGrades((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updated } : g))
    );
  };

  const deleteGrade = async (id: number) => {
    setGrades((prev) => prev.filter((g) => g.id !== id));
  };

  return { grades, addGrade, updateGrade, deleteGrade };
};
