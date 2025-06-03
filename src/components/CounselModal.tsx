// components/CounselModal.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CrudButton } from "./CrudButton";
import { useCounselsApi, Counsel } from "../hooks/useCounselsApi";
import { useSelectedStudentStore } from "../stores/useSelectedStudentStore";
import { useAuthStore } from "../hooks/useAuthStore"; // 추가

// 아이콘
import editIcon from "../assets/icon/editIcon.svg";
import DeleteIcon from "../assets/icon/DeleteIcon.svg";
import OpenBookIcon from "../assets/icon/OpenBookIcon.svg";

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

  // 로그인한 교사 정보
  const role = useAuthStore((state) => state.role);
  const teacherGrade = useAuthStore((state) => state.teacherGrade);
  const teacherClassroom = useAuthStore((state) => state.teacherClassroom);

  // 이 학생의 담임교사인지 확인 (role이 teacher이고, 학년·반이 일치할 때만 true)
  const isHomeroomTeacher =
    role === "teacher" &&
    selectedStudent !== null &&
    teacherGrade === selectedStudent.grade &&
    teacherClassroom === selectedStudent.classroom;

  // const [isAdding, setIsAdding] = useState(false);
  // const [newCounsel, setNewCounsel] = useState({
  //   date: "",
  //   title: "",
  //   content: "",
  // });

  // 신규 등록용 모달 상태
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCounsel, setNewCounsel] = useState({
    date: "",
    title: "",
    content: "",
  });

  // Modal 관련 state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCounsel, setModalCounsel] = useState<{
    index: number;
    id: number;
    date: string;
    title: string;
    content: string;
    teacherName: string;
  } | null>(null);

  useEffect(() => {
    fetchCounsels(studentId);
  }, [studentId]);

  // const handleAddCounselStart = () => {
  //   setIsAdding(true);
  //   setNewCounsel({ date: "", title: "", content: "" });
  // };

  // const handleAddCounselCancel = () => {
  //   setIsAdding(false);
  //   setNewCounsel({ date: "", title: "", content: "" });
  // };

  // const handleAddCounselComplete = () => {
  //   if (!newCounsel.date || !newCounsel.title || !newCounsel.content) {
  //     alert("날짜, 제목, 내용을 입력하세요.");
  //     return;
  //   }
  //   addCounsel(
  //     studentId,
  //     newCounsel.date,
  //     newCounsel.title,
  //     newCounsel.content
  //   );
  //   setIsAdding(false);
  //   setNewCounsel({ date: "", title: "", content: "" });
  // };
  // 1- “신규 등록 모달 열기”
  const handleAddModalOpen = () => {
    setAddModalOpen(true);
    setNewCounsel({ date: "", title: "", content: "" });
  };

  // 2- “신규 등록 모달 닫기”
  const handleAddModalClose = () => {
    setAddModalOpen(false);
    setNewCounsel({ date: "", title: "", content: "" });
  };

  // 3- “신규 등록 모달 저장(등록)”
  const handleAddModalSave = () => {
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
    handleAddModalClose();
  };

  // ‘제목’ 클릭 시 모달 열기
  const handleModalOpen = (counsel: Counsel, idx: number) => {
    setModalCounsel({
      index: idx + 1,
      id: counsel.id,
      date: counsel.date.slice(0, 10),
      title: counsel.title,
      content: counsel.content,
      teacherName: counsel.teacherName,
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalCounsel(null);
  };

  // 모달 안 필드 변경
  const handleModalChange = (
    field: "date" | "title" | "content",
    value: string
  ) => {
    if (!modalCounsel) return;
    setModalCounsel({ ...modalCounsel, [field]: value });
  };

  // 모달 저장
  const handleModalSave = () => {
    if (
      !modalCounsel ||
      !modalCounsel.date ||
      !modalCounsel.title ||
      !modalCounsel.content
    ) {
      alert("날짜, 제목, 내용을 모두 입력하세요.");
      return;
    }
    updateCounsel(
      modalCounsel.id,
      studentId,
      modalCounsel.date,
      modalCounsel.title,
      modalCounsel.content
    );
    handleModalClose();
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
            <CrudButton $bgColor="#70C776" onClick={handleAddModalOpen}>
              등록
            </CrudButton>
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

                  <td>{counsel.date.slice(0, 10)}</td>

                  <td>
                    <TitleCell onClick={() => handleModalOpen(counsel, idx)}>
                      {counsel.title}
                    </TitleCell>
                  </td>

                  <td>{counsel.teacherName}</td>

                  <td className="crud">
                    <div
                      onClick={() => handleModalOpen(counsel, idx)}
                      style={{
                        display: "inline-block",
                        cursor: "pointer",
                        marginRight: "0.5rem",
                      }}
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
                      style={{ display: "inline-block", cursor: "pointer" }}
                    >
                      <img
                        src={DeleteIcon}
                        alt="삭제"
                        style={{ width: "15px" }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </RecordTable>
        </TableArea>
      </RecordArea>

      {modalOpen && modalCounsel && (
        <ModalOverlay onClick={handleModalClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>상담 상세보기</h3>
              <CloseButton onClick={handleModalClose}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <ModalRow>
                <Label>순번</Label>
                <Value>{modalCounsel.index}</Value>
              </ModalRow>
              <ModalRow>
                <Label>상담일자</Label>
                <input
                  type="date"
                  value={modalCounsel.date}
                  onChange={(e) => handleModalChange("date", e.target.value)}
                  disabled={!isHomeroomTeacher}
                />
              </ModalRow>
              <ModalRow>
                <Label>제목</Label>
                <input
                  type="text"
                  value={modalCounsel.title}
                  onChange={(e) => handleModalChange("title", e.target.value)}
                  disabled={!isHomeroomTeacher}
                />
              </ModalRow>
              <ModalRow>
                <Label>담당교사</Label>
                <Value>{modalCounsel.teacherName}</Value>
              </ModalRow>
              <ModalRowFull>
                <Label>내용</Label>
                <textarea
                  value={modalCounsel.content}
                  onChange={(e) => handleModalChange("content", e.target.value)}
                  rows={5}
                  disabled={!isHomeroomTeacher}
                />
              </ModalRowFull>
            </ModalBody>
            <ModalFooter>
              <SaveButton
                onClick={handleModalSave}
                disabled={!isHomeroomTeacher}
              >
                저장
              </SaveButton>
              <CancelButton onClick={handleModalClose}>취소</CancelButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
      {addModalOpen && (
        <ModalOverlay onClick={handleAddModalClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>신규 상담 등록</h3>
              <CloseButton onClick={handleAddModalClose}>×</CloseButton>
            </ModalHeader>

            <ModalBody>
              <ModalRow>
                <Label>상담일자</Label>
                <input
                  type="date"
                  value={newCounsel.date}
                  onChange={(e) =>
                    setNewCounsel({ ...newCounsel, date: e.target.value })
                  }
                />
              </ModalRow>

              <ModalRow>
                <Label>제목</Label>
                <input
                  type="text"
                  value={newCounsel.title}
                  onChange={(e) =>
                    setNewCounsel({ ...newCounsel, title: e.target.value })
                  }
                  placeholder="제목"
                />
              </ModalRow>

              <ModalRowFull>
                <Label>내용</Label>
                <textarea
                  rows={5}
                  value={newCounsel.content}
                  onChange={(e) =>
                    setNewCounsel({ ...newCounsel, content: e.target.value })
                  }
                  placeholder="내용"
                />
              </ModalRowFull>
            </ModalBody>

            <ModalFooter>
              <SaveButton onClick={handleAddModalSave}>저장</SaveButton>
              <CancelButton onClick={handleAddModalClose}>취소</CancelButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Wrapper>
  );
};

const TitleCell = styled.span`
  cursor: pointer;
  color: #0066cc;
  &:hover {
    text-decoration: underline;
  }
`;

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

// 모달 스타일
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  width: 28rem;
  background: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const ModalRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;

  input {
    margin-left: 0.5rem;
    flex: 1;
    padding: 0.25rem;
  }
`;

const ModalRowFull = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.75rem;

  textarea {
    margin-top: 0.5rem;
    resize: vertical;
    padding: 0.25rem;
  }
`;

const Label = styled.span`
  width: 4rem;
  font-weight: 500;
`;

const Value = styled.span`
  margin-left: 0.5rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const SaveButton = styled.button`
  background: #70c776;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  margin-right: 0.5rem;
  &:disabled {
    background: #ccc;
    cursor: default;
  }
`;

const CancelButton = styled.button`
  background: #ff6969;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
`;
