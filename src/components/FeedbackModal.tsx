// components/FeedbackModal.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { useSelectedStudentStore } from "../stores/useSelectedStudentStore";
import { useFeedbackApi, ParsedFeedback } from "../hooks/useFeedbackApi";
import { useAuthStore } from "../hooks/useAuthStore";

import editIcon from "../assets/icon/editIcon.svg";
import deleteIcon from "../assets/icon/DeleteIcon.svg";
import saveIcon from "../assets/icon/saveIcon.svg";
import backIcon from "../assets/icon/backIcon.svg";

// 두 글자 문자열 “01”이 숫자 1에 해당하므로 매핑 테이블은 숫자 기준으로 둡니다.
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

export const FeedbackModal: React.FC<{ studentId: number }> = ({
  studentId,
}) => {
  const teacherSubject = useAuthStore((state) => state.subjectCode);
  const { selectedStudent } = useSelectedStudentStore();
  const {
    feedbacks,
    loading,
    error,
    createFeedback,
    updateFeedback,
    deleteFeedback,
  } = useFeedbackApi(studentId);

  // 4) 로컬 상태: 새로운 피드백
  const [newDate, setNewDate] = useState("");
  const [newSubject, setNewSubject] = useState<number>(teacherSubject); //교사 과목 고정
  const [newContent, setNewContent] = useState("");
  const [newRelease, setNewRelease] = useState(true);

  // 5) 수정 모드 관리
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editSubject, setEditSubject] = useState<number>(teacherSubject);
  const [editContent, setEditContent] = useState("");
  const [editRelease, setEditRelease] = useState(true);

  // 편집 모드 진입 (권한 검사)
  const handleStartEdit = (fb: ParsedFeedback) => {
    // fb.subject가 null 이거나, 교사 과목과 다르면 권한 없음
    if (fb.subject === null || fb.subject !== teacherSubject) return;
    // 편집용 상태 세팅 (editDate, editSubject, editContent, editRelease)
    setEditingId(fb.id);
    setEditDate(fb.date);
    setEditSubject(fb.subject);
    setEditContent(fb.content);
    setEditRelease(fb.release);
  };

  // 편집 취소
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditDate("");
    setEditSubject(teacherSubject);
    setEditContent("");
    setEditRelease(true);
  };

  // 수정 완료
  const handleCompleteEdit = async () => {
    if (
      editingId === null ||
      !editDate ||
      !editContent.trim() ||
      editSubject !== teacherSubject
    ) {
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

  // 새 피드백 생성 (교사 과목으로 고정)
  const handleCreate = async () => {
    if (!newDate || !newContent.trim()) {
      alert("날짜와 내용을 모두 입력해주세요.");
      return;
    }
    await createFeedback(newDate, teacherSubject, newContent, newRelease);
    setNewDate("");
    setNewSubject(teacherSubject);
    setNewContent("");
    setNewRelease(true);
  };

  return (
    <ModalContainer>
      <HeaderBar />
      <ContentWrapper>
        <Title>
          <span>{selectedStudent?.name || "학생"}</span> 학생의 피드백
        </Title>

        {/* ─────────────────────────────────────────────────────── */}
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
                      fb.date
                    )}
                  </td>
                  <td>
                    {/* subject가 null 이면 "-", 아니면 매핑 테이블에서 label 찾기 */}
                    {fb.subject === null
                      ? "-"
                      : SUBJECT_OPTIONS.find((s) => s.code === fb.subject)
                          ?.label || "-"}
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
                  {/* 교사의 과목이 맞아야 수정·삭제 버튼 노출 */}
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
                  {/* <td>
                    
                    {fb.subject !== null && fb.subject === teacherSubject ? (
                      editingId === fb.id ? (
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
                      )
                    ) : (
                      <span style={{ color: "#aaa", fontSize: 12 }}>
                        권한 없음
                      </span>
                    )}
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </FeedbackTable>

        {/* ─────────────────────────────────────────────────────── */}
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
            {/* 교사 과목으로 고정이므로 disabled */}
            <FormSelect value={teacherSubject} disabled>
              <option value={teacherSubject}>
                {SUBJECT_OPTIONS.find((s) => s.code === teacherSubject)
                  ?.label || "-"}
              </option>
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

// … 스타일 정의 부분 생략 …

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
