// components/GradeTableEx.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
// import { useScoreApi } from "../hooks/useScoreApi"; // useGradeApi → useScoreApi
// import GradeRow from "../components/GradeRowEx";
import SelectArrow from "../assets/icon/SelectArrow.png";
import whiteArrow from "../assets/icon/whiteArrow.png";
import { getWeekdays } from "../utils/getWeekdays";

// 샘플 학생 데이터
const students = [
  { id: 1, name: "안세균" },
  { id: 2, name: "박존슨" },
  { id: 3, name: "박기쓰껄" },
  { id: 4, name: "김진범" },
];

// 2025년 3~6월 평일 날짜
const weekdays = getWeekdays(
  new Date("2025-03-01"),
  new Date("2025-03-30"),
  // new Date("2025-06-30"),
  [] // 필요 시 공휴일 배열 추가
);

const dayKor = ["일", "월", "화", "수", "목", "금", "토"];

type Attendance = "출석" | "지각" | "결석";

type AttendanceMap = {
  [studentId: number]: {
    [date: string]: Attendance;
  };
};

const Wrapper = styled.div`
  margin-left: 0.5rem;
  margin-right: 3rem;
  width: 71.5rem;
  /* height: 47.625rem; // 762px; */
  height: 89vh;
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
  background: #63ce6a;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const BottomRectangle = styled.div`
  width: 100%;
  height: 1.5rem;
  background: #63ce6a;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;

const MainArea = styled.div`
  color: black;

  overflow-x: auto;
  max-height: 500px;

  /* border-collapse: collapse; */
  /* width: 100%; */

  // 스크롤 바 커스터마이징
  &::-webkit-scrollbar {
    height: 8px; // 가로 스크롤 높이
  }

  &::-webkit-scrollbar-thumb {
    background-color: #b5b5b5; // thumb 색상
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f0f0f0; // 트랙 색상
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #999999;
  }

  &::-webkit-scrollbar-thumb:active {
    background-color: #777777;
  }

  table {
    position: relative; // ✅ sticky 기준!
    border-collapse: collapse;
    width: max-content;
    table-layout: fixed;
  }

  th {
    width: 92px;
    border-bottom: 1.5px solid #54b25c;
    height: 2.5rem;
    text-align: center;
    font-size: 1rem;

    white-space: nowrap;
    padding: 0;
  }

  td {
    width: 92px;
    border-bottom: 1px solid #ccc;
    height: 2.5rem;
    text-align: center;
    font-size: 1rem;

    white-space: nowrap;
    padding: 0;
  }
`;

const ClassArea = styled.div`
  width: 100%;
  height: 64px;
  border-bottom: 2px solid #54b25c;

  display: flex;
  align-items: center;
`;

const ClassSelect = styled.select<{ $syllable: number }>`
  margin-left: ${(props) => (props.$syllable === 3 ? "1.25rem" : "1rem")};
  width: ${(props) =>
    props.$syllable === 3 ? "92px" : props.$syllable === 2 ? "80px" : "124px"};
  height: 2.5rem;
  padding: 0 1rem; // 12px;
  border: 2px solid #54b25c;
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

const FixedColNum = styled.th`
  position: sticky;
  left: 0px;
  z-index: 3;
  background: white;

  width: 92px;
`;

const FixedColName = styled.th`
  position: sticky;
  left: 92px;
  z-index: 3;
  background: white;

  width: 92px;
`;

const FixedCellNum = styled.td`
  position: sticky;
  left: 0%;
  background: white;
  z-index: 2;

  width: 92px;
`;

const FixedCellName = styled.td`
  position: sticky;
  left: 92px;
  background: white;
  z-index: 2;

  width: 92px;
`;

// 사전에 정의한 type Attendance 중에서 props로 받을 수 있게 설정
const AttendanceSelect = styled.select<{ $status: Attendance }>`
  padding-left: 8px;
  font-weight: bold;
  border-radius: 0.65rem;
  width: 4rem;
  height: 1.75rem;
  font-size: 0.85rem;

  // 기본값이었던 것
  /* color: black; */
  /* border: 1.5px solid #b9b9b9; */

  &:focus {
    outline: none;
  }

  appearance: none;
  -webkit-appearance: none;
  background-color: white;

  background-image: ${(props) =>
    `url(${props.$status === "출석" ? SelectArrow : whiteArrow})`};

  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  // arrow 적용이 이상하게 될 경우(높이가 안맞을 경우)
  /* background-position: right 0.5rem
    ${(props) => (props.$status !== "출석" ? "top 0.65rem" : "center")}; */

  background-size: 0.75rem;

  border: 1.5px solid
    ${(props) =>
      props.$status === "출석"
        ? "#b9b9b9"
        : props.$status === "지각"
          ? "#FC8D4C"
          : "#FF6969"};

  background-color: ${(props) =>
    props.$status === "출석"
      ? "white"
      : props.$status === "지각"
        ? "#FC8D4C"
        : "#FF6969"};

  color: ${(props) => (props.$status === "출석" ? "black" : "white")};
`;

interface AttendanceTableProps {
  grade: number;
  classNum: number;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  grade,
  classNum,
}) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceMap>({});

  // 초기값 설정: 출석으로 전부 기본값
  useEffect(() => {
    const initial: AttendanceMap = {};
    students.forEach((student) => {
      initial[student.id] = {};
      weekdays.forEach((date) => {
        initial[student.id][date] = "출석";
      });
    });
    setAttendanceData(initial);
  }, []);

  // 드롭다운 변경 시
  const handleChange = (studentId: number, date: string, value: Attendance) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [date]: value,
      },
    }));
  };
  return (
    <Wrapper>
      <div>
        <TopRectangle />
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
        </ClassArea>
        <MainArea>
          <table>
            <colgroup>
              <col />
              <col />
              {weekdays.map((_, idx) => (
                <col key={idx} style={{ width: "100px" }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <FixedColNum>번호</FixedColNum>
                <FixedColName>이름</FixedColName>

                {/* {weekdays.map((date) => (
                  <th key={date}>{date.slice(5)}</th>
                ))} */}
                {weekdays.map((dateStr) => {
                  const date = new Date(dateStr);
                  const month = (date.getMonth() + 1)
                    .toString()
                    .padStart(2, "0");
                  const day = date.getDate().toString().padStart(2, "0");
                  const weekday = dayKor[date.getDay()];
                  return (
                    <th key={dateStr}>{`${month}/${day} (${weekday})`}</th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => (
                <tr key={student.id}>
                  <FixedCellNum>{i + 1}</FixedCellNum>
                  <FixedCellName>{student.name}</FixedCellName>
                  {weekdays.map((date) => (
                    <td key={`${student.id}-${date}`}>
                      <AttendanceSelect
                        $status={attendanceData[student.id]?.[date] || "출석"}
                        value={attendanceData[student.id]?.[date] || "출석"}
                        onChange={(e) =>
                          handleChange(
                            student.id,
                            date,
                            e.target.value as Attendance
                          )
                        }
                      >
                        <option value="출석">출석</option>
                        <option value="지각">지각</option>
                        <option value="결석">결석</option>
                      </AttendanceSelect>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </MainArea>
      </div>
      <BottomRectangle />
    </Wrapper>
  );
};
