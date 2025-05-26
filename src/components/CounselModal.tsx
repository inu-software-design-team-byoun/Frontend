// components/CounselModal.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CrudButton } from "./CrudButton";
import { useCounselsApi } from "../hooks/useCounselsApi";

// 아이콘
import pencilIcon from "../assets/icon/pencilIcon.svg";
import deleteIcon from "../assets/icon/deleteIcon.svg";
import OpenBookIcon from "../assets/icon/OpenBookIcon.svg";

// 타입 정의
type Student = {
  id: number;
  studentNum: number;
  name: string;
  grade: number;
  classroom: number;
  phoneNum: string;
  birthday: string;
  userId: number | null;
  picture: string;
};

type Counsel = {
  id: number;
  student: Student;
  date: string;
  content: string;
};

export const CounselModal: React.FC<{ studentId: number }> = ({
  studentId,
}) => {
  const {
    counsels,
    student,
    loading,
    error,
    fetchCounsels,
    deleteCounsel,
    addCounsel,
    updateCounsel,
  } = useCounselsApi();

  const [isAdding, setIsAdding] = useState(false); // 등록 상태 관리
  const [editingCounselId, setEditingCounselId] = useState<number | null>(null); // 수정 상태 관리
  const [newCounsel, setNewCounsel] = useState({ date: "", content: "" });

  // 컴포넌트가 렌더링될 때 요청을 트리거
  useEffect(() => {
    fetchCounsels(studentId);
  }, [studentId]);
  // 여기서 , fetchCounsels 혹은 student를 넣으면 계속 요청이 무한재생됨

  const handleAddCounselStart = () => {
    setIsAdding(true);
    setNewCounsel({ date: "", content: "" });
  };

  const handleAddCounselCancel = () => {
    setIsAdding(false);
    setNewCounsel({ date: "", content: "" });
  };

  const handleAddCounselComplete = () => {
    if (!newCounsel.date || !newCounsel.content) {
      alert("날짜와 상담 내용을 입력하세요.");
      return;
    }
    addCounsel(studentId, newCounsel.date, newCounsel.content);
    setIsAdding(false); // 등록 완료 후 상태 초기화
    setNewCounsel({ date: "", content: "" });
  };

  const handleEditCounselStart = (counsel: Counsel) => {
    setEditingCounselId(counsel.id);
    setNewCounsel({
      date: counsel.date.slice(0, 10),
      content: counsel.content,
    });
  };

  const handleEditCounselCancel = () => {
    setEditingCounselId(null);
    setNewCounsel({ date: "", content: "" });
  };

  const handleEditCounselComplete = () => {
    if (!newCounsel.date || !newCounsel.content || editingCounselId === null) {
      alert("날짜와 상담 내용을 입력하세요.");
      return;
    }
    updateCounsel(
      editingCounselId,
      studentId,
      newCounsel.date,
      newCounsel.content
    );
    setEditingCounselId(null); // 수정 완료 후 상태 초기화
    setNewCounsel({ date: "", content: "" });
  };

  return (
    <Wrapper>
      <StudentInfoArea>
        {/* 학생 정보 표시 */}
        {loading ? (
          <div>로딩 중...</div>
        ) : error ? (
          <div>에러 발생: 데이터를 불러올 수 없습니다.</div>
        ) : student ? (
          <div>
            <PictureInput />
            <div>
              <p>
                {student.grade}학년 {student.classroom}반{" "}
                {student.studentNum % 100}번
              </p>
              <p>{student.name}</p>
              {/* <p>전화번호</p> */}
              {/* <p>{student.phoneNum}</p> */}
              {/* <p>{student.birthday}</p> */}
            </div>
            <button>
              학생부 바로가기 <img src={OpenBookIcon} />
            </button>
          </div>
        ) : (
          <div>학생 정보가 없습니다.</div>
        )}
      </StudentInfoArea>
      <RecordArea>
        <TitleArea>
          <span className="title">행동특성 누가기록</span>
          <span className="student">
            {student
              ? `- ${student.studentNum % 100}번 ${student.name} 학생 / Total ${counsels.length}`
              : ""}
          </span>
        </TitleArea>
        <TableArea>
          <ButtonArea>
            {isAdding ? (
              <>
                <CrudButton
                  $bgColor="#70C776"
                  onClick={handleAddCounselComplete}
                >
                  완료
                </CrudButton>
                <CrudButton $bgColor="#FF6969" onClick={handleAddCounselCancel}>
                  취소
                </CrudButton>
              </>
            ) : (
              <CrudButton $bgColor="#70C776" onClick={handleAddCounselStart}>
                등록
              </CrudButton>
            )}
          </ButtonArea>
          <TopRectangle />
          <RecordTable>
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "40%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>순번</th>
                <th>상담일자</th>
                <th>상담내역</th>
                <th>담당교사</th>
                <th>수정/삭제</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5}>로딩 중...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5}>에러 발생: 데이터를 불러올 수 없습니다.</td>
                </tr>
              ) : (
                <>
                  {counsels.map((counsel, idx) => (
                    <tr key={counsel.id}>
                      <td>{idx + 1}</td>
                      <td>
                        {editingCounselId === counsel.id ? (
                          <input
                            type="date"
                            value={newCounsel.date}
                            onChange={(e) =>
                              setNewCounsel({
                                ...newCounsel,
                                date: e.target.value,
                              })
                            }
                          />
                        ) : (
                          counsel.date?.slice(0, 10)
                        )}
                      </td>
                      <td>
                        {editingCounselId === counsel.id ? (
                          <input
                            type="text"
                            value={newCounsel.content}
                            onChange={(e) =>
                              setNewCounsel({
                                ...newCounsel,
                                content: e.target.value,
                              })
                            }
                            placeholder="상담 내용"
                          />
                        ) : (
                          counsel.content
                        )}
                      </td>
                      <td>{/* 담당교사 정보 없음 */}</td>
                      <td>
                        {editingCounselId === counsel.id ? (
                          <>
                            <CrudButton
                              $bgColor="#70C776"
                              onClick={handleEditCounselComplete}
                            >
                              완료
                            </CrudButton>
                            <CrudButton
                              $bgColor="#FF6969"
                              onClick={handleEditCounselCancel}
                            >
                              취소
                            </CrudButton>
                          </>
                        ) : (
                          <>
                            <div
                              style={{
                                display: "inline-block",
                                cursor: "pointer",
                              }}
                              onClick={() => handleEditCounselStart(counsel)}
                            >
                              <img src={pencilIcon} alt="수정" />
                            </div>
                            <div
                              style={{
                                display: "inline-block",
                                marginLeft: "0.5rem",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                window.confirm("정말 삭제하시겠습니까?") &&
                                deleteCounsel(counsel.id)
                              }
                            >
                              <img src={deleteIcon} alt="삭제" />
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {isAdding && (
                    <tr>
                      <td>New</td>
                      <td>
                        <input
                          type="date"
                          value={newCounsel.date}
                          onChange={(e) =>
                            setNewCounsel({
                              ...newCounsel,
                              date: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={newCounsel.content}
                          onChange={(e) =>
                            setNewCounsel({
                              ...newCounsel,
                              content: e.target.value,
                            })
                          }
                          placeholder="상담 내용"
                        />
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </RecordTable>
        </TableArea>
      </RecordArea>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 54.25rem;
  height: 89vh;

  display: flex;

  background-color: white;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.25);
  border-radius: 1rem;

  display: flex;
  justify-content: flex-start;
`;

const StudentInfoArea = styled.div`
  width: 12.5rem;
  height: 100%;
  padding: 0 1rem;

  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;

  background-color: #ff8e83;

  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  div {
    margin: 1.5rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
  }

  button {
    width: 8rem;
    height: 2rem;
    background-color: #feb3ac;
    /* border: 1.5px solid white; */
    border: none;
    border-radius: 0.5rem;

    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;

    font-weight: bold;
    color: white;

    cursor: pointer;

    &:hover {
      background-color: #ff8e83;
      border: 1.5px solid white;
      transition: background-color 0.3s ease;
    }

    img {
      width: 1rem;
      height: 1rem;
      margin-left: 0.5rem;
    }
  }

  p {
    font-size: 1rem;
    font-weight: bold;
    color: white;
    margin: 0.5rem 0;
    padding-left: 0.5rem;
  }
`;

const PictureInput = styled.img`
  width: 7.5rem;
  height: 10rem;
  /* border: 1px solid #b5b5b5; */

  background-color: white;

  color: black;
  font-size: 0.75rem;
`;

const RecordArea = styled.div`
  width: 100%;
  height: 89vh;

  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const TitleArea = styled.div`
  width: 100%;
  height: 3rem;

  margin-top: 2rem;
  margin-bottom: 0.5rem;

  display: flex;
  align-items: center;

  color: black;

  .title {
    margin: 0 1.25rem 0 2.5rem;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .student {
    height: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: end;

    color: gray;
    font-size: 1rem;
    font-weight: bold;
  }
`;

const ButtonArea = styled.div`
  width: 100%;
  height: 3rem;

  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const TableArea = styled.div`
  width: 624px;
`;

const TopRectangle = styled.div`
  width: 100%;
  height: 1.5rem;
  background: #feb3ac;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
`;

const RecordTable = styled.table`
  border: 1px solid #feb3ac;

  width: 100%;
  height: 35rem;

  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;

  thead {
    position: sticky;
    top: 0;
    z-index: 1;
    border-bottom: 1.5px solid #feb3ac;
  }

  tbody {
    border-spacing: 0;
    gap: 0;
  }

  th,
  td {
    text-align: center;
    font-size: 1rem;
    height: 2.5rem;
    border: 1px solid #ccc;
    border-collapse: collapse;
  }

  th {
    border: none;
  }

  td {
  }
`;
