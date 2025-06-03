// components/FeedbackModal.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { useSelectedStudentStore } from "../stores/useSelectedStudentStore";
import { useFeedbackApi, Feedback } from "../hooks/useFeedbackApi";

// icons
import saveIcon from "../assets/icon/saveIcon.svg";
import backIcon from "../assets/icon/backIcon.svg";
import editIcon from "../assets/icon/editIcon.svg";
import deleteIcon from "../assets/icon/DeleteIcon.svg";

// 과목 코드 ↔ 과목명 매핑
const SUBJECT_OPTIONS: { code: number; label: string }[] = [
  { code: 1, label: "국어" },
  { code: 2, label: "수학" },
  { code: 3, label: "영어" },
  { code: 4, label: "사회" },
  { code: 5, label: "과학" },
  { code: 6, label: "미술" },
  { code: 7, label: "음악" },
  { code: 8, label: "체육" },
];

// Props에는 studentId만 받고, 학생 이름은 store에서 꺼냅니다
export const FeedbackModal: React.FC<{ studentId: number }> = ({
  studentId,
}) => {
  // 전역 상태에서 학생 정보 가져오기 (이름, 학년·반 등)
  const { selectedStudent } = useSelectedStudentStore();

  // useFeedbacksApi 훅으로 모든 CRUD 함수와 상태(loading, error, feedbacks) 가져오기
  const {
    feedbacks,
    loading,
    error,
    createFeedback,
    updateFeedback,
    deleteFeedback,
  } = useFeedbackApi(studentId);

  // 로컬 상태: 새로운 피드백 작성용
  const [newDate, setNewDate] = useState("");
  const [newSubject, setNewSubject] = useState(1);
  const [newContent, setNewContent] = useState("");
  const [newRelease, setNewRelease] = useState(true);

  // 수정 모드 관리
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editSubject, setEditSubject] = useState(1);
  const [editContent, setEditContent] = useState("");
  const [editRelease, setEditRelease] = useState(true);

  // 새로운 피드백 등록
  const handleCreate = async () => {
    if (!newDate || !newContent.trim()) {
      alert("날짜와 내용을 모두 입력해주세요.");
      return;
    }
    await createFeedback(newDate, newSubject, newContent, newRelease);
    // 등록 후 초기화
    setNewDate("");
    setNewSubject(1);
    setNewContent("");
    setNewRelease(true);
  };

  // 특정 feedback을 수정하기 위해 입력 폼에 기존 데이터를 세팅
  const handleStartEdit = (fb: Feedback) => {
    setEditingId(fb.id);
    setEditDate(fb.date.slice(0, 10));
    setEditSubject(fb.subject);
    setEditContent(fb.content);
    setEditRelease(fb.release);
  };

  // 편집 모드 취소
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditDate("");
    setEditSubject(1);
    setEditContent("");
    setEditRelease(true);
  };

  // 편집 완료 → API 호출
  const handleCompleteEdit = async () => {
    if (editingId === null || !editDate || !editContent.trim()) {
      alert("날짜와 내용을 모두 입력해주세요.");
      return;
    }
    await updateFeedback(
      editingId,
      editDate,
      editSubject,
      editContent,
      editRelease
    );
    handleCancelEdit();
  };

  return (
    <ModalContainer>
      <HeaderBar />
      <ContentWrapper>
        {/* 상단: 학생 이름 / 학년·반 표시 */}
        <Title>
          <span>{selectedStudent?.name || "학생"}</span> 학생의 피드백
        </Title>

        {/* 1) 기존 피드백 목록 */}
        <SectionTitle>피드백 목록</SectionTitle>
        <FeedbackTable>
          <thead>
            <tr>
              <th>날짜</th>
              <th>과목</th>
              <th>내용</th>
              <th>공개 여부</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  로딩 중…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  피드백을 불러오는 중 오류 발생
                </td>
              </tr>
            ) : feedbacks.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  등록된 피드백이 없습니다.
                </td>
              </tr>
            ) : (
              // feedbacks.map((fb, idx) => (
              feedbacks.map((fb) => (
                <tr key={fb.id}>
                  <td>
                    {editingId === fb.id ? (
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        style={{ width: 120 }}
                      />
                    ) : (
                      fb.date.slice(0, 10)
                    )}
                  </td>
                  <td>
                    {editingId === fb.id ? (
                      <select
                        value={editSubject}
                        onChange={(e) => setEditSubject(Number(e.target.value))}
                      >
                        {SUBJECT_OPTIONS.map((opt) => (
                          <option key={opt.code} value={opt.code}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      SUBJECT_OPTIONS.find((s) => s.code === fb.subject)
                        ?.label || "-"
                    )}
                  </td>
                  <td>
                    {editingId === fb.id ? (
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="내용"
                        style={{ width: 200 }}
                      />
                    ) : (
                      fb.content
                    )}
                  </td>
                  <td>
                    {editingId === fb.id ? (
                      <input
                        type="checkbox"
                        checked={editRelease}
                        onChange={(e) => setEditRelease(e.target.checked)}
                      />
                    ) : fb.release ? (
                      "공개"
                    ) : (
                      "비공개"
                    )}
                  </td>
                  <td>
                    {editingId === fb.id ? (
                      <>
                        <img
                          src={saveIcon}
                          alt="저장"
                          style={{ cursor: "pointer", width: 16 }}
                          onClick={handleCompleteEdit}
                        />
                        <img
                          src={backIcon}
                          alt="취소"
                          style={{
                            cursor: "pointer",
                            width: 16,
                            marginLeft: 8,
                          }}
                          onClick={handleCancelEdit}
                        />
                      </>
                    ) : (
                      <>
                        <img
                          src={editIcon}
                          alt="수정"
                          style={{ cursor: "pointer", width: 16 }}
                          onClick={() => handleStartEdit(fb)}
                        />
                        <img
                          src={deleteIcon}
                          alt="삭제"
                          style={{
                            cursor: "pointer",
                            width: 16,
                            marginLeft: 8,
                          }}
                          onClick={() =>
                            window.confirm("정말 삭제하시겠습니까?") &&
                            deleteFeedback(fb.id)
                          }
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </FeedbackTable>

        {/* 2) 새로운 피드백 등록 폼 */}
        <SectionTitle>새 피드백 등록</SectionTitle>
        <FormContainer>
          <FormRow>
            <FormLabel>날짜</FormLabel>
            <FormInput
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </FormRow>
          <FormRow>
            <FormLabel>과목</FormLabel>
            <FormSelect
              value={newSubject}
              onChange={(e) => setNewSubject(Number(e.target.value))}
            >
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label}
                </option>
              ))}
            </FormSelect>
          </FormRow>
          <FormRow>
            <FormLabel>내용</FormLabel>
            <FormTextarea
              rows={3}
              placeholder="피드백 내용을 입력하세요"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </FormRow>
          <FormRow>
            <FormLabel>공개 여부</FormLabel>
            <CheckboxContainer>
              <input
                type="checkbox"
                checked={newRelease}
                onChange={(e) => setNewRelease(e.target.checked)}
                id="releaseCheckbox"
              />
              <label htmlFor="releaseCheckbox" style={{ marginLeft: 8 }}>
                공개
              </label>
            </CheckboxContainer>
          </FormRow>
          <div className="submit">
            <SubmitButton onClick={handleCreate} disabled={loading}>
              {loading ? "등록 중…" : "피드백 등록"}
            </SubmitButton>
          </div>
        </FormContainer>
      </ContentWrapper>
    </ModalContainer>
  );
};

/** 스타일 정의 (CounselModal과 거의 동일) **/
const ModalContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  width: 54.25rem;
  height: 89vh;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const HeaderBar = styled.div`
  background: #9e8dff;
  height: 24px;
  border-radius: 16px 16px 0 0;
  width: 100%;
  flex-shrink: 0;
`;

const ContentWrapper = styled.div`
  padding: 16px 48px 40px 48px;
  overflow-y: auto;
  flex: 1;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  margin: 24px 0 16px 0;
  color: #000;

  span {
    font-weight: 800;
  }
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 800;
  font-family: "Inter", sans-serif;
  margin: 32px 0 8px 0;
  color: #000;
`;

const FeedbackTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;

  thead {
    background: #f0f0f0;
  }

  th,
  td {
    padding: 12px;
    border: 1px solid #ddd;
    font-size: 14px;
    color: #333;
    text-align: center;
  }

  th {
    font-weight: 700;
  }

  tbody tr:nth-child(even) {
    background: #fafafa;
  }
`;

// const ErrorText = styled.div`
//   color: red;
//   font-size: 14px;
//   margin-top: 12px;
// `;

const FormContainer = styled.div`
  background: #fff;
  border: 1px solid #b5b5b5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 40px;

  .submit {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const FormLabel = styled.label`
  width: 80px;
  font-size: 14px;
  font-weight: 700;
  color: #555;
`;

const FormInput = styled.input`
  flex: 1;
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 16px;
`;

const FormSelect = styled.select`
  flex: 1;
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 16px;
`;

const FormTextarea = styled.textarea`
  flex: 1;
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 16px;
  resize: vertical;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
`;

const SubmitButton = styled.button`
  background: #16a1a9;
  color: #fff;
  font-weight: 700;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  margin-top: 8px;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;
