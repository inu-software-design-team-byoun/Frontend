// GradeRowEx.tsx
import React from "react";
import { fetchStudentInfo } from "../utils/fetchStudentInfo";

interface GradeRowProps {
  student: {
    id: number;
    studentNum: number;
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
    await fetchStudentInfo(
      student.id,
      student.totalScore ?? 0,
      student.averageScore ?? 0
    );
  };

  // // ── studentNum 뒤 두 자리만 % 연산으로 가져오면, 03 → 3, 11 → 11 ──
  // const displayNum = student.studentNum % 100;

  return (
    <tr>
      {/* 학번 뒤 두 자리만 표시 */}
      <td>{String(student.studentNum % 100)}</td>

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
