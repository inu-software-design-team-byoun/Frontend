// src/components/StudentRecordBody.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ENDPOINTS } from "../constants/api";
import { useAuthStore } from "../hooks/useAuthStore";
import { useSelectedStudentStore } from "../stores/useSelectedStudentStore";

interface Feedback {
  id: number;
  studentId: number;
  date: string; // YYYY-MM-DD
  subject: string; // "01", "02", ...
  content: string;
  release: boolean;
}

interface Attendance {
  id: number;
  student: {
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
  date: string; // YYYY-MM-DD
  status: string; // "결석", "지각", "조퇴", "정상" 등
  note: string;
}

interface BodyProps {
  studentId: number;
}

export const StudentRecordBody: React.FC<BodyProps> = ({ studentId }) => {
  const selectedStudent = useSelectedStudentStore((s) => s.selectedStudent);

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [errorMsgFeedback, setErrorMsgFeedback] = useState("");
  const [errorMsgAttendance, setErrorMsgAttendance] = useState("");

  // 과목 코드 ↔ 과목명 매핑
  const SUBJECT_OPTIONS: { code: string; label: string }[] = [
    { code: "01", label: "국어" },
    { code: "02", label: "수학" },
    { code: "03", label: "영어" },
    { code: "04", label: "사회" },
    { code: "05", label: "과학" },
    { code: "06", label: "미술" },
    { code: "07", label: "음악" },
    { code: "08", label: "체육" },
  ];

  const fetchFeedbacks = async () => {
    try {
      setLoadingFeedback(true);
      setErrorMsgFeedback("");
      const token = useAuthStore.getState().accessToken;
      const url = ENDPOINTS.feedbacksByStudent(studentId, "", "");
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) {
        throw new Error(`피드백 조회 실패: ${res.status}`);
      }
      const data: Feedback[] = await res.json();
      setFeedbacks(data);
    } catch (error) {
      console.error(error);
      setErrorMsgFeedback("피드백을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoadingFeedback(false);
    }
  };

  const fetchAttendances = async () => {
    try {
      setLoadingAttendance(true);
      setErrorMsgAttendance("");
      const token = useAuthStore.getState().accessToken;
      const url = ENDPOINTS.attendancesByStudent(studentId, "", "");
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!res.ok) {
        throw new Error(`출결정보 조회 실패: ${res.status}`);
      }
      const data: Attendance[] = await res.json();
      setAttendances(data);
    } catch (error) {
      console.error(error);
      setErrorMsgAttendance("출결정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchAttendances();
  }, [studentId]);

  // 오늘(로컬) 기준 평일(월~금) 출결 요약 계산
  const attendanceSummary = React.useMemo(() => {
    const summary = {
      출석: 0,
      결석: 0,
      지각: 0,
      조퇴: 0,
    };
    const today = new Date();
    attendances.forEach((rec) => {
      const attDate = new Date(rec.date);
      if (attDate > today) return;
      const day = attDate.getDay();
      if (day === 0 || day === 6) return;
      switch (rec.status) {
        case "정상":
          summary.출석 += 1;
          break;
        case "결석":
          summary.결석 += 1;
          break;
        case "지각":
          summary.지각 += 1;
          break;
        case "조퇴":
          summary.조퇴 += 1;
          break;
        default:
          break;
      }
    });
    return summary;
  }, [attendances]);

  return (
    <Wrapper>
      <ContentWrapper>
        {selectedStudent && (
          <>
            <Title>
              <span>{selectedStudent.name}</span> 학생부
            </Title>

            <SectionTitle>인적사항</SectionTitle>
            <StudentInfoTable>
              <tbody>
                <tr>
                  <InfoLabel>학년</InfoLabel>
                  <InfoValue>{selectedStudent.grade}학년</InfoValue>
                </tr>
                <tr>
                  <InfoLabel>반</InfoLabel>
                  <InfoValue>{selectedStudent.classroom}반</InfoValue>
                </tr>
                <tr>
                  <InfoLabel>전화번호</InfoLabel>
                  <InfoValue>{selectedStudent.phoneNum}</InfoValue>
                </tr>
                <tr>
                  <InfoLabel>생년월일</InfoLabel>
                  <InfoValue>{selectedStudent.birthday}</InfoValue>
                </tr>
              </tbody>
            </StudentInfoTable>
          </>
        )}

        <SectionTitle>출결 요약</SectionTitle>
        {loadingAttendance ? (
          <LoadingText>출결정보 로딩 중…</LoadingText>
        ) : errorMsgAttendance ? (
          <ErrorText>{errorMsgAttendance}</ErrorText>
        ) : (
          <SummarySection>
            <SummaryItem color="#4caf50">
              <Label>출석</Label>
              <Value>{attendanceSummary.출석}</Value>
            </SummaryItem>
            <SummaryItem color="#f44336">
              <Label>결석</Label>
              <Value>{attendanceSummary.결석}</Value>
            </SummaryItem>
            <SummaryItem color="#ff9800">
              <Label>지각</Label>
              <Value>{attendanceSummary.지각}</Value>
            </SummaryItem>
            <SummaryItem color="#2196f3">
              <Label>조퇴</Label>
              <Value>{attendanceSummary.조퇴}</Value>
            </SummaryItem>
          </SummarySection>
        )}

        <SectionTitle>행동 특성 및 종합의견</SectionTitle>
        {loadingFeedback ? (
          <LoadingText>피드백 로딩 중…</LoadingText>
        ) : errorMsgFeedback ? (
          <ErrorText>{errorMsgFeedback}</ErrorText>
        ) : (
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
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center" }}>
                    등록된 피드백이 없습니다.
                  </td>
                </tr>
              ) : (
                feedbacks.map((fb) => (
                  <tr key={fb.id}>
                    <td>{fb.date.slice(0, 10)}</td>
                    <td>
                      {
                        SUBJECT_OPTIONS.find((s) => s.code === fb.subject)
                          ?.label
                      }
                    </td>
                    <td>{fb.content}</td>
                    <td>{fb.release ? "공개" : "비공개"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </FeedbackTable>
        )}
      </ContentWrapper>
    </Wrapper>
  );
};

// ─── styled-components ──────────────────────────────────────────

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

const ContentWrapper = styled.div`
  padding: 16px 32px;
  overflow-y: auto;
  flex: 1;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  margin: 24px 0 24px;
  color: #000;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #000;

  span {
    font-weight: 800;
  }
`;

const StudentInfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;

  td,
  th {
    padding: 8px 12px;
    font-size: 16px;
    color: #333;
    border: 1px solid #ddd;
  }

  th {
    background-color: #f5f5f5;
    font-weight: 600;
    text-align: left;
    width: 25%;
  }
`;

const InfoLabel = styled.th`
  background-color: #fafafa;
`;

const InfoValue = styled.td``;

const SummarySection = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const SummaryItem = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  font-size: 16px;

  &::before {
    content: "";
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${(props) => props.color};
    margin-right: 8px;
  }
`;

const Label = styled.span`
  font-weight: 700;
  margin-right: 4px;
`;

const Value = styled.span`
  font-size: 16px;
`;

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

const ErrorText = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 12px;
`;

const LoadingText = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
`;
