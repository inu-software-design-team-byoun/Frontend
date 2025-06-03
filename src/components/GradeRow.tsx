// src/components/GradeRow.tsx
import React from "react";
import { fetchStudentInfo } from "../utils/fetchStudentInfo";

interface GradeRowProps {
  student: {
    id: number;
    studentNum: number;
    name: string;
    schoolGrade: number;
    classroom: number;
    phoneNum: string;
    birthday: string;
    totalScore: number | null;
    averageScore: number | null;
    // 아래 두 개는 실제 사용하지 않습니다.
    koreanRawScore?: number | null;
    koreanLetterGrade?: string | null;
    mathRawScore?: number | null;
    mathLetterGrade?: string | null;
    englishRawScore?: number | null;
    englishLetterGrade?: string | null;
    societyRawScore?: number | null;
    societyLetterGrade?: string | null;
    scienceRawScore?: number | null;
    scienceLetterGrade?: string | null;
    artRawScore?: number | null;
    artLetterGrade?: string | null;
    musicRawScore?: number | null;
    musicLetterGrade?: string | null;
    physicalRawScore?: number | null;
    physicalLetterGrade?: string | null;
    // 그 외 필드는 무시
    [key: string]: any;
  };
  subjectLetterKeys: (keyof TransformedStudent)[];
}

const GradeRow: React.FC<GradeRowProps> = ({ student, subjectLetterKeys }) => {
  const handleSelect = async () => {
    await fetchStudentInfo(
      student.id,
      student.totalScore ?? 0,
      student.averageScore ?? 0
    );
  };

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

      {/* 과목별 letterGrade만 표시 */}
      {subjectLetterKeys.map((key) => (
        <td key={key}>{student[key] ?? "-"}</td>
      ))}

      <td></td>
    </tr>
  );
};

export default GradeRow;
