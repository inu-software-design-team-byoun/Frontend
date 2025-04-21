// components/GradeTableEx.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useScoreApi } from "../hooks/useScoreApi"; // useGradeApi → useScoreApi

import GradeRow from "../components/GradeRowEx";
import { TransformedStudent } from "../hooks/useScoreApi"; // 맨 위 import 추가
import SelectArrow from "../assets/icon/SelectArrow.png";

const Wrapper = styled.div`
  margin-left: 0.5rem;
  margin-right: 3rem;
  width: 71.5rem;
  height: 27rem; // 432px;
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

  /* bottom: 0;
  position: sticky;
  z-index: 2; */
`;

const MainArea = styled.table`
  color: black;
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;

  th {
    border-bottom: 1px solid #86acff;
    padding: 0.5rem;
    height: 1.5rem;
    text-align: center;
    font-weight: bold;
    font-size: 1rem;
  }
`;

const ScrollableTbody = styled.div`
  max-height: 277px; // 원하는 높이로 조절
  overflow-y: auto;

  // 스크롤 바 디자인
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }

  table {
    color: black;
    border-collapse: collapse;
    width: 100%;
    table-layout: fixed;
    color: black;
  }

  td {
    /* color: black; */
    border-bottom: 1px solid #ccc;
    height: 2.5rem;
    /* padding: 0.5rem; */
    text-align: center;
    font-size: 1rem;
  }
`;

const ClassArea = styled.div`
  width: 100%;
  height: 64px;
  border-bottom: 2px solid #86acff;

  display: flex;
  align-items: center;
`;

const Select = styled.select<{ syllable: number }>`
  margin-left: ${(props) => (props.syllable === 3 ? "1.25rem" : "1rem")};
  width: ${(props) =>
    props.syllable === 3 ? "92px" : props.syllable === 2 ? "80px" : "124px"};
  height: 2.5rem;
  padding: 0 1rem; // 12px;
  border: 2px solid #86acff;
  border-radius: 0.65rem;

  color: black;
  font-family: NanumSquare;
  font-size: 1rem;
  font-weight: bold;

  background-color: white;

  &:focus {
    outline: none;
    /* border-color: black; */
  }

  appearance: none;
  -webkit-appearance: none;
  background-color: white;

  background-image: url(${SelectArrow});
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 0.75rem;
`;

interface GradeTableProps {
  grade?: number;
  classNum?: number;
}

export const GradeTable: React.FC<GradeTableProps> = ({
  grade = 2,
  classNum = 3,
}) => {
  const { data, loading } = useScoreApi(grade, classNum);
  // const [students, setStudents] = useState([]);
  const [students, setStudents] = useState<TransformedStudent[]>([]);

  const handleDelete = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  useEffect(() => {
    setStudents(data);
  }, [data]);

  if (loading) return <div>Loading...</div>;

  const subjects = [
    "국어",
    "수학",
    "영어",
    "사회",
    "과학",
    "미술",
    "음악",
    "체육",
  ];

  return (
    <Wrapper>
      <div>
        <TopRectangle />
        <ClassArea>
          <Select
            syllable={3}
            //  value={selectedGrade}
            //  onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
          </Select>
          <Select
            syllable={2}
            //  value={selectedClass}
            //  onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="1">1반</option>
            <option value="2">2반</option>
            <option value="3">3반</option>
            <option value="4">4반</option>
            <option value="5">5반</option>
            <option value="6">6반</option>
          </Select>
          <Select
            syllable={4}
            //  value={selectedSemester}
            //  onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="1학기 중간">1학기 중간</option>
            <option value="1학기 기말">1학기 기말</option>
            <option value="2학기 중간">2학기 중간</option>
            <option value="2학기 기말">2학기 기말</option>
          </Select>
        </ClassArea>

        <MainArea>
          <colgroup>
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            {/* <col style={{ width: "11%" }} /> */}
          </colgroup>
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
        </MainArea>
        <ScrollableTbody>
          <table>
            <colgroup>
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              {/* <col style={{ width: "11%" }} /> */}
            </colgroup>
            <tbody>
              {data.map((student) => (
                <GradeRow
                  key={student.id}
                  student={student}
                  subjects={subjects}
                />
              ))}
            </tbody>
          </table>
        </ScrollableTbody>
      </div>
      <BottomRectangle />
    </Wrapper>
  );
};
