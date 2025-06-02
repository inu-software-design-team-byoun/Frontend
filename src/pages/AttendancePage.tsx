// ScorePage.tsx
import React, { useState } from "react";
import { AttendanceTable } from "../components/AttendanceTable";

const AttendancePage: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [selectedClass, setSelectedClass] = useState(5);

  return (
    <>
      <AttendanceTable
        grade={selectedGrade}
        classNum={selectedClass}
        onGradeChange={setSelectedGrade}
        onClassChange={setSelectedClass}
      />
    </>
  );
};

export default AttendancePage;
