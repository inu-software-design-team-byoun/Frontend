// ScorePage.tsx
import React from "react";
import { ScoreInputTable } from "../components/ScoreInputTable";
// import ScoreInputTable from "../components/ScoreInputTable"; // 이렇게하니까 Module default 어쩌구 오류남..

const ScoreInputPage: React.FC = () => {
  return (
    <>
      <ScoreInputTable grade={2} classNum={3} />
    </>
  );
};

export default ScoreInputPage;
