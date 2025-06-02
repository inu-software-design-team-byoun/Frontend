// components/AttendanceTable.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useStudentsListApi } from "../hooks/useStudentListApi";
import SelectArrow from "../assets/icon/SelectArrow.png";

const dayKor = ["일", "월", "화", "수", "목", "금", "토"];

// 2025년 3~6월 평일 날짜 (예시)
import { getWeekdays } from "../utils/getWeekdays";
const weekdays = getWeekdays(
  new Date("2025-03-01"),
  new Date("2025-06-30"),
  [] // 공휴일이 있으면 배열 추가
);

// “출석”, “지각”, “결석” 세 가지 상태 타입 정의
type Attendance = "출석" | "지각" | "결석";

// 학생별, 날짜별 출결 상태 맵
type AttendanceMap = {
  [studentId: number]: {
    [date: string]: Attendance;
  };
};

interface AttendanceTableProps {
  grade: number;
  classNum: number;
  onGradeChange: (g: number) => void;
  onClassChange: (c: number) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  grade,
  classNum,
  onGradeChange,
  onClassChange,
}) => {
  // 1) API 훅 호출해서 studentList 가져오기
  const { data: studentList } = useStudentsListApi(grade, classNum);

  // 2) 검색어 상태
  const [query, setQuery] = useState("");

  // 3) 출결 상태 저장
  const [attendanceData, setAttendanceData] = useState<AttendanceMap>({});

  // studentList가 바뀔 때마다 attendanceData 초기화
  useEffect(() => {
    const initial: AttendanceMap = {};
    studentList.forEach((stu) => {
      initial[stu.id] = {};
      weekdays.forEach((dateStr) => {
        initial[stu.id][dateStr] = "출석";
      });
    });
    setAttendanceData(initial);
  }, [studentList]);

  // 검색 결과: 이름에 query 포함된 학생만 필터링
  const filteredStudents = studentList.filter((s) => s.name.includes(query));

  // 드롭다운 변경 시 출석 상태 업데이트
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
      {/* 상단 학년/반 선택 부분 */}
      <TopRectangle />
      <ClassArea>
        <ClassSelect
          $syllable={3}
          value={grade}
          onChange={(e) => {
            onGradeChange(Number(e.target.value));
          }}
        >
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </ClassSelect>

        <ClassSelect
          $syllable={2}
          value={classNum}
          onChange={(e) => {
            onClassChange(Number(e.target.value));
          }}
        >
          <option value="1">1반</option>
          <option value="2">2반</option>
          <option value="3">3반</option>
          <option value="4">4반</option>
          <option value="5">5반</option>
          <option value="6">6반</option>
        </ClassSelect>
      </ClassArea>

      {/* 검색 영역 */}
      <SearchArea>
        <input
          placeholder="이름으로 검색 + Enter"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </SearchArea>

      {/* 테이블 영역 */}
      <MainArea>
        <table>
          <colgroup>
            <col style={{ width: "60px" }} />
            <col style={{ width: "120px" }} />
            {weekdays.map((_, idx) => (
              <col key={idx} style={{ width: "100px" }} />
            ))}
          </colgroup>

          <thead>
            <tr>
              <FixedColNum>번호</FixedColNum>
              <FixedColName>이름</FixedColName>
              {weekdays.map((dateStr) => {
                const date = new Date(dateStr);
                const MM = String(date.getMonth() + 1).padStart(2, "0");
                const DD = String(date.getDate()).padStart(2, "0");
                const WK = dayKor[date.getDay()];
                return <th key={dateStr}>{`${MM}/${DD} (${WK})`}</th>;
              })}
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student, idx) => (
              <tr key={student.id}>
                <FixedCellNum>{idx + 1}</FixedCellNum>
                <FixedCellName>{student.name}</FixedCellName>
                {weekdays.map((dateStr) => (
                  <td key={`${student.id}-${dateStr}`}>
                    <AttendanceSelect
                      $status={attendanceData[student.id]?.[dateStr] || "출석"}
                      value={attendanceData[student.id]?.[dateStr] || "출석"}
                      onChange={(e) =>
                        handleChange(
                          student.id,
                          dateStr,
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

      <BottomRectangle />
    </Wrapper>
  );
};

// ======================== styled-components ========================
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
  padding: 0 1rem;
  border: 2px solid #54b25c;
  border-radius: 0.65rem;
  font-family: NanumSquare;
  font-size: 1rem;
  font-weight: 900;
  background-color: white;
  color: black;

  appearance: none;
  background-image: url(${SelectArrow});
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 0.75rem;

  &:focus {
    outline: none;
  }
`;

const SearchArea = styled.div`
  width: 100%;
  height: 3rem;
  border-bottom: 2px solid #54b25c;
  display: flex;
  justify-content: center;
  align-items: center;

  input {
    width: 200px;
    height: 2.25rem;
    border: 1.5px solid #54b25c;
    border-radius: 0.5rem;
    background-color: #f5faf5;
    font-size: 1rem;
    padding: 0 1rem;
    &:focus {
      outline: none;
    }
    &::placeholder {
      color: #777;
    }
  }
`;

const MainArea = styled.div`
  flex: 1;
  overflow-x: auto;
  max-height: calc(100% - 128px); /* 헤더, 풋터, 검색 영역 등을 제외한 높이 */
  table {
    position: relative; /* sticky 기준 */
    border-collapse: collapse;
    width: max-content;
    table-layout: fixed;
  }

  th {
    width: 100px;
    border-bottom: 1.5px solid #54b25c;
    height: 2.5rem;
    text-align: center;
    font-size: 1rem;
    white-space: nowrap;
    background: white;
    z-index: 1;
  }

  td {
    width: 100px;
    border-bottom: 1px solid #ccc;
    height: 2.5rem;
    text-align: center;
    font-size: 1rem;
    white-space: nowrap;
  }

  /* 스크롤바 스타일 (선택 사항) */
  &::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #b5b5b5;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #999999;
  }
`;

const FixedColNum = styled.th`
  position: sticky;
  left: 0;
  z-index: 2;
  background: white;
  width: 60px;
`;

const FixedColName = styled.th`
  position: sticky;
  left: 60px;
  z-index: 2;
  background: white;
  width: 120px;
`;

const FixedCellNum = styled.td`
  position: sticky;
  left: 0;
  z-index: 1;
  background: white;
  width: 60px;
`;

const FixedCellName = styled.td`
  position: sticky;
  left: 60px;
  z-index: 1;
  background: white;
  width: 120px;
`;

const AttendanceSelect = styled.select<{ $status: Attendance }>`
  padding-left: 8px;
  font-weight: bold;
  border-radius: 0.65rem;
  width: 4rem;
  height: 1.75rem;
  font-size: 0.85rem;
  appearance: none;
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 0.75rem;

  /* 드롭다운 모양(배경색, 테두리, 화살표) */
  background-image: ${(props) =>
    `url(${props.$status === "출석" ? SelectArrow : ""})`};
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

  &:focus {
    outline: none;
  }
`;
