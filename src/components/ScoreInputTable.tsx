import React, { useState, useMemo } from "react";
import styled from "styled-components";
import SelectArrow from "../assets/icon/SelectArrow.png";
import { useStudentsListApi } from "../hooks/useStudentListApi";
import { useScoreApi } from "../hooks/useScoreApi";
import { CrudButton } from "./CrudButton";
import { usePatchScoreApi } from "../hooks/usePatchScoreApi";

export const ScoreInputTable: React.FC = () => {
  // 학년, 반 선택값 상태 관리
  const [grade, setGrade] = useState(1);
  const [classNum, setClassNum] = useState(5);
  const [enabledSubject, setEnabledSubject] = useState("국어");

  // 수정 중 여부 조건부 렌더링을 위한 useState
  const [isEditing, setIsEditing] = useState(false);
  const [editScores, setEditScores] = useState<Record<number, string>>({});
  const { patchScore } = usePatchScoreApi();

  const handleEditStart = () => {
    // 원점수 초기값 세팅
    const initial: Record<number, string> = {};
    studentList.forEach((stu) => {
      const score = scoreMap.get(stu.id);
      initial[stu.id] =
        score?.korean !== null && score?.korean !== undefined
          ? String(score.korean)
          : "";
    });
    setEditScores(initial);
    setIsEditing(true);
  };

  // 클릭시 변경사항을 무시하고 취소
  const handleEditCancel = () => {
    setIsEditing(false);
    setEditScores({});
  };

  // 클릭 시 변경사항이 있는 지 확인하고 았으면 patch 요청 및 재렌더링
  const handleEditDone = async () => {
    // 변경된 값만 PATCH
    const promises = studentList.map(async (stu) => {
      const inputVal = editScores[stu.id];
      if (inputVal === undefined) return;
      const numVal = inputVal === "" ? null : Number(inputVal);
      const score = scoreMap.get(stu.id);
      // 기존 값과 다를 때만 patch
      if ((score?.korean ?? null) !== numVal && inputVal !== "") {
        await patchScore({
          studentId: stu.id,
          grade,
          subjectName: enabledSubject,
          value: Number(inputVal),
        });
      }
    });
    await Promise.all(promises);
    setIsEditing(false);
    setEditScores({});
    refetch();
  };

  // 학생 목록, 성적 데이터 불러오기
  const { data: studentList, refetch } = useStudentsListApi(grade, classNum);
  const { data: scoreData } = useScoreApi(grade, classNum);

  // 학생 id로 성적 매핑
  const scoreMap = useMemo(() => {
    const map = new Map<
      number,
      {
        korean: number | null;
        averageScore: number | null;
        rank: number | null;
        total: number | null;
        grade: string | null;
      }
    >();
    scoreData.forEach((s: any) => {
      map.set(s.id, {
        korean: s.korean ?? null,
        averageScore: s.averageScore ?? null,
        rank: s.rank ?? null,
        total: s.total ?? null,
        grade: s.grade ?? null,
      });
    });
    return map;
  }, [scoreData]);

  return (
    <Wrapper>
      <div>
        <TopRectangle />
        <TitleArea>
          <span className="title">성적 입력</span>
          <span className="subject">{enabledSubject}</span>
        </TitleArea>
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
          {/* 학기, 학년도는 일단 비활성화 */}
          <ClassSelect $syllable={6} disabled>
            <option>1학기 중간</option>
          </ClassSelect>
          <ClassSelect $syllable={8} disabled>
            <option>2024 학년도</option>
          </ClassSelect>
          <div>
            {!isEditing ? (
              <CrudButton $bgColor="#86ACFF" onClick={handleEditStart}>
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
                <th className="rawscore">원점수</th>
                <th>과목평균</th>
                <th>석차등급</th>
                <th>응시자수</th>
                <th>등급</th>
              </tr>
            </thead>
            <tbody>
              {studentList.map((stu, idx) => {
                const score = scoreMap.get(stu.id);
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
                            setEditScores((prev) => ({ ...prev, [stu.id]: v }));
                          }}
                          style={{ width: "4rem" }}
                        />
                      ) : (
                        (score?.korean ?? "-")
                      )}
                    </td>
                    <td>{score?.averageScore ?? "-"}</td>
                    <td>{score?.rank ?? "-"}</td>
                    <td>{score?.total ?? "-"}</td>
                    <td>{score?.grade ?? "-"}</td>
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
