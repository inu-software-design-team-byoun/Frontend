// ScoreInputTable.tsx
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import SelectArrow from "../assets/icon/SelectArrow.png";
import { useStudentsListApi, StudentBrief } from "../hooks/useStudentListApi";
import { useScoreApi, TransformedStudent } from "../hooks/useScoreApi";
import { CrudButton } from "./CrudButton";
import { usePatchScoreApi } from "../hooks/usePatchScoreApi";

// → 추가: 방금 수정한 useAuthStore에서 subjectCode를 가져옴
import { useAuthStore } from "../hooks/useAuthStore";

export const ScoreInputTable: React.FC = () => {
  // 1) 학년/반/과목 선택 상태
  const [grade, setGrade] = useState(1);
  const [classNum, setClassNum] = useState(5);
  const [enabledSubject, setEnabledSubject] = useState("국어");

  // 2) 수정 모드 & 편집 중 입력값
  const [isEditing, setIsEditing] = useState(false);
  const [editScores, setEditScores] = useState<Record<number, string>>({});
  const { patchScore } = usePatchScoreApi();

  // 3) 학생 목록, 성적 데이터 조회
  const { data: studentList, refetch } = useStudentsListApi(grade, classNum);
  const { data: scoreData } = useScoreApi(grade, classNum);

  // →  추가된 부분: 현재 로그인 교사의 subjectCode (기본값 1 = 국어)
  const subjectCode = useAuthStore((state) => state.subjectCode);

  // 4) 과목명 → 객체 속성 키 매핑
  const subjectKeyMap: Record<string, keyof TransformedStudent> = {
    국어: "korean",
    수학: "math",
    영어: "english",
    사회: "society",
    과학: "science",
    미술: "art",
    음악: "music",
    체육: "physical",
  };

  // → 추가된 부분: 과목코드 → 과목명 매핑
  //    subjectCode가 1일 때 교사 과목명은 "국어"가 됨
  const codeToSubjectName: Record<number, string> = {
    1: "국어",
    2: "수학",
    3: "영어",
    4: "사회",
    5: "과학",
    6: "미술",
    7: "음악",
    8: "체육",
  };

  // 5) scoreData → Map으로 변환 (Map<학생 id, TransformedStudent>)
  const scoreMap = useMemo(() => {
    const map = new Map<number, TransformedStudent>();
    (scoreData || []).forEach((s: TransformedStudent) => {
      map.set(s.id, s);
    });
    return map;
  }, [scoreData]);

  // 6) 수정 시작 → editScores 초기값 세팅
  const handleEditStart = () => {
    const initial: Record<number, string> = {};
    const subjectKey = subjectKeyMap[enabledSubject];
    studentList.forEach((stu: StudentBrief) => {
      const score = scoreMap.get(stu.id);
      const raw = score ? score[subjectKey] : null;
      initial[stu.id] = raw !== null && raw !== undefined ? String(raw) : "";
    });
    setEditScores(initial);
    setIsEditing(true);
  };

  // 7) 수정 취소 → editScores 초기화
  const handleEditCancel = () => {
    setIsEditing(false);
    setEditScores({});
  };

  // 8) 수정 완료 → 변경된 항목만 PATCH
  const handleEditDone = async () => {
    const subjectKey = subjectKeyMap[enabledSubject];

    const promises = studentList.map(async (stu: StudentBrief) => {
      const inputVal = editScores[stu.id];
      if (inputVal === undefined) return;

      // 빈 문자열이면 null 처리, 아니면 숫자
      const numVal = inputVal === "" ? null : Number(inputVal);
      const score = scoreMap.get(stu.id);
      const prevRaw = score ? (score[subjectKey] ?? null) : null;

      // 변경 사항이 있을 때만 패치
      if (prevRaw !== numVal) {
        await patchScore({
          studentId: stu.id,
          grade,
          subjectName: enabledSubject,
          value: numVal === null ? 0 : numVal,
          // ※ null 처리하고 싶으면 usePatchScoreApi 내부 수정 필요
        });
      }
    });

    await Promise.all(promises);
    setIsEditing(false);
    setEditScores({});
    refetch(); // 최신 데이터 다시 가져오기
  };

  // 현재 교사가 수정 가능한 과목명
  const teacherSubjectName = codeToSubjectName[subjectCode] || "";

  // 수정 버튼 활성화 여부 (선택된 과목이 교사 과목과 같아야 true)
  const canEditThisSubject = enabledSubject === teacherSubjectName;

  return (
    <Wrapper>
      <div>
        <TopRectangle />
        <TitleArea>
          <span className="title">성적 입력</span>
          <span className="subject">{enabledSubject}</span>
        </TitleArea>

        <ClassArea>
          {/* 학년 */}
          <ClassSelect
            $syllable={3}
            value={grade}
            onChange={(e) => setGrade(Number(e.target.value))}
          >
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
          </ClassSelect>

          {/* 반 */}
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

          {/* 과목 선택 */}
          <ClassSelect
            $syllable={3}
            value={enabledSubject}
            onChange={(e) => setEnabledSubject(e.target.value)}
          >
            <option value="국어">국어</option>
            <option value="수학">수학</option>
            <option value="영어">영어</option>
            <option value="사회">사회</option>
            <option value="과학">과학</option>
            <option value="미술">미술</option>
            <option value="음악">음악</option>
            <option value="체육">체육</option>
          </ClassSelect>

          {/* 학기/학년도 (비활성) */}
          <ClassSelect $syllable={6} disabled>
            <option>1학기 중간</option>
          </ClassSelect>
          <ClassSelect $syllable={8} disabled>
            <option>2024 학년도</option>
          </ClassSelect>

          <div>
            {/* 
              → 수정 버튼을 누를 수 있는 경우: 
              1) 현재 isEditing이 false이고 
              2) 현재 선택한 enabledSubject가 교사 과목(teacherSubjectName)과 같을 때만 활성화 
            */}
            {!isEditing ? (
              <CrudButton
                $bgColor="#86ACFF"
                onClick={handleEditStart}
                disabled={!canEditThisSubject}
              >
                수정
              </CrudButton>
            ) : (
              <>
                <CrudButton $bgColor="gray" onClick={handleEditCancel}>
                  취소
                </CrudButton>
                <CrudButton $bgColor="#70C776" onClick={handleEditDone}>
                  완료
                </CrudButton>
              </>
            )}
          </div>
        </ClassArea>

        <ScrollArea>
          <MainArea>
            <colgroup>
              <col style={{ width: "8%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "12%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>번호</th>
                <th>이름</th>
                <th className="rawscore">{enabledSubject} 원점수</th>
                <th>과목평균</th>
                <th>석차등급</th>
                <th>응시자수</th>
                <th>등급</th>
              </tr>
            </thead>
            <tbody>
              {(studentList || []).map((stu) => {
                const score = scoreMap.get(stu.id);
                const subjectKey = subjectKeyMap[enabledSubject];

                return (
                  <tr key={stu.id}>
                    <td>{String(stu.studentNum % 100)}</td>
                    <td>{stu.name}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editScores[stu.id] ?? ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            setEditScores((prev) => ({
                              ...prev,
                              [stu.id]: v,
                            }));
                          }}
                          style={{ width: "4rem" }}
                        />
                      ) : score ? (
                        score[subjectKey] != null ? (
                          score[subjectKey]
                        ) : (
                          "-"
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{score?.averageScore ?? "-"}</td>
                    <td>{score?.rank ?? "-"}</td>
                    <td>{score?.total ?? "-"}</td>
                    <td>{score?.gradeText ?? "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </MainArea>
        </ScrollArea>
      </div>
      <BottomRectangle />
    </Wrapper>
  );
};

// (이하 styled-components 부분은 이전과 동일)

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

  div {
    display: flex;
    align-items: center;
    margin-left: auto;
    margin-right: 1.75rem;
    /* align-self: flex-end; // 안되네*/
  }
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

  .rawscore {
    color: #00990d;
  }
`;
