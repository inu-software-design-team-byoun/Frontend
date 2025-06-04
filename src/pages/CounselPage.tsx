// pages/CounselPage.tsx
import React, { useState, useEffect } from "react";
import { CounselStudentsTable } from "../components/CounselStudentsTable";
import { styled } from "styled-components";
import { CounselModal } from "../components/CounselModal";
import { useSelectedStudentStore } from "../stores/useSelectedStudentStore";
import { useAuthStore } from "../hooks/useAuthStore"; // 추가

const CounselPage: React.FC = () => {
  // 로그인한 교사의 학년/반을 한 번만 읽어서
  // 부모 state의 초기값으로 사용합니다.
  const teacherGrade = useAuthStore((state) => state.teacherGrade);
  const teacherClassroom = useAuthStore((state) => state.teacherClassroom);

  // 부모가 고유하게 관리하는 state
  const [selectedGrade, setSelectedGrade] = useState<number>(teacherGrade || 1);
  const [selectedClass, setSelectedClass] = useState<number>(
    teacherClassroom || 1
  );

  const { selectedStudent } = useSelectedStudentStore();

  // (선택사항) 혹시 teacherGrade/teacherClassroom이 나중에 바뀔 가능성이 있다면
  // 다음 useEffect를 추가해서 부모 state를 업데이트해 줍니다.
  // 단, 로그인 단계 이후에 바뀔 일이 거의 없다면 없어도 무방합니다.
  useEffect(() => {
    setSelectedGrade(teacherGrade || 1);
    setSelectedClass(teacherClassroom || 1);
  }, [teacherGrade, teacherClassroom]);

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
