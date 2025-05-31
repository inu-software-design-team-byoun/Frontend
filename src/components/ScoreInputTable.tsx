import React from "react";
import styled from "styled-components";
import SelectArrow from "../assets/icon/SelectArrow.png";

const Wrapper = styled.div`
  margin-left: 0.5rem;
  margin-right: 3rem;
  width: 71.5rem;
  height: 89vh;
  background-color: white;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.25);
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  justify-content: flex-start;
  position: relative;
`;

const TopRectangle = styled.div`
  /* position: absolute;
  top: 0; */

  width: 100%;
  height: 1.5rem;
  background: #16a1a9;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const BottomRectangle = styled.div`
  position: absolute;
  bottom: 0;

  width: 100%;
  height: 1.5rem;
  background: #16a1a9;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;

const TitleArea = styled.div`
  width: 100%;
  height: 88px;

  margin-bottom: 0.5rem;

  display: flex;
  align-items: center;

  color: black;

  .title {
    margin: 0 1.25rem 0 2rem;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .subject {
    width: 4.5rem;
    height: 3rem;
    background-color: #16a1a9;
    border-radius: 1rem;

    display: flex;
    justify-content: center;
    align-items: center;

    color: white;
    font-size: 1.25rem;
    font-weight: bold;
  }
`;

const ClassArea = styled.div`
  width: 100%;
  height: 64px;
  border-bottom: 2px solid #16a1a9;

  display: flex;
  align-items: center;
`;

const ClassSelect = styled.select<{ $syllable: number }>`
  margin-left: ${(props) => (props.$syllable === 3 ? "1.25rem" : "1rem")};

  width: ${(props) => {
    if (props.$syllable >= 4) {
      return `${80 + props.$syllable * 8}px`;
    } else if (props.$syllable === 3) {
      return "92px";
    } else if (props.$syllable === 2) {
      return "80px";
    } else {
      return "124px";
    }
  }};
  height: 2.5rem;
  padding: 0 1rem; // 12px;
  border: 2px solid #16a1a9;
  border-radius: 0.65rem;

  color: black;
  font-family: NanumSquare;
  font-size: 1rem;
  font-weight: 900;

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

const ScrollArea = styled.div`
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #b5b5b5;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
`;
const MainArea = styled.table`
  color: black;
  border-collapse: collapse;
  width: 52.25rem;
  table-layout: fixed;
  border-right: 1px solid gray;

  thead {
    display: table;
    width: 52.25rem;
    table-layout: fixed;
  }

  tbody {
    display: block;
    width: 52.25rem;

    /* height: 547.5px; */
    height: 32rem;
    overflow-y: auto;
  }

  th,
  td {
    height: 2.5rem;
    text-align: center;
    font-size: 1rem;
    white-space: nowrap;
    /* padding: 0 0.5rem; */
  }

  th {
    border-bottom: 1px solid #16a1a9;
    font-weight: bold;
  }

  td {
    border-bottom: 1px solid #ccc;
  }

  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }

  /* 스크롤바 */
  tbody::-webkit-scrollbar {
    width: 8px;
  }
  tbody::-webkit-scrollbar-thumb {
    background-color: #b5b5b5;
    border-radius: 4px;
  }
  tbody::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
`;

interface ScoreInputTableProps {
  grade?: number;
  classNum?: number;
}

export const ScoreInputTable: React.FC<ScoreInputTableProps> = () =>
  // {grade = 2,classNum = 3,}
  {
    return (
      <Wrapper>
        <div>
          <TopRectangle />
          <TitleArea>
            <span className="title">성적 입력</span>
            <span className="subject">국어</span>
          </TitleArea>
          <ClassArea>
            <ClassSelect
              $syllable={3}

              //  value={selectedGrade}
              //  onChange={(e) => setSelectedGrade(e.target.value)}
            >
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
            </ClassSelect>
            <ClassSelect
              $syllable={2}

              //  value={selectedClass}
              //  onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="1">1반</option>
              <option value="2">2반</option>
              <option value="3">3반</option>
              <option value="4">4반</option>
              <option value="5">5반</option>
              <option value="6">6반</option>
            </ClassSelect>
            <ClassSelect
              $syllable={6}

              //  value={selectedClass}
              //  onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="1">1학기 중간</option>
              <option value="2">1학기 기말</option>
              <option value="3">2학기 중간</option>
              <option value="4">2학기 기말</option>
            </ClassSelect>
            <ClassSelect
              $syllable={8}

              //  value={selectedClass}
              //  onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="2024">2024 학년도</option>
              <option value="2025">2025 학년도</option>
            </ClassSelect>
          </ClassArea>
          <ScrollArea>
            <MainArea>
              <colgroup>
                <col style={{ width: "8%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "8%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>이름</th>
                  <th>원점수</th>
                  <th>과목평균</th>
                  <th>석차등급</th>
                  <th>응시자수</th>
                  <th>등급</th>
                </tr>
              </thead>

              <tbody>
                {Array.from({ length: 15 }).map((_, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>홍길동</td>
                    <td>95</td>
                    <td>84</td>
                    <td>3</td>
                    <td>29</td>
                    <td>B+</td>
                  </tr>
                ))}
              </tbody>
            </MainArea>
          </ScrollArea>
        </div>
        <BottomRectangle />
      </Wrapper>
    );
  };
