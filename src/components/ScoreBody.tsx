import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  margin-left: 0.5rem;
  margin-right: 3rem;
  width: 71.5rem;
  height: 27rem; // 476px;
  background-color: white;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.25);
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
`;

const TopRectangle = styled.div`
  width: 100%;
  height: 1.5rem;
  background: #86acff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const BottomRectangle = styled.div`
  width: 100%;
  height: 1.5rem;
  background: #86acff;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;

const ScoreDatabaseArea = styled.div`
  width: 100%;
  height: 24rem;
`;

const ClassArea = styled.div`
  width: 100%;
  height: 40px;
  border-bottom: 2px solid #86acff;
`;
const FieldArea = styled.div`
  width: 100%;
  height: 32px;
  border-bottom: 2px solid #86acff;
`;

const CustomRow = styled.div`
  width: 100%;
  height: 36px;
  border-bottom: 1px solid #d3d3d3;
`;

const ScoreBody = () => {
  return (
    <Wrapper>
      <TopRectangle />
      <ScoreDatabaseArea>
        <ClassArea></ClassArea>
        <FieldArea></FieldArea>
        <CustomRow></CustomRow>
        <CustomRow></CustomRow>
        <CustomRow></CustomRow>
        <CustomRow></CustomRow>
        <CustomRow></CustomRow>
        <CustomRow></CustomRow>
        <CustomRow></CustomRow>
        <CustomRow></CustomRow>
      </ScoreDatabaseArea>
      <BottomRectangle />
    </Wrapper>
  );
};

export default ScoreBody;
