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
        {/* 상단 헤더 바 */}
        <HeaderBar />

        {/* 닫기 버튼은 헤더 위에 겹치도록 position:absolute */}
        <CloseButton onClick={onClose}>&times;</CloseButton>

        {/* 헤더 아래쪽 콘텐츠만 스크롤 되게 하는 래퍼 */}
        <ContentWrapper>
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
                2024년 3월 2일 ㅁㅁ 고등학교 제 1학년 입학 (2024년 09월 10일
                전출)
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
            <Row>
              <Label>학년</Label>
              <Value>2학년</Value>
              <Label style={{ marginLeft: 32 }}>기록인 성명</Label>
              <Value>이재용</Value>
            </Row>
            <Row>
              <Label>학년</Label>
              <Value>2학년</Value>
              <Label style={{ marginLeft: 32 }}>기록인 성명</Label>
              <Value>이재용</Value>
            </Row>
            <Row>
              <Label>학년</Label>
              <Value>2학년</Value>
              <Label style={{ marginLeft: 32 }}>기록인 성명</Label>
              <Value>이재용</Value>
            </Row>
            <Row>
              <Label>학년</Label>
              <Value>2학년</Value>
              <Label style={{ marginLeft: 32 }}>기록인 성명</Label>
              <Value>이재용</Value>
            </Row>
            <Row>
              <Label>학년</Label>
              <Value>2학년</Value>
              <Label style={{ marginLeft: 32 }}>기록인 성명</Label>
              <Value>이재용</Value>
            </Row>
            <Row>
              <Label>학년</Label>
              <Value>2학년</Value>
              <Label style={{ marginLeft: 32 }}>기록인 성명</Label>
              <Value>이재용</Value>
            </Row>
          </InfoBox>
        </ContentWrapper>
      </ModalContainer>
    </ModalBackground>
  );
};

/** 배경(뒷화면) */
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

/** 모달 전체 컨테이너 (높이 고정, 내부 오버플로우 숨김) */
const ModalContainer = styled.div`
  background: #fff;
  border-radius: 16px;
  width: 1144px;
  height: 804px; /* ← 높이를 고정 */
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden; /* ← 헤더를 제외한 영역만 스크롤 하기 위해 전체 오버플로우 숨김 */
  display: flex;
  flex-direction: column;
`;

/** 헤더 바 (노란색) */
const HeaderBar = styled.div`
  background: #ffd986;
  height: 24px; /* 헤더 높이 고정 */
  border-radius: 16px 16px 0 0;
  width: 100%;
  flex-shrink: 0; /* flex item 축소 방지 */
`;

/** 닫기 버튼 (헤더 위에 겹치도록 절대 위치) */
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
  z-index: 10; /* 헤더 위에 가려지지 않도록 */
`;

/** 헤더 아래 컨텐츠 전체를 감싸는 래퍼 (스크롤 가능) */
const ContentWrapper = styled.div`
  padding: 16px 48px 40px 48px;
  overflow-y: auto; /* 내용이 길어지면 이 부분만 스크롤 */
  flex: 1; /* 남은 높이만큼 채움 */
`;

/** 타이틀(학생 이름) */
const Title = styled.h2`
  font-size: 24px;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  margin: 24px 0 16px 0; /* 헤더 아래 여유를 조금 주기 위해 margin-top을 24px로 줄였습니다 */
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

/** 행(Row) 스타일 */
const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

/** 레이블 */
const Label = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #555;
  width: 80px;
`;

/** 값(Value) */
const Value = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #555;
  margin-left: 16px;
`;

/** 구분선 (지금 예시에서는 사용하지 않지만 필요 시 남겨두었습니다) */
const Divider = styled.div`
  height: 1px;
  background: #b5b5b5;
  margin: 24px 0;
  width: 100%;
`;

/** 인포 박스(노란 배경) */
const InfoBox = styled.div`
  /* 높이 고정하지 않고, 내부 콘텐츠에 따라 유연하게 늘어나되, 최종적으로 ContentWrapper가 스크롤을 담당합니다 */
  background: #fff5df;
  border: 1px solid #b5b5b5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;
