import React from "react";
import styled from "styled-components";
import { StudentBrief } from "../hooks/useStudentListApi";
// import { SelectedStudent } from "../store/useSelectedStudentStore";

interface SimpleStudentRowProps {
  student: StudentBrief;
  onClick?: () => void;
  $isSelected?: boolean; // 선택 여부를 나타내는 새로운 prop
}

const StyledRow = styled.tr<{ $isSelected: boolean }>`
  width: 100%;
  cursor: pointer;
  background-color: ${(props) =>
    props.$isSelected ? "#FF8E83" : "white"}; // 선택된 경우 배경색 변경
  color: ${(props) =>
    props.$isSelected ? "white" : "black"}; // 선택된 경우 글자색 변경
  font-weight: ${(props) =>
    props.$isSelected ? "bold" : "normal"}; // 선택된 경우 글자색 변경
`;

const SimpleStudentRow: React.FC<SimpleStudentRowProps> = ({
  student,
  onClick,
  $isSelected = false,
}) => {
  return (
    <StyledRow onClick={onClick} $isSelected={$isSelected}>
      <td>{student.studentNum % 100}</td>
      <td>{student.name}</td>
    </StyledRow>
  );
};

export default SimpleStudentRow;
