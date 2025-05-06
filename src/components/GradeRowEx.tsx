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
    await fetchStudentInfo(
      student.id,
      student.totalScore ?? 0,
      student.averageScore ?? 0
    );
  };

  return (
    <tr>
      {/* <td>{String(student.id)}</td> */}
      {/* 나중에 학번이 20202이런식으로 올 것에 대비*/}
      {/* <td>{String(student.studentNum).slice(-2)}</td> */}
      <td>{String(student.studentNum)}</td>

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
