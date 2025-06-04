// src/pages/StudentRecordPage.tsx
import React from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import { StudentRecordBody } from "../components/StudentRecordBody";
import styled from "styled-components";

const StudentRecordPage: React.FC = () => {
  // store 에서 studentId 꺼내기
  const studentId = useAuthStore((s) => s.studentId);

  // (추가) 혹시 아직 studentId가 세팅되지 않은 상태라면 로딩 표시
  if (!studentId) {
    return <Centered>학생 정보를 가져오는 중…</Centered>;
  }

  return (
    <PageWrapper>
      <StudentRecordBody studentId={studentId} />
    </PageWrapper>
  );
};

export default StudentRecordPage;

const PageWrapper = styled.div`
  flex: 1;
  padding: 2rem 3rem;
  background-color: #f9f9f9;
`;

const Centered = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
`;
