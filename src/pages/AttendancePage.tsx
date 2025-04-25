// ScorePage.tsx
import React from "react";
import { AttendanceTable } from "../components/AttendanceTable";

const AttendancePage: React.FC = () => {
  return (
    <>
      <AttendanceTable grade={2} classNum={3} />
    </>
  );
};

export default AttendancePage;
