// GradeTable.tsx
import React from "react";
import styled from "styled-components";
import { useGradeApi } from "./useGradeApi";
import { GradeRow } from "./GradeRow";
// import { GradeFormRow } from "./GradeFormRow";

const Wrapper = styled.div`
  margin-left: 0.5rem;
  margin-right: 3rem;
  width: 71.5rem;
  height: 27rem; // 476px;
  background-color: white;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.25);
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TopRectangle = styled.div`
  width: 100%;
  height: 1.5rem;
  background: #86acff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const BottomRectangle = styled.div`
  width: 100%;
  height: 1.5rem;
  background: #86acff;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;

const MainArea = styled.table`
  color: black;
  border-collapse: collapse;
  width: 100%;

  th {
    border-bottom: 1px solid #86acff;
    padding: 0.5rem;
    text-align: center;
    font-weight: bold;
    font-size: 1rem;
  }

  td {
    border-bottom: 1px solid #ccc;
    padding: 0.5rem;
    text-align: center;
    font-size: 1rem;
  }
`;

const ClassArea = styled.div`
  width: 100%;
  height: 40px;
  border-bottom: 2px solid #86acff;
`;

export const GradeTable: React.FC = () => {
  // const { grades, addGrade, updateGrade, deleteGrade } = useGradeApi();
  const { grades, updateGrade, deleteGrade } = useGradeApi();

  return (
    <Wrapper>
      <div>
        <TopRectangle />
        <ClassArea></ClassArea>
        <MainArea>
          <thead>
            <tr>
              <th>번호</th>
              <th>이름</th>
              <th>국어</th>
              <th>수학</th>
              <th>영어</th>
              <th>사회</th>
              <th>과학</th>
              <th>미술</th>
              <th>음악</th>
              <th>체육</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <GradeRow
                key={grade.id}
                grade={grade}
                onUpdate={updateGrade}
                onDelete={deleteGrade}
              />
            ))}
            {/* <GradeFormRow onAdd={addGrade} /> */}
          </tbody>
        </MainArea>
      </div>
      <BottomRectangle />
    </Wrapper>
  );
};
