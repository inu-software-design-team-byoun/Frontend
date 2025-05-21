// components/CounselModal.tsx
import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { CrudButton } from "./CrudButton";

const Wrapper = styled.div`
  width: 54.25rem;
  height: 89vh;

  display: flex;

  background-color: white;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.25);
  border-radius: 1rem;

  display: flex;
  justify-content: flex-start;
`;

const StudentInfoArea = styled.div`
  width: 12.5rem;
  height: 100%;
  background-color: #ff8e83;
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;

  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.25);
`;

const RecordArea = styled.div`
  width: 100%;
  /* height: 47.625rem; // 762px; */
  height: 89vh;
  /* background-color: white; */

  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const TitleArea = styled.div`
  /* border: 1px solid black; */
  width: 100%;
  height: 3rem;

  margin-top: 2rem;
  margin-bottom: 0.5rem;

  display: flex;
  align-items: center;

  color: black;

  .title {
    margin: 0 1.25rem 0 2.5rem;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .student {
    height: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: end;

    color: gray;
    font-size: 1rem;
    font-weight: bold;
  }
`;

const ButtonArea = styled.div`
  width: 100%;
  height: 3rem;

  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const TableArea = styled.div`
  /* width: 588px; */
  width: 624px;
`;

const TopRectangle = styled.div`
  /* position: absolute;
  top: 0; */

  width: 100%;
  height: 1.5rem;
  background: #feb3ac;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
`;

const RecordTable = styled.table`
  border: 1px solid #feb3ac;

  width: 100%;
  height: 35rem;

  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;

  thead {
    position: sticky;
    top: 0;
    z-index: 1;
    border-bottom: 1.5px solid #feb3ac;
  }

  tbody {
    border-spacing: 0;
  }

  th,
  td {
    text-align: center;
    font-size: 1rem;
    height: 2.5rem;
    border: 1px solid #ccc;
    border-collapse: collapse;
  }

  th {
    border: none;
  }

  td {
    /* border: 1px solid #ccc; */
  }
`;

export const CounselModal: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Wrapper>
      <StudentInfoArea></StudentInfoArea>
      <RecordArea>
        <TitleArea>
          <span className="title">행동특성 누가기록</span>
          <span className="student">- 2번 박존슨 학생 / Total 3</span>
        </TitleArea>
        <TableArea>
          <ButtonArea>
            <CrudButton $bgColor="#70C776">추가</CrudButton>
            <CrudButton $bgColor="#FF6969">삭제</CrudButton>
          </ButtonArea>
          <TopRectangle />
          <RecordTable>
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "40%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>순번</th>
                <th>상담일자</th>
                <th>상담내역</th>
                <th>담당교사</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="checkbox" />
                </td>
                <td>1</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <input type="checkbox" />
                </td>
                <td>2</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </RecordTable>
        </TableArea>
      </RecordArea>
    </Wrapper>
  );
};
