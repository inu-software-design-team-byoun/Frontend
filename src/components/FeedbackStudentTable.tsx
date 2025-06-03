// components/FeedbackStudentTable.tsx
import React, { useState } from "react";
import styled from "styled-components";
import SimpleStudentRow from "./SimpleStudentRow";
import { useStudentsListApi } from "../hooks/useStudentListApi";
import { useSelectedStudentStore } from "../stores/useSelectedStudentStore";
import SearchIcon from "../assets/icon/SearchIcon.svg";
import SelectArrow from "../assets/icon/SelectArrow.png";

interface FeedbackStudentTableProps {
  grade: number;
  classroom: number;
  onGradeChange: (g: number) => void;
  onClassChange: (c: number) => void;
}

export const FeedbackStudentTable: React.FC<FeedbackStudentTableProps> = ({
  grade,
  classroom,
  onGradeChange,
  onClassChange,
}) => {
  const { selectedStudent, setSelectedStudent } = useSelectedStudentStore();
  const { data: studentList } = useStudentsListApi(grade, classroom);
  const [query, setQuery] = useState("");
  const filtered = studentList.filter((s) => s.name.includes(query));

  return (
    <Wrapper>
      <TopRectangle />
      <ClassArea>
        <Select
          $syllable={3}
          value={grade}
          onChange={(e) => onGradeChange(Number(e.target.value))}
        >
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </Select>
        <Select
          $syllable={2}
          value={classroom}
          onChange={(e) => onClassChange(Number(e.target.value))}
        >
          <option value="1">1반</option>
          <option value="2">2반</option>
          <option value="3">3반</option>
          <option value="4">4반</option>
          <option value="5">5반</option>
          <option value="6">6반</option>
        </Select>
      </ClassArea>
      <SearchArea>
        <input
          placeholder="검색어 입력"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </SearchArea>
      <TableWrapper>
        <StyledTable>
          <colgroup>
            <col />
            <col />
          </colgroup>
          <tbody>
            {filtered.map((stu) => (
              <SimpleStudentRow
                key={stu.id}
                student={stu}
                onClick={() => setSelectedStudent(stu)}
                $isSelected={selectedStudent?.id === stu.id}
                $bgColor="#9E8DFF"
              />
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
      <BottomRectangle />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-left: 0.5rem;
  margin-right: 3rem;
  width: 14.25rem;
  height: 89vh;
  background-color: white;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.25);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const TopRectangle = styled.div`
  width: 100%;
  height: 1.5rem;
  background: #9e8dff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const BottomRectangle = styled.div`
  margin-top: auto;
  width: 100%;
  height: 1.5rem;
  background: #9e8dff;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;

const ClassArea = styled.div`
  width: 100%;
  height: 64px;
  border-bottom: 2px solid #c2b7ff;
  display: flex;
  align-items: center;

  button {
    margin-left: 2rem;
    width: 4rem;
    height: 2rem;
    color: black;
  }
`;

const Select = styled.select<{ $syllable: number }>`
  margin-left: ${(props) => (props.$syllable === 3 ? "1.25rem" : "1rem")};
  width: ${(props) =>
    props.$syllable === 3 ? "92px" : props.$syllable === 2 ? "80px" : "124px"};
  height: 2.5rem;
  padding: 0 1rem;
  border: 2px solid #c2b7ff;
  border-radius: 0.65rem;
  color: black;
  font-family: NanumSquare;
  font-size: 1rem;
  font-weight: bold;
  background-color: white;
  &:focus {
    outline: none;
  }
  appearance: none;
  -webkit-appearance: none;
  background-color: white;
  background-image: url(${SelectArrow});
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 0.75rem;
`;

const SearchArea = styled.div`
  width: 100%;
  height: 3rem;
  border-bottom: 2px solid #c2b7ff;
  display: flex;
  justify-content: center;
  align-items: center;

  input {
    width: 132px;
    height: 2.25rem;
    border: 1.5px solid #c2b7ff;
    border-radius: 0.5rem;
    background-color: #efecff;
    /* background-image: url("${SearchIcon}"); */
    /* background-position: right 0.625rem center; */
    /* background-repeat: no-repeat; */
    /* background-size: 1rem; */
    color: gray;
    font-size: 1rem;
    padding: 0 2.5rem 0 1rem;
    &:focus {
      outline: none;
    }
    &::placeholder {
      color: #9990c7;
    }
  }
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 36.125rem;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  col {
    width: 8%;
  }
  thead {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    border-bottom: 1.5px solid #c2b7ff;
  }
  th,
  td {
    text-align: center;
    font-size: 1rem;
    height: 2.5rem;
  }
  th {
    border: none;
  }
  td {
    border-bottom: 1px solid #ccc;
  }
`;
