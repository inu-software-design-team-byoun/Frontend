// components/AttendanceTable.tsx
import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useStudentsListApi, StudentBrief } from "../hooks/useStudentListApi";
import SelectArrow from "../assets/icon/SelectArrow.png";
import { ENDPOINTS } from "../constants/api";

const dayKor = ["일", "월", "화", "수", "목", "금", "토"];

// 2025년 3~6월 평일 날짜(예시)
import { getWeekdays } from "../utils/getWeekdays";
const weekdays = getWeekdays(
  new Date("2025-03-01"),
  new Date("2025-06-30"),
  [] // 필요하면 공휴일 배열을 넣으세요
);

// “출석”, “지각”, “결석” 세 가지 상태 타입
type Attendance = "출석" | "지각" | "결석";

// 학생별, 날짜별 출결 상태를 저장하는 맵 타입
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
  // 1) 학년·반별 학생 목록 가져오기
  const { data: studentList } = useStudentsListApi(grade, classNum);

  // 2) 검색어 상태
  const [query, setQuery] = useState<string>("");

  // 3) 출결 데이터 저장용 state
  //   - attendanceData: 화면에 표시 중인 “최신” 상태
  //   - originalData: 서버에서 마지막으로 받아온(또는 저장한) 기준 상태
  const [attendanceData, setAttendanceData] = useState<AttendanceMap>({});
  const [originalData, setOriginalData] = useState<AttendanceMap>({});

  // 4) 변경사항 여부 감지용 플래그
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // ─────────────────────────────────────────────────────────────
  // STEP 1. studentList 또는 grade/classNum이 바뀔 때마다 “출석 초기화 + 서버 조회”
  useEffect(() => {
    // 1-1) 모든 셀을 “출석”으로 초기 세팅
    const initialMap: AttendanceMap = {};
    studentList.forEach((stu: StudentBrief) => {
      initialMap[stu.id] = {};
      weekdays.forEach((dateStr: string) => {
        initialMap[stu.id][dateStr] = "출석";
      });
    });

    // 1-2) 학년·반별 출석정보를 한 번에 가져오기
    const fetchClassAttendance = async () => {
      // initialMap 복사해서 mergedMap 생성
      const mergedMap: AttendanceMap = JSON.parse(JSON.stringify(initialMap));

      // 쿼리 파라미터 세팅 (시작/끝 날짜는 필수 아님)
      const startDate = weekdays[0]; // 예: "2025-03-01"
      const endDate = weekdays[weekdays.length - 1]; // 예: "2025-06-30"
      const url = ENDPOINTS.attendancesByClass(
        grade,
        classNum,
        startDate,
        endDate
      );

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const arr: Array<{
          id: number;
          student: { id: number };
          date: string; // ex: "2025-03-15" 또는 "2025-03-15T00:00:00.000Z"
          status: Attendance;
          note: string;
        }> = await res.json();

        // 받은 배열을 순회하며 mergedMap 덮어쓰기
        arr.forEach((rec) => {
          const ymd = rec.date.slice(0, 10);
          const sid = rec.student.id;
          if (mergedMap[sid] && mergedMap[sid][ymd] !== undefined) {
            mergedMap[sid][ymd] = rec.status;
          }
        });
      } catch (err) {
        console.error("class attendance fetch error:", err);
      }

      // 1-3) mergedMap을 originalData와 attendanceData에 저장
      setOriginalData(mergedMap);
      setAttendanceData(mergedMap);
    };

    fetchClassAttendance();
  }, [studentList, grade, classNum]);

  // ─────────────────────────────────────────────────────────────
  // STEP 2. attendanceData 또는 originalData가 바뀔 때마다 “변경사항 감지”
  useEffect(() => {
    if (studentList.length === 0) {
      setHasChanges(false);
      return;
    }
    const detectChanges = (): boolean => {
      for (const stu of studentList) {
        const sid = stu.id;
        for (const dateStr of weekdays) {
          const orig = originalData[sid]?.[dateStr] ?? "출석";
          const curr = attendanceData[sid]?.[dateStr] ?? "출석";
          if (orig !== curr) return true;
        }
      }
      return false;
    };
    setHasChanges(detectChanges());
  }, [attendanceData, originalData, studentList]);

  // ─────────────────────────────────────────────────────────────
  // STEP 3. 드롭다운 선택 시 해당 셀만 attendanceData 업데이트
  const handleChange = (studentId: number, date: string, value: Attendance) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [date]: value,
      },
    }));
  };

  // ─────────────────────────────────────────────────────────────
  // STEP 4. “수정하기” 버튼 클릭 시: 변경된 셀만 POST /attendances로 전송
  const handleSave = useCallback(async () => {
    interface ChangedItem {
      studentId: number;
      date: string;
      status: Attendance;
    }
    const changedItems: ChangedItem[] = [];

    // 4-1) 변경된 셀 찾기
    for (const stu of studentList) {
      const sid = stu.id;
      for (const dateStr of weekdays) {
        const orig = originalData[sid]?.[dateStr] ?? "출석";
        const curr = attendanceData[sid]?.[dateStr] ?? "출석";
        if (orig !== curr) {
          changedItems.push({ studentId: sid, date: dateStr, status: curr });
        }
      }
    }

    if (changedItems.length === 0) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    // 4-2) POST /attendances 요청 보내기
    try {
      await Promise.all(
        changedItems.map(async ({ studentId, date, status }) => {
          const body = { studentId, date, status, note: "" };
          const res = await fetch(ENDPOINTS.createAttendance, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          if (!res.ok) {
            throw new Error(
              `POST attendance failed: ${res.status} for ${studentId}-${date}`
            );
          }
          await res.json(); // 필요하다면 응답 데이터를 사용
        })
      );

      // 4-3) 성공 시 originalData 동기화 & 버튼 비활성화
      setOriginalData(attendanceData);
      setHasChanges(false);
      alert("✅ 출결 정보가 성공적으로 저장되었습니다.");
    } catch (err) {
      console.error("failed to save attendance data:", err);
      alert("❌ 출결 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  }, [attendanceData, originalData, studentList]);

  // ─────────────────────────────────────────────────────────────
  // STEP 5. 화면에 보여줄 “검색 결과” 학생 목록
  const filteredStudents = studentList.filter((s) => s.name.includes(query));

  return (
    <Wrapper>
      {/* ─── 상단: 학년·반 드롭다운 + 수정 버튼 ─── */}
      <TopRectangle />
      <ClassArea>
        <ClassSelect
          $syllable={3}
          value={grade}
          onChange={(e) => onGradeChange(Number(e.target.value))}
        >
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </ClassSelect>

        <ClassSelect
          $syllable={2}
          value={classNum}
          onChange={(e) => onClassChange(Number(e.target.value))}
        >
          <option value="1">1반</option>
          <option value="2">2반</option>
          <option value="3">3반</option>
          <option value="4">4반</option>
          <option value="5">5반</option>
          <option value="6">6반</option>
        </ClassSelect>

        {/* ─── 수정하기 버튼 ─── */}
        <ModifyButton disabled={!hasChanges} onClick={handleSave}>
          수정하기
        </ModifyButton>
      </ClassArea>

      {/* ─── 검색 입력창 ─── */}
      <SearchArea>
        <input
          placeholder="이름으로 검색 + Enter"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </SearchArea>

      {/* ─── 출결 테이블 ─── */}
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
            {filteredStudents.map((student: StudentBrief, idx: number) => (
              <tr key={student.id}>
                <FixedCellNum>{idx + 1}</FixedCellNum>
                <FixedCellName>{student.name}</FixedCellName>

                {weekdays.map((dateStr) => {
                  // 원래 서버 데이터 혹은 마지막 저장된 상태
                  const origStatus: Attendance =
                    originalData[student.id]?.[dateStr] ?? "출석";
                  // 화면에 보여주는 현재 상태
                  const currStatus: Attendance =
                    attendanceData[student.id]?.[dateStr] ?? "출석";

                  // 항상 드롭다운을 보여주도록 유지
                  return (
                    <td key={`${student.id}-${dateStr}`}>
                      <AttendanceSelect
                        $status={currStatus}
                        value={currStatus}
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
                  );
                })}
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
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.25);
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
  position: relative; /* 수정 버튼 절대 배치용 */
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

const ModifyButton = styled.button`
  position: absolute;
  right: 1.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;

  background-color: ${(props: { disabled?: boolean }) =>
    props.disabled ? "#cccccc" : "#54b25c"};
  color: white;

  &:hover {
    background-color: ${(props: { disabled?: boolean }) =>
      props.disabled ? "#cccccc" : "#45a049"};
  }

  &:disabled {
    cursor: not-allowed;
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
  max-height: calc(100% - 128px); /* 헤더·풋터·검색영역 제외 */

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

// 드롭다운이 항상 뜨도록 수정: “평소에도 출결 상태를 드롭다운으로 선택할 수 있다”
const AttendanceSelect = styled.select<{ $status: Attendance }>`
  padding-left: 8px;
  font-weight: bold;
  border-radius: 0.65rem;
  width: 4rem;
  height: 1.75rem;
  font-size: 0.85rem;
  appearance: none; /* 기본 브라우저 화살표 숨기기 */
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 0.75rem;

  /* 드롭다운 모양(테두리/배경/화살표) */
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
