// FeedbackPage.tsx
import React from "react";
import { FeedbackModal } from "../components/FeedbackModal";
import { FeedbackStudentTable } from "../components/FeedbackStudentTable";
import { useSelectedStudentStore } from "../stores/useSelectedStudentStore";
import styled from "styled-components";

const FeedbackPage: React.FC = () => {
  const { selectedStudent } = useSelectedStudentStore();

  return (
    <Wrapper>
      <FeedbackStudentTable />
      {selectedStudent ? (
        <FeedbackModal studentId={selectedStudent.id} />
      ) : (
        <BlankWrapper></BlankWrapper>
      )}
    </Wrapper>
  );
};

export default FeedbackPage;

const Wrapper = styled.div`
  display: flex;
  /* flex-direction: row; */
`;

const BlankWrapper = styled.div`
  width: 54.25rem;
  height: 89vh;

  display: flex;

  background-color: white;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.25);
  border-radius: 1rem;

  display: flex;
  justify-content: flex-start;
`;
