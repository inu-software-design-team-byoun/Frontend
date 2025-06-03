// CounselPage.tsx
import React, { useState } from "react";
// import { CounselTable } from "../components/CounselTable";
import { CounselStudentsTable } from "../components/CounselStudentsTable";
import { styled } from "styled-components";
import { CounselModal } from "../components/CounselModal";
import { useSelectedStudentStore } from "../stores/useSelectedStudentStore";

const CounselPage: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [selectedClass, setSelectedClass] = useState(5);
  const { selectedStudent } = useSelectedStudentStore(); // Zustand store에서 선택된 학생 가져오기

  return (
    <Wrapper>
      <CounselStudentsTable
        grade={selectedGrade}
        classroom={selectedClass}
        onGradeChange={setSelectedGrade}
        onClassChange={setSelectedClass}
      />
      {selectedStudent ? (
        <CounselModal studentId={selectedStudent.id} />
      ) : (
        <BlankWrapper>
          <StudentInfoArea></StudentInfoArea>
          <RecordArea>
            <TitleArea>
              <span className="title">상담일지</span>
            </TitleArea>
            <TableArea>표에서 학생을 선택하세요!</TableArea>
          </RecordArea>
        </BlankWrapper>
      )}
    </Wrapper>
  );
};

export default CounselPage;

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

const StudentInfoArea = styled.div`
  width: 12.5rem;
  height: 100%;
  background-color: #ff8e83;
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;

  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.25);
`;

const RecordArea = styled.div`
  width: 100%;
  height: 89vh;

  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const TitleArea = styled.div`
  width: 100%;
  height: 3rem;

  margin-top: 2rem;
  margin-bottom: 0.5rem;

  display: flex;
  align-items: center;

  color: black;

  .title {
    margin: 0 1.25rem 0 2.5rem;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .student {
    height: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: end;

    color: gray;
    font-size: 1rem;
    font-weight: bold;
  }
`;

const TableArea = styled.div`
  width: 624px;
`;
