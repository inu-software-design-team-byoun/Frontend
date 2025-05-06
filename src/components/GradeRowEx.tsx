// GradeRowEx.tsx
import React from "react";
import { fetchStudentInfo } from "../utils/fetchStudentInfo";

interface GradeRowProps {
  student: {
    id: number;
    name: string;
    grade: number;
    classroom: number;
    phoneNum: string;
    birthday: string;
    totalScore: number | null;
    averageScore: number | null;
    // totalScore: number;
    // averageScore: number;
    [key: string]: string | number | null;
  };
  subjects: string[];
}

const GradeRow: React.FC<GradeRowProps> = ({ student, subjects }) => {
  // ⬇️ 이 줄을 통해 zustand에 정보 저장
  const handleSelect = async () => {
    if (student.totalScore == null || student.averageScore == null) return;

    await fetchStudentInfo(
      student.id,
      // student.grade,
      // student.classroom,
      student.totalScore,
      student.averageScore
    );
  };

  return (
    <tr>
      <td>{String(student.id).slice(-2)}</td>
      <td
        onClick={handleSelect}
        style={{ cursor: "pointer", fontWeight: "bold" }}
      >
        {student.name}
      </td>
      {subjects.map((subj) => (
        <td key={subj}>{student[subj] ?? "-"}</td>
      ))}
      <td></td>
    </tr>
  );
};

export default GradeRow;
