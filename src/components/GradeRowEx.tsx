//GradeRowEx.tsx
import React, { useState } from "react";
import styled from "styled-components";

const CustomInput = styled.input`
  border: 1px solid #7c7c7c;
  border-radius: 0.75rem;
  width: 4rem;
  height: 1.75rem;
  background-color: transparent;
  color: black;
  font-size: 1rem;
  text-align: center;
`;

const EditButton = styled.button`
  margin: 0 0.25rem;
  border: none;
  background-color: transparent;
  font-size: 1rem;
  cursor: pointer;
`;

interface GradeRowProps {
  student: { [key: string]: string | number };
  subjects: string[];
  onDelete?: (id: number) => void;
}

const GradeRow: React.FC<GradeRowProps> = ({ student, subjects, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(student.name as string);
  const [subjectInputs, setSubjectInputs] = useState<{ [key: string]: string }>(
    () =>
      subjects.reduce(
        (acc, subj) => {
          acc[subj] = (student[subj] as string) || "";
          return acc;
        },
        {} as { [key: string]: string }
      )
  );

  const handleChange = (subject: string, value: string) => {
    setSubjectInputs((prev) => ({ ...prev, [subject]: value }));
  };

  const handleSave = () => {
    // TODO: 실제 저장 처리 (API 연동 등)
    setIsEditing(false);
  };

  return (
    <tr>
      <td>{String(student.id).slice(-2)}</td>
      <td>
        {isEditing ? (
          <CustomInput
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
        ) : (
          nameInput
        )}
      </td>
      {subjects.map((subj) => (
        <td key={subj}>
          {isEditing ? (
            <CustomInput
              value={subjectInputs[subj]}
              onChange={(e) => handleChange(subj, e.target.value)}
            />
          ) : (
            subjectInputs[subj] || "-"
          )}
        </td>
      ))}
      <td>
        {isEditing ? (
          <EditButton onClick={handleSave}>✅</EditButton>
        ) : (
          <EditButton onClick={() => setIsEditing(true)}>✏️</EditButton>
        )}
        <EditButton onClick={() => onDelete?.(student.id as number)}>
          🗑️
        </EditButton>
      </td>
    </tr>
  );
};

export default GradeRow;
