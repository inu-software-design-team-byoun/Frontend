// components/CounselTable.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 54.25rem;
  height: 89vh;

  display: flex;

  border-radius: 1rem;
`;

const SummaryArea = styled.div`
  width: 12.5rem;
  height: 100%;
  background-color: #ff8e83;
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
`;

const RecordWrapper = styled.div`
  margin-left: 0.5rem;
  margin-right: 3rem;
  width: 71.5rem;
  /* height: 47.625rem; // 762px; */
  height: 89vh;
  background-color: white;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.25);
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const TopRectangle = styled.div`
  width: 100%;
  height: 1.5rem;
  background: #63ce6a;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const BottomRectangle = styled.div`
  width: 100%;
  height: 1.5rem;
  background: #63ce6a;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;

const MainArea = styled.div`
  color: black;

  overflow-x: auto;
  max-height: 500px;

  /* border-collapse: collapse; */
  /* width: 100%; */

  // 스크롤 바 커스터마이징
  &::-webkit-scrollbar {
    height: 8px; // 가로 스크롤 높이
  }

  &::-webkit-scrollbar-thumb {
    background-color: #b5b5b5; // thumb 색상
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f0f0f0; // 트랙 색상
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #999999;
  }

  &::-webkit-scrollbar-thumb:active {
    background-color: #777777;
  }

  table {
    position: relative; // ✅ sticky 기준!
    border-collapse: collapse;
    width: max-content;
    table-layout: fixed;
  }

  th {
    width: 92px;
    border-bottom: 1.5px solid #54b25c;
    height: 2.5rem;
    text-align: center;
    font-size: 1rem;

    white-space: nowrap;
    padding: 0;
  }

  td {
    width: 92px;
    border-bottom: 1px solid #ccc;
    height: 2.5rem;
    text-align: center;
    font-size: 1rem;

    white-space: nowrap;
    padding: 0;
  }
`;

export const CounselTable: React.FC = () => {
  return <div>dd</div>;
};
