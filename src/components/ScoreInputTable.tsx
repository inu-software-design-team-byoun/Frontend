// src/components/ScoreInputTable.tsx
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import SelectArrow from "../assets/icon/SelectArrow.png";
import { useStudentsListApi, StudentBrief } from "../hooks/useStudentListApi";
import { useScoreApi, TransformedStudent } from "../hooks/useScoreApi";
import { CrudButton } from "./CrudButton";
import { usePatchScoreApi } from "../hooks/usePatchScoreApi";
import { useAuthStore } from "../hooks/useAuthStore";

export const ScoreInputTable: React.FC = () => {
  // 1) 학년/반/과목 선택 상태
  const [schoolGrade, setSchoolGrade] = useState(1);
  const [classroom, setClassroom] = useState(5);
  const [enabledSubject, setEnabledSubject] = useState("국어");

  // 2) 수정 모드 & 편집 중 입력값 (rawScore만 편집)
  const [isEditing, setIsEditing] = useState(false);
  const [editRawScores, setEditRawScores] = useState<Record<number, string>>(
    {}
  );
  const { patchScore } = usePatchScoreApi();

  // 3) 학생 목록, 성적 데이터 조회
  const { data: studentList, refetch } = useStudentsListApi(
    schoolGrade,
    classroom
  );
  const { data: scoreData } = useScoreApi(schoolGrade, classroom);

  // → 현재 로그인 교사의 subjectCode (기본값 1 = 국어)
  const subjectCode = useAuthStore((state) => state.subjectCode);

  // 4) 과목명 → rawScore용 키 / letterGrade용 키 매핑
  const subjectRawKeyMap: Record<string, keyof TransformedStudent> = {
    국어: "koreanRawScore",
    수학: "mathRawScore",
    영어: "englishRawScore",
    사회: "societyRawScore",
    과학: "scienceRawScore",
    미술: "artRawScore",
    음악: "musicRawScore",
    체육: "physicalRawScore",
  };
  const subjectLetterKeyMap: Record<string, keyof TransformedStudent> = {
    국어: "koreanLetterGrade",
    수학: "mathLetterGrade",
    영어: "englishLetterGrade",
    사회: "societyLetterGrade",
    과학: "scienceLetterGrade",
    미술: "artLetterGrade",
    음악: "musicLetterGrade",
    체육: "physicalLetterGrade",
  };

  // → 과목코드 → 과목명 매핑
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

  // 5) scoreData → Map<학생 id, TransformedStudent>
  const scoreMap = useMemo(() => {
    const map = new Map<number, TransformedStudent>();
    (scoreData || []).forEach((s) => map.set(s.id, s));
    return map;
  }, [scoreData]);

  // 6) 수정 시작 → editRawScores 초기값 세팅
  const handleEditStart = () => {
    const initial: Record<number, string> = {};
    const rawKey = subjectRawKeyMap[enabledSubject];

    studentList.forEach((stu: StudentBrief) => {
      const stuScore = scoreMap.get(stu.id);
      const rawVal = stuScore ? stuScore[rawKey] : null;
      initial[stu.id] =
        rawVal !== null && rawVal !== undefined ? String(rawVal) : "";
    });

    setEditRawScores(initial);
    setIsEditing(true);
  };

  // 7) 수정 취소
  const handleEditCancel = () => {
    setIsEditing(false);
    setEditRawScores({});
  };

  // 8) 수정 완료 → 변경된 rawScore만 PATCH
  const handleEditDone = async () => {
    const rawKey = subjectRawKeyMap[enabledSubject];

    const promises = studentList.map(async (stu: StudentBrief) => {
      const inputVal = editRawScores[stu.id];
      if (inputVal === undefined) return;

      // 빈 문자열이면 null, 아니면 숫자
      const numVal = inputVal === "" ? null : Number(inputVal);
      const stuScore = scoreMap.get(stu.id);
      const prevRaw = stuScore ? (stuScore[rawKey] ?? null) : null;

      // 변경된 값이 있을 때에만 PATCH 호출
      if (prevRaw !== numVal) {
        await patchScore({
          studentId: stu.id,
          grade: schoolGrade,
          subjectName: enabledSubject,
          value: numVal === null ? 0 : numVal,
          // (null 그대로 보내려면 usePatchScoreApi 내부 수정 필요)
        });
      }
    });

    await Promise.all(promises);
    setIsEditing(false);
    setEditRawScores({});
    refetch();
  };

  // 현재 교사가 수정 가능한 과목명
  const teacherSubjectName = codeToSubjectName[subjectCode] || "";
  // 수정 버튼 활성화 여부
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
            value={schoolGrade}
            onChange={(e) => setSchoolGrade(Number(e.target.value))}
          >
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
          </ClassSelect>

          {/* 반 */}
          <ClassSelect
            $syllable={2}
            value={classroom}
            onChange={(e) => setClassroom(Number(e.target.value))}
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
                const stuScore = scoreMap.get(stu.id);
                const rawKey = subjectRawKeyMap[enabledSubject];
                const letterKey = subjectLetterKeyMap[enabledSubject];

                return (
                  <tr key={stu.id}>
                    <td>{String(stu.studentNum % 100)}</td>
                    <td>{stu.name}</td>

                    {/* 원점수 */}
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editRawScores[stu.id] ?? ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            setEditRawScores((prev) => ({
                              ...prev,
                              [stu.id]: v,
                            }));
                          }}
                          style={{ width: "4rem" }}
                        />
                      ) : stuScore ? (
                        stuScore[rawKey] != null ? (
                          stuScore[rawKey]
                        ) : (
                          "-"
                        )
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* 과목평균(숫자), 석차등급(숫자), 응시자수(숫자) */}
                    {/* <td>{stuScore?.averageScore ?? "-"}</td> */}
                    {/* 총 평균이 나와야할 듯 */}
                    <td>88</td>
                    <td>{stuScore?.rank ?? "-"}</td>
                    <td>{stuScore?.total ?? "-"}</td>

                    {/* 과목별 문자 등급(letterGrade) */}
                    <td>
                      {stuScore
                        ? stuScore[letterKey] != null
                          ? stuScore[letterKey]
                          : "-"
                        : "-"}
                    </td>
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
