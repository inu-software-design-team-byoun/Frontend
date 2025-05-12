import React from "react";
import styled from "styled-components";
import { StudentBrief } from "../hooks/useStudentListApi";

interface SimpleStudentRowProps {
  student: StudentBrief;
}

const StyledRow = styled.tr`
  width: 100%;
`;

const SimpleStudentRow: React.FC<SimpleStudentRowProps> = ({ student }) => {
  return (
    <StyledRow>
      <td>{student.studentNum % 100}</td>
      <td>{student.name}</td>
    </StyledRow>
  );
};

export default SimpleStudentRow;
