// components/AttendanceTable.tsx
import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useStudentsListApi, StudentBrief } from "../hooks/useStudentListApi";
import { ENDPOINTS } from "../constants/api";
import { useAuthStore } from "../hooks/useAuthStore"; // ← 추가
import SelectArrow from "../assets/icon/SelectArrow.png";

const dayKor = ["일", "월", "화", "수", "목", "금", "토"];

// 2025년 3~6월 평일 날짜(예시)
import { getWeekdays } from "../utils/getWeekdays";
const weekdays = getWeekdays(
  new Date("2025-03-01"),
  new Date("2025-06-30"),
  [] // 필요하면 공휴일 배열 추가
);

// “출석”, “지각”, “결석” 세 가지 상태 타입
type Attendance = "출석" | "지각" | "결석";

// 학생별, 날짜별 출결 상태를 저장하는 맵 타입
type AttendanceMap = {
  [studentId: number]: {
    [date: string]: Attendance;
  };
};

// 변경된 셀 한 건을 표현하는 타입 (note 필드 포함)
interface ChangedItem {
  studentId: number;
  studentName: string;
  date: string; // YYYY-MM-DD
  origStatus: Attendance;
  newStatus: Attendance;
  note: string;
}

interface AttendanceTableProps {
  onGradeChange: (g: number) => void;
  onClassChange: (c: number) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  onGradeChange,
  onClassChange,
}) => {
  // 1) 로그인한 교사의 학년/반 가져오기
  const teacherGrade = useAuthStore((state) => state.teacherGrade);
  const teacherClassroom = useAuthStore((state) => state.teacherClassroom);

  // 2) 로컬 상태로 학년/반 초기화
  const [grade, setGrade] = useState<number>(teacherGrade || 1);
  const [classNum, setClassNum] = useState<number>(teacherClassroom || 1);

  // 3) 해당 학년·반의 학생 목록 불러오기
  const { data: studentList = [] } = useStudentsListApi(grade, classNum);

  // 4) 검색어 상태
  const [query, setQuery] = useState<string>("");

  // 5) 출결 데이터 관리
  const [attendanceData, setAttendanceData] = useState<AttendanceMap>({});
  const [originalData, setOriginalData] = useState<AttendanceMap>({});

  // 6) 변경 감지 플래그
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // 7) 모달 표시 여부
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // 8) 변경된 항목들 목록
  const [changedItems, setChangedItems] = useState<ChangedItem[]>([]);

  // ─────────────────────────────────────────────────────────────
  // Step A. grade/classNum이 바뀔 때마다 부모 콜백 호출
  useEffect(() => {
    onGradeChange(grade);
  }, [grade, onGradeChange]);

  useEffect(() => {
    onClassChange(classNum);
  }, [classNum, onClassChange]);

  // ─────────────────────────────────────────────────────────────
  // Step B. 학생 목록이나 grade/classNum이 바뀌면, 출결 초기화 & 서버에서 데이터 불러오기
  useEffect(() => {
    // (1) 빈도 초기화 맵 생성
    const initialMap: AttendanceMap = {};
    studentList.forEach((stu: StudentBrief) => {
      initialMap[stu.id] = {};
      weekdays.forEach((dateStr: string) => {
        initialMap[stu.id][dateStr] = "출석";
      });
    });

    // (2) 서버에서 클래스 전체 출결정보 조회
    const fetchClassAttendance = async () => {
      const mergedMap: AttendanceMap = JSON.parse(JSON.stringify(initialMap));
      const startDate = weekdays[0];
      const endDate = weekdays[weekdays.length - 1];
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
          date: string;
          status: Attendance;
          note: string;
        }> = await res.json();

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

      setOriginalData(mergedMap);
      setAttendanceData(mergedMap);
    };

    fetchClassAttendance();
  }, [studentList, grade, classNum]);

  // ─────────────────────────────────────────────────────────────
  // Step C. attendanceData나 originalData가 바뀔 때 변경 감지
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
  // Step D. 셀 변경 핸들러
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
  // Step E. 초기화 버튼
  const handleReset = () => {
    setAttendanceData(JSON.parse(JSON.stringify(originalData)));
  };

  // ─────────────────────────────────────────────────────────────
  // Step F. 수정하기 버튼 → 변경된 항목 뽑아서 모달 열기
  const handleModifyClick = () => {
    const diffs: ChangedItem[] = [];

    studentList.forEach((stu: StudentBrief) => {
      const sid = stu.id;
      for (const dateStr of weekdays) {
        const orig = originalData[sid]?.[dateStr] ?? "출석";
        const curr = attendanceData[sid]?.[dateStr] ?? "출석";
        if (orig !== curr) {
          diffs.push({
            studentId: sid,
            studentName: stu.name,
            date: dateStr,
            origStatus: orig,
            newStatus: curr,
            note: "", // 빈 문자열로 초기화
          });
        }
      }
    });

    if (diffs.length === 0) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    setChangedItems(diffs);
    setShowConfirmModal(true);
  };

  // ─────────────────────────────────────────────────────────────
  // Step G. 모달 “확인” 클릭 → 서버에 POST
  const handleConfirm = useCallback(async () => {
    try {
      await Promise.all(
        changedItems.map(async (item) => {
          const body = {
            studentId: item.studentId,
            date: item.date,
            status: item.newStatus,
            note: item.note.trim(),
          };
          const res = await fetch(ENDPOINTS.createAttendance, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          if (!res.ok) {
            throw new Error(
              `❌ POST failed (${res.status}) for ${item.studentName} - ${item.date}`
            );
          }
          await res.json();
        })
      );
      setOriginalData(attendanceData);
      setHasChanges(false);
      setShowConfirmModal(false);
      alert("✅ 모든 출결 정보가 성공적으로 저장되었습니다.");
    } catch (err) {
      console.error("failed to save attendance data:", err);
      alert("❌ 출결 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  }, [attendanceData, changedItems]);

  // ─────────────────────────────────────────────────────────────
  // Step H. 이름 검색 필터링
  const filteredStudents = studentList.filter((s) =>
    s.name.includes(query.trim())
  );

  return (
    <Wrapper>
      <TopRectangle />

      {/* ─── 학년/반 드롭다운 + 초기화 · 수정 버튼 ─── */}
      <ClassArea>
        <ClassSelect
          $syllable={3}
          value={grade}
          onChange={(e) => setGrade(Number(e.target.value))}
        >
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </ClassSelect>

        <ClassSelect
          $syllable={2}
          value={classNum}
          onChange={(e) => setClassNum(Number(e.target.value))}
        >
          <option value="1">1반</option>
          <option value="2">2반</option>
          <option value="3">3반</option>
          <option value="4">4반</option>
          <option value="5">5반</option>
          <option value="6">6반</option>
        </ClassSelect>

        <ResetButton disabled={!hasChanges} onClick={handleReset}>
          초기화
        </ResetButton>
        <ModifyButton disabled={!hasChanges} onClick={handleModifyClick}>
          수정하기
        </ModifyButton>
      </ClassArea>

      {/* ─── 검색창 ─── */}
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
                  const origStatus: Attendance =
                    originalData[student.id]?.[dateStr] ?? "출석";
                  const currStatus: Attendance =
                    attendanceData[student.id]?.[dateStr] ?? "출석";

                  const isChanged = origStatus !== currStatus;

                  return (
                    <td key={`${student.id}-${dateStr}`}>
                      <AttendanceSelect
                        $status={currStatus}
                        $isChanged={isChanged}
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

      {/* ─── 변경사항 확인 모달 ─── */}
      {showConfirmModal && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>변경사항 확인</ModalTitle>
            <p>다음 변경사항대로 출결정보를 저장하시겠습니까?</p>
            <ModalTable>
              <thead>
                <tr>
                  <th>학생 이름</th>
                  <th>날짜</th>
                  <th>기존 상태</th>
                  <th>변경된 상태</th>
                  <th>사유 입력</th>
                </tr>
              </thead>
              <tbody>
                {changedItems.map((item, i) => (
                  <tr key={i}>
                    <td>{item.studentName}</td>
                    <td>{item.date}</td>
                    <td>{item.origStatus}</td>
                    <td>{item.newStatus}</td>
                    <td>
                      <RowNoteInput
                        value={item.note}
                        onChange={(e) => {
                          const updated = [...changedItems];
                          updated[i] = { ...updated[i], note: e.target.value };
                          setChangedItems(updated);
                        }}
                        placeholder="사유 작성"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </ModalTable>

            <ModalButtons>
              <ModalButtonCancel onClick={() => setShowConfirmModal(false)}>
                취소
              </ModalButtonCancel>
              <ModalButtonConfirm onClick={handleConfirm}>
                확인
              </ModalButtonConfirm>
            </ModalButtons>
          </ModalBox>
        </ModalOverlay>
      )}
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
  position: relative; /* 절대 위치된 버튼들을 위한 기준 */
`;

/* 학년/반 선택 */
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

/* ─── 초기화 버튼 ─── */
const ResetButton = styled.button`
  position: absolute;
  right: 8rem; /* 수정하기 버튼 왼쪽에 배치 */
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;

  background-color: ${(props: { disabled?: boolean }) =>
    props.disabled ? "#f0f0f0" : "#e0e0e0"};
  color: ${(props: { disabled?: boolean }) =>
    props.disabled ? "#aaa" : "#333"};

  &:hover:enabled {
    background-color: ${(props: { disabled?: boolean }) =>
      props.disabled ? "#f0f0f0" : "#4A4A4A"};
    color: white;
  }

  &:not(:hover) {
    transition:
      background-color 0.2s ease-in-out,
      color 0.2s ease-in-out;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

/* ─── 수정하기 버튼 ─── */
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

  &:hover:enabled {
    background-color: ${(props: { disabled?: boolean }) =>
      props.disabled ? "#cccccc" : "white"};

    color: #45a049;
    border: 1.5px solid #45a049;
  }

  &:not(:hover) {
    transition: // border는 바로 바뀌는 게 더 자연스러운 듯
      background-color 0.15s ease-in-out,
      color 0.15s ease-in-out;
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
  max-height: calc(100% - 128px);

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

// AttendanceSelect에 $isChanged prop까지 추가해서 “방금 바뀐 셀”을 구분한다
const AttendanceSelect = styled.select<{
  $status: Attendance;
  $isChanged: boolean;
}>`
  padding-left: 8px;
  font-weight: bold;
  border-radius: 0.65rem;
  width: 4rem;
  height: 1.75rem;
  font-size: 0.85rem;

  /* 기본 화살표 숨기기 */
  appearance: none;
  background-image: url(${SelectArrow});
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 0.75rem;

  /* ── 1) “방금 바뀐” 셀 */
  ${(props) =>
    props.$isChanged && props.$status === "지각"
      ? `
    border: 2px solid #FC8D4C;
    background-color: #FFF1E8;
    color: #FC8D4C;
  `
      : props.$isChanged && props.$status === "결석"
        ? `
    border: 2px solid #FF6969;
    background-color: #FFEAEA;
    color: #FF6969;
  `
        : /* ── 2) “원래 서버 데이터” 또는 그냥 출석 */ `
    border: 1.5px solid ${
      props.$status === "출석"
        ? "#b9b9b9"
        : props.$status === "지각"
          ? "#FC8D4C"
          : "#FF6969"
    };
    background-color: ${
      props.$status === "출석"
        ? "white"
        : props.$status === "지각"
          ? "#FC8D4C"
          : "#FF6969"
    };
    color: ${props.$status === "출석" ? "black" : "white"};
  `}

  &:focus {
    outline: none;
  }
`;

// ─────────────────────────────────────────────────────────────────
// 확인/취소 모달 (표에 “사유 입력” 칸까지 포함)
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  width: 650px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
`;

const ModalTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;

  th,
  td {
    border: 1px solid #ccc;
    padding: 0.5rem;
    text-align: center;
    font-size: 0.9rem;
  }

  th {
    background-color: #f5f5f5;
    font-weight: 600;
  }

  tbody tr:nth-child(even) {
    background: #fafafa;
  }
`;

const RowNoteInput = styled.input`
  width: 14.5rem;
  height: 1.5rem;
  font-size: 0.9rem;
  padding: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #54b25c;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const ModalButton = styled.button`
  width: 3.5rem;
  height: 2rem;
  padding: 0.4rem 0.8rem;
  margin-left: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
`;

const ModalButtonCancel = styled(ModalButton)`
  background-color: #ccc;
  color: #333;

  &:hover {
    background-color: #b3b3b3;
  }
`;

const ModalButtonConfirm = styled(ModalButton)`
  background-color: #54b25c;
  color: white;

  &:hover {
    background-color: #45a049;
  }
`;
