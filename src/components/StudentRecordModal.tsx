import React from "react";
import styled from "styled-components";

export interface StudentInfo {
  grade: string;
  class: string;
  number: string;
  teacher: string;
  summary: string;
}

// onClose 함수 타입을 추가
interface ModalProps {
  onClose: () => void;
}

export const StudentRecordModal: React.FC<ModalProps> = ({ onClose }) => {
  return (
    <ModalBackground>
      <ModalContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <HeaderBar />
        <Title>
          <span>이수만</span> 학생
        </Title>
        <SectionTitle>인적사항</SectionTitle>
        <InfoBox>
          <Row>
            <Label>성명</Label>
            <Value>이 수만</Value>
            <Label style={{ marginLeft: 32 }}>성별</Label>
            <Value>남</Value>
          </Row>
          <Row>
            <Label>주소</Label>
            <Value>인천시 연수구 송도동 100-1</Value>
          </Row>
        </InfoBox>
        <SectionTitle>학적사항</SectionTitle>
        <InfoBox>
          <Row>
            <Value>
              2024년 3월 2일 ㅁㅁ 고등학교 제 1학년 입학 (2024년 09월 10일 전출)
              <br />
              2024년 09월 11일 ㅇㅇ 고등학교 제 1학년 전입학
            </Value>
          </Row>
        </InfoBox>
        <SectionTitle>출결 요약</SectionTitle>
        <InfoBox>
          <Row>
            <Label>출석</Label>
            <Value>44</Value>
            <Label style={{ marginLeft: 32 }}>결석</Label>
            <Value>0</Value>
            <Label style={{ marginLeft: 32 }}>병결</Label>
            <Value>0</Value>
            <Label style={{ marginLeft: 32 }}>지각</Label>
            <Value>0</Value>
          </Row>
        </InfoBox>
        <SectionTitle>행동 특성 및 종합의견</SectionTitle>
        <InfoBox>
          <Row>
            <Label>학년</Label>
            <Value>1학년</Value>
            <Label style={{ marginLeft: 32 }}>종합의견</Label>
            <Value>매우 산만함</Value>
            <Label style={{ marginLeft: 32 }}>기록인 성명</Label>
            <Value>박종태</Value>
          </Row>
          <Row>
            <Label>학년</Label>
            <Value>2학년</Value>
            <Label style={{ marginLeft: 32 }}>기록인 성명</Label>
            <Value>이재용</Value>
          </Row>
        </InfoBox>
      </ModalContainer>
    </ModalBackground>
  );
};

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
`;

const ModalContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  width: 1144px;
  max-height: 804px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
  position: relative;
  padding: 40px 48px;
`;

const HeaderBar = styled.div`
  background: #ffd986;
  height: 24px;
  border-radius: 16px 16px 0 0;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  margin: 40px 0 16px 32px;
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

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #555;
  width: 80px;
`;

const Value = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #555;
  margin-left: 16px;
`;

const Divider = styled.div`
  height: 1px;
  background: #b5b5b5;
  margin: 24px 0;
  width: 100%;
`;

const InfoBox = styled.div`
  background: #fff5df;
  border: 1px solid #b5b5b5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;
