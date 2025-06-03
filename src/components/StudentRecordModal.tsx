// src/components/StudentRecordModal.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ENDPOINTS } from "../constants/api";
import { useAuthStore } from "../hooks/useAuthStore";

export interface StudentInfo {
  grade: string;
  class: string;
  number: string;
  teacher: string;
  summary: string;
}

// 피드백 한 건을 나타내는 타입 정의
interface Feedback {
  id: number;
  studentId: number;
  date: string; // YYYY-MM-DD
  subject: string; // "01", "02", ...
  content: string;
  release: boolean;
}

// onClose 함수 타입, studentId를 추가
interface ModalProps {
  onClose: () => void;
  studentId: number;
}

export const StudentRecordModal: React.FC<ModalProps> = ({
  onClose,
  studentId,
}) => {
  // --- 1) 상태 관리 ---
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [newDate, setNewDate] = useState(""); // YYYY-MM-DD
  const [newSubject, setNewSubject] = useState("01"); // 기본값: "01" (국어)
  const [newContent, setNewContent] = useState("");
  const [newRelease, setNewRelease] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 과목 코드 ↔ 과목명 매핑
  const SUBJECT_OPTIONS: { code: string; label: string }[] = [
    { code: "01", label: "국어" },
    { code: "02", label: "수학" },
    { code: "03", label: "영어" },
    { code: "04", label: "사회" },
    { code: "05", label: "과학" },
    // 필요하다면 코드 순서대로 더 추가...
  ];

  // // --- 2) accessToken 가져오기 helper ---
  // const getAccessToken = () => {
  //   return localStorage.getItem("accessToken") || "";
  // };

  // --- 3) 기존 피드백을 불러오는 함수 ---
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      // const token = getAccessToken();
      const token = useAuthStore.getState().accessToken;
      const url = ENDPOINTS.feedbacksByStudent(
        studentId,
        "", // startDate 비워두면 전체 조회
        "" // endDate 비워두면 전체 조회
      );
      console.log(studentId);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`피드백 조회 실패: ${res.status}`);
      }
      const data: Feedback[] = await res.json();
      setFeedbacks(data);
    } catch (error) {
      console.error(error);
      setErrorMsg("피드백을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // --- 4) 새로운 피드백을 생성하는 함수 ---
  const createFeedback = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      if (!newDate || !newContent.trim()) {
        setErrorMsg("날짜와 내용을 모두 입력해주세요.");
        setLoading(false);
        return;
      }

      // const token = getAccessToken();
      const token = useAuthStore.getState().accessToken;
      const url = ENDPOINTS.feedbacks; // POST: /api/feedbacks
      const body = {
        studentId: studentId,
        date: newDate,
        subject: newSubject,
        content: newContent.trim(),
        release: newRelease,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`피드백 생성 실패: ${res.status} ${errText}`);
      }

      // 생성 성공 시, 입력값 초기화 후 목록 갱신
      setNewDate("");
      setNewSubject("01");
      setNewContent("");
      setNewRelease(true);
      await fetchFeedbacks();
    } catch (error) {
      console.error(error);
      setErrorMsg("피드백을 생성하는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 모달이 렌더링되면 한 번만 기존 피드백을 호출
  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ModalBackground>
      <ModalContainer>
        {/* 상단 헤더 바 */}
        <HeaderBar />

        {/* 닫기 버튼 */}
        <CloseButton onClick={onClose}>&times;</CloseButton>

        {/* 헤더 아래쪽 전체가 스크롤 영역 */}
        <ContentWrapper>
          {/* 기존 Title, 인적/학적/출결 섹션은 필요에 따라 여기에 둡니다 */}
          <Title>
            <span>이수만</span> 학생{" "}
            {/* 실제로는 studentId로 받아온 학생 이름을 표시해주세요 */}
          </Title>

          {/* 인적사항 등 기존 섹션 생략… */}

          {/* --- 행동 특성 및 종합의견 (피드백) 섹션 시작 --- */}
          <SectionTitle>행동 특성 및 종합의견</SectionTitle>

          {/* 1) 기존 피드백 목록 테이블 */}
          <FeedbackTable>
            <thead>
              <tr>
                <th>날짜</th>
                <th>과목</th>
                <th>내용</th>
                <th>공개 여부</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    로딩 중…
                  </td>
                </tr>
              ) : feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    등록된 피드백이 없습니다.
                  </td>
                </tr>
              ) : (
                feedbacks.map((fb) => (
                  <tr key={fb.id}>
                    <td>{fb.date}</td>
                    <td>
                      {SUBJECT_OPTIONS.find((s) => s.code === fb.subject)
                        ?.label || "-"}
                    </td>
                    <td>{fb.content}</td>
                    <td>{fb.release ? "공개" : "비공개"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </FeedbackTable>

          {/* 오류 메시지 표시 */}
          {errorMsg && <ErrorText>{errorMsg}</ErrorText>}

          {/* 2) 새로운 피드백 작성 폼 */}
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
                onChange={(e) => setNewSubject(e.target.value)}
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

            <SubmitButton onClick={createFeedback} disabled={loading}>
              {loading ? "저장 중…" : "피드백 저장"}
            </SubmitButton>
          </FormContainer>
          {/* --- 행동 특성 및 종합의견 (피드백) 섹션 끝 --- */}

          {/* 필요하다면 여기에 다른 섹션(예: 상담 이력 등)을 추가 */}
        </ContentWrapper>
      </ModalContainer>
    </ModalBackground>
  );
};

/** 모달 배경 */
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

/** 모달 전체 컨테이너 (높이 고정) */
const ModalContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  width: 1144px;
  height: 804px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

/** 헤더 바 */
const HeaderBar = styled.div`
  background: #ffd986;
  height: 24px;
  border-radius: 16px 16px 0 0;
  width: 100%;
  flex-shrink: 0;
`;

/** 닫기 버튼 */
const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
`;

/** 스크롤 가능한 영역 */
const ContentWrapper = styled.div`
  padding: 16px 48px 40px 48px;
  overflow-y: auto;
  flex: 1;
`;

/** 학생 이름 타이틀 */
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

/** 섹션 제목 */
const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 800;
  font-family: "Inter", sans-serif;
  margin: 32px 0 8px 0;
  color: #000;
`;

/** 피드백 목록을 보여주는 테이블 */
const FeedbackTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;

  thead {
    background: #f0f0f0;
  }

  th,
  td {
    padding: 12px;
    border: 1px solid #ddd;
    font-size: 14px;
    color: #333;
    text-align: left;
  }

  th {
    font-weight: 700;
  }

  tbody tr:nth-child(even) {
    background: #fafafa;
  }
`;

/** 오류 텍스트 */
const ErrorText = styled.div`
  color: red;
  font-size: 14px;
  margin-bottom: 12px;
`;

/** 피드백 작성 폼 전체 컨테이너 */
const FormContainer = styled.div`
  background: #fff;
  border: 1px solid #b5b5b5;
  border-radius: 8px;
  padding: 16px;
  margin-top: 24px;
`;

/** 폼의 한 행 */
const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

/** 폼 레이블 */
const FormLabel = styled.label`
  width: 80px;
  font-size: 14px;
  font-weight: 700;
  color: #555;
`;

/** 일반 텍스트 입력 */
const FormInput = styled.input`
  flex: 1;
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 16px;
`;

/** 과목 선택 셀렉트박스 */
const FormSelect = styled.select`
  flex: 1;
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 16px;
`;

/** 텍스트 에어리어 */
const FormTextarea = styled.textarea`
  flex: 1;
  padding: 6px 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 16px;
  resize: vertical;
`;

/** 체크박스 래퍼 */
const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
`;

/** 저장 버튼 */
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
