// CounselPage.tsx
import React, { useState } from "react";
// import { CounselTable } from "../components/CounselTable";
import { CounselStudentsTable } from "../components/CounselStudentsTable";

const CounselPage: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [selectedClass, setSelectedClass] = useState(5);

  return (
    <>
      <CounselStudentsTable
        grade={selectedGrade}
        classroom={selectedClass}
        onGradeChange={setSelectedGrade}
        onClassChange={setSelectedClass}
      />
    </>
  );
};

export default CounselPage;
