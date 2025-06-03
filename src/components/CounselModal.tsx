// components/CounselModal.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CrudButton } from "./CrudButton";
import { useCounselsApi, Counsel } from "../hooks/useCounselsApi";
import { useSelectedStudentStore } from "../stores/useSelectedStudentStore";

// 아이콘
import editIcon from "../assets/icon/editIcon.svg";
import DeleteIcon from "../assets/icon/DeleteIcon.svg";
import OpenBookIcon from "../assets/icon/OpenBookIcon.svg";
import saveIcon from "../assets/icon/saveIcon.svg";
import backIcon from "../assets/icon/backIcon.svg";

export const CounselModal: React.FC<{ studentId: number }> = ({
  studentId,
}) => {
  const {
    counsels,
    loading,
    error,
    fetchCounsels,
    deleteCounsel,
    addCounsel,
    updateCounsel,
  } = useCounselsApi();

  const { selectedStudent } = useSelectedStudentStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingCounselId, setEditingCounselId] = useState<number | null>(null);
  const [newCounsel, setNewCounsel] = useState({
    date: "",
    title: "",
    content: "",
  });

  useEffect(() => {
    fetchCounsels(studentId);
  }, [studentId]);

  const handleAddCounselStart = () => {
    setIsAdding(true);
    setNewCounsel({ date: "", title: "", content: "" });
  };

  const handleAddCounselCancel = () => {
    setIsAdding(false);
    setNewCounsel({ date: "", title: "", content: "" });
  };

  const handleAddCounselComplete = () => {
    if (!newCounsel.date || !newCounsel.title || !newCounsel.content) {
      alert("날짜, 제목, 내용을 입력하세요.");
      return;
    }
    addCounsel(
      studentId,
      newCounsel.date,
      newCounsel.title,
      newCounsel.content
    );
    setIsAdding(false);
    setNewCounsel({ date: "", title: "", content: "" });
  };

  const handleEditCounselStart = (counsel: Counsel) => {
    setEditingCounselId(counsel.id);
    setNewCounsel({
      date: counsel.date.slice(0, 10),
      title: counsel.title,
      content: counsel.content,
    });
  };

  const handleEditCounselCancel = () => {
    setEditingCounselId(null);
    setNewCounsel({ date: "", title: "", content: "" });
  };

  const handleEditCounselComplete = () => {
    if (
      !newCounsel.date ||
      !newCounsel.title ||
      !newCounsel.content ||
      editingCounselId === null
    ) {
      alert("날짜, 제목, 내용을 입력하세요.");
      return;
    }
    updateCounsel(
      editingCounselId,
      studentId,
      newCounsel.date,
      newCounsel.title,
      newCounsel.content
    );
    setEditingCounselId(null);
    setNewCounsel({ date: "", title: "", content: "" });
  };

  return (
    <Wrapper>
      <StudentInfoArea>
        {loading ? (
          <div>로딩 중...</div>
        ) : error ? (
          <div>에러 발생: 데이터를 불러올 수 없습니다.</div>
        ) : selectedStudent ? (
          <div>
            <PictureInput />
            <div>
              <p>
                {selectedStudent.grade}학년 {selectedStudent.classroom}반
              </p>
              <p>{selectedStudent.name}</p>
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
            {selectedStudent
              ? `- ${selectedStudent.name} 학생 / Total ${counsels.length}`
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
              <col style={{ width: "10rem" }} />
              <col style={{ width: "13rem" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "3.5rem" }} />
            </colgroup>

            <thead>
              <tr>
                <th>순번</th>
                <th>상담일자</th>
                <th>제목</th>
                <th>담당교사</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {counsels.map((counsel, idx) => (
                <tr key={counsel.id}>
                  <td>{idx + 1}</td>

                  <td>
                    {editingCounselId === counsel.id ? (
                      <input
                        type="date"
                        value={newCounsel.date}
                        onChange={(e) =>
                          setNewCounsel({ ...newCounsel, date: e.target.value })
                        }
                      />
                    ) : (
                      counsel.date.slice(0, 10)
                    )}
                  </td>

                  <td>
                    {editingCounselId === counsel.id ? (
                      <input
                        type="text"
                        value={newCounsel.title}
                        onChange={(e) =>
                          setNewCounsel({
                            ...newCounsel,
                            title: e.target.value,
                          })
                        }
                        placeholder="제목"
                      />
                    ) : (
                      counsel.title
                    )}
                  </td>

                  <td>
                    {editingCounselId === counsel.id ? (
                      <textarea
                        value={newCounsel.content}
                        onChange={(e) =>
                          setNewCounsel({
                            ...newCounsel,
                            content: e.target.value,
                          })
                        }
                        placeholder="내용"
                        style={{ width: "100%" }}
                      />
                    ) : (
                      counsel.content
                    )}
                  </td>

                  <td>{counsel.teacherName}</td>

                  <td className="crud">
                    {editingCounselId === counsel.id ? (
                      <>
                        <div
                          onClick={handleEditCounselComplete}
                          style={{ display: "inline-block", cursor: "pointer" }}
                        >
                          <img
                            src={saveIcon}
                            alt="저장"
                            style={{ width: "16px" }}
                          />
                        </div>
                        <div
                          onClick={handleEditCounselCancel}
                          style={{
                            display: "inline-block",
                            cursor: "pointer",
                            marginLeft: "0.5rem",
                          }}
                        >
                          <img
                            src={backIcon}
                            alt="취소"
                            style={{ width: "16px" }}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          onClick={() => handleEditCounselStart(counsel)}
                          style={{ display: "inline-block", cursor: "pointer" }}
                        >
                          <img
                            src={editIcon}
                            alt="수정"
                            style={{ width: "16px" }}
                          />
                        </div>
                        <div
                          onClick={() =>
                            window.confirm("정말 삭제하시겠습니까?") &&
                            deleteCounsel(counsel.id)
                          }
                          style={{
                            display: "inline-block",
                            marginLeft: "0.5rem",
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={DeleteIcon}
                            alt="삭제"
                            style={{ width: "15px" }}
                          />
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
                      style={{ width: "136px" }}
                      type="date"
                      value={newCounsel.date}
                      onChange={(e) =>
                        setNewCounsel({ ...newCounsel, date: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={newCounsel.title}
                      onChange={(e) =>
                        setNewCounsel({ ...newCounsel, title: e.target.value })
                      }
                      placeholder="제목"
                    />
                  </td>
                  <td>
                    <textarea
                      value={newCounsel.content}
                      onChange={(e) =>
                        setNewCounsel({
                          ...newCounsel,
                          content: e.target.value,
                        })
                      }
                      placeholder="내용"
                      style={{ width: "100%" }}
                    />
                  </td>
                  <td>{/* 담당교사 입력필요 시 상태 추가 */}</td>
                  <td></td>
                </tr>
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
  }

  button {
    width: 9rem;
    height: 2rem;
    background-color: #e96a5e;
    border: none;
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    color: white;
    cursor: pointer;

    &:hover {
      background-color: #ff796c;
      border: 1.5px solid white;
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
  border-collapse: collapse;

  thead {
    position: sticky;
    top: 0;
    z-index: 1;
    border-bottom: 1.5px solid #feb3ac;
  }

  tbody {
    border-bottom-left-radius: 1rem;
  }

  th,
  td {
    text-align: center;
    font-size: 1rem;
    height: 2.5rem;
    border: 1px solid #ccc;
  }

  th {
    border: none;
  }
`;
