// CounselPage.tsx
import React, { useState } from "react";
// import { CounselTable } from "../components/CounselTable";
import { CounselStudentsTable } from "../components/CounselStudentsTable";
import { styled } from "styled-components";
import { CounselModal } from "../components/CounselModal";

const Wrapper = styled.div`
  display: flex;
  /* flex-direction: row; */
`;

const CounselPage: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [selectedClass, setSelectedClass] = useState(5);

  return (
    <Wrapper>
      <CounselStudentsTable
        grade={selectedGrade}
        classroom={selectedClass}
        onGradeChange={setSelectedGrade}
        onClassChange={setSelectedClass}
      />
      <CounselModal />
    </Wrapper>
  );
};

export default CounselPage;
