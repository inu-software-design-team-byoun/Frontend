import React from "react";
import styled from "styled-components";
import ScoreRadarChart from "../components/ScoreRadarChart";

const StudentInfoBody = styled.div`
  margin-left: 0.5rem;
  margin-right: 3rem;
  width: 71.5rem;
  height: 16rem;

  border-radius: 1rem;
  filter: drop-shadow(0 0 2em #d3d3d3);

  display: flex;
  flex-direction: row;

  background-color: #f9f9f9;

  color: #636262;
`;

const PictureArea = styled.div`
  padding: 2rem 2rem 1.5rem 2rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const PictureInput = styled.img`
  width: 7.5rem;
  height: 10rem;
  border: 1px solid #b5b5b5;

  background-color: #e9e8e8;

  color: black;
  font-size: 0.75rem;
`;

const ChangePictureButton = styled.button`
  border-color: #c9c9c9;

  width: 7.5rem;
  height: 2rem;
  background-color: #ffffff;
  color: black;
  font-weight: bold;
`;

const GridArea = styled.div`
  /* border: 1px solid black; */
  padding: 2.25rem 0 1.5rem 0;
  width: 31.5rem; //504px;

  span.fixed {
    font-size: 1.25rem;
    color: black;
  }

  display: grid;
  grid-template-columns: 144px 144px 120px;
  grid-template-rows: 57px 83px; // 57px vs 60px;
  gap: 16px 48px;

  .item {
    /* border: 1px solid black; */
    display: flex;
    flex-direction: column;

    color: #636262;
    font-size: 0.75rem;
    font-weight: bold;
  }

  .item:nth-child(1) {
    justify-content: space-between; // 양 끝으로 배치
    grid-row: 1/1;
    grid-column: 1/1;
  }
  .item:nth-child(2) {
    grid-row: 2/2;
    grid-column: 1/1;

    justify-content: space-between;

    div {
      display: flex;
      justify-content: space-between;

      width: 10.5rem;
    }

    button {
      width: 5rem;
      height: 1.75rem;

      border: 1px solid #c9c9c9;
      border-radius: 0.25rem;

      background-color: white;

      color: black;
      font-weight: bold;
      font-size: 0.75rem;
    }
  }
  .item:nth-child(3) {
    justify-content: space-between;
    grid-row: 1/1;
    grid-column: 2/2;
  }
  .item:nth-child(4) {
    grid-row: 2/2;
    grid-column: 2/2;

    span {
      margin-bottom: 0.25rem;
    }
  }
  .item:nth-child(5) {
    justify-content: space-between;
    grid-row: 1/1;
    grid-column: 3/3;
  }
  .item:nth-child(6) {
    grid-row: 2/2;
    grid-column: 3/3;
    span {
      margin-bottom: 0.25rem;
    }
  }
  .item:nth-child(9) {
    grid-row: 3/3;
    grid-column: 3/3;
    align-items: flex-end;
  }
`;

// 원래 144px 짜리 input인데 padding-left:차이로 -12, border 감안 -4,
const LongInput = styled.input`
  border: 1px solid #7c7c7c;
  border-radius: 0.5rem;

  width: 8rem; //128px;
  height: 2rem;
  background-color: white;
  padding: 0 0 0 0.75rem;
  font-weight: bold;
  color: black;

  &::placeholder {
    // 해당 input 태그의 placeholder 색상 바꾸기
    color: #d3d3d3;
  }

  &:focus {
    border-color: black;
    /* border-width: 1.5px; */
    outline: 0.5px solid black;
  }
`;

// 원래 120px 짜리 input인데 LongInput과 마찬가지 이유로 -16
const NormalInput = styled.input`
  border: 1px solid #7c7c7c;
  border-radius: 0.5rem;

  width: 6.5rem; // 104px;
  height: 2rem;
  background-color: white;
  padding: 0 0 0 0.75rem;
  font-weight: bold;
  color: black;

  &::placeholder {
    // 해당 input 태그의 placeholder 색상 바꾸기
    color: #d3d3d3;
  }

  &:focus {
    border-color: black;
    /* border-width: 1.5px; */
    outline: 0.5px solid black;
  }
`;

const CrudButton = styled.button<{ bgColor: string; width?: string }>`
  border: none;
  border-radius: 0.5rem;

  margin-left: 0.75rem;
  width: ${(props) => (props.width ? props.width : "4rem")};
  height: 2rem;

  /* background-color: #86acff; */
  background-color: ${(props) => props.bgColor};
  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: bold;
  color: white;
`;

const GapBlankBody = styled.div`
  /* border: 1px solid black; */

  width: 71.5rem;
  margin: 1.25rem 0;

  display: flex;
  justify-content: flex-end;
`;

const ScoreDatabaseBody = styled.div``;

// const shortInput = styled.input;

const ScorePage: React.FC = () => {
  return (
    <>
      <StudentInfoBody>
        <PictureArea>
          <PictureInput />
          <ChangePictureButton>이미지 등록/변경</ChangePictureButton>
        </PictureArea>
        <GridArea>
          <div className="item">
            <span>이름</span>
            <LongInput placeholder="학생 이름 입력"></LongInput>
          </div>
          <div className="item">
            <span>학년, 반</span>
            <span className="fixed">2학년 4반</span>
            <div>
              <button>상담 내역</button>
              <button>피드백</button>
            </div>
          </div>
          <div className="item">
            <span>전화번호</span>
            <LongInput placeholder="010-XXXX-XXXX"></LongInput>
          </div>
          <div className="item">
            <span>생년월일</span>
            <LongInput placeholder="YYYY-MM-DD"></LongInput>
          </div>
          <div className="item">
            <span>총 성적</span>
            <NormalInput placeholder="98"></NormalInput>
          </div>
          <div className="item">
            <span>평균 등급</span>
            <NormalInput placeholder="B+"></NormalInput>
          </div>
          <div className="item"></div>
          <div className="item"></div>
          <div className="item">
            <CrudButton bgColor="#86acff;">수정</CrudButton>
          </div>
        </GridArea>
        {/* <ScoreRadarChart /> */}
      </StudentInfoBody>
      <GapBlankBody>
        <CrudButton bgColor="#70C776;" width="5rem">
          학생 추가
        </CrudButton>
        <CrudButton bgColor="#FF6969;">삭제</CrudButton>
      </GapBlankBody>
      <ScoreDatabaseBody />
    </>
  );
};

export default ScorePage;
