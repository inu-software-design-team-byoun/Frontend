// ScorePage.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ScoreRadarChart from "../components/ScoreRadarChart";
import { GradeTable } from "../components/GradeTableEx";

import { useSelectedStudentStore } from "../store/useSelectedStudentStore";
import { useStudentsListApi } from "../hooks/useStudentListApi";
import { ENDPOINTS } from "../constants/api";

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
    /* border: 1px solid black; */
    grid-row: 3/3;
    grid-column: 3/3;

    div {
      display: flex;
    }
    align-items: flex-end;
  }
`;

// 원래 144px 짜리 input인데 padding-left:차이로 -12, border 감안 -4,
const LongInput = styled.input<{ $isEditing: boolean }>`
  border: 1px solid #7c7c7c;
  border-radius: 0.5rem;

  width: 8rem; //128px;
  height: 2rem;
  background-color: white;
  padding: 0 0 0 0.75rem;
  font-weight: bold;
  color: ${(props) => (props.$isEditing ? "black" : "gray")};

  &::placeholder {
    // 해당 input 태그의 placeholder 색상 바꾸기
    color: #d3d3d3;
  }

  &:focus {
    /* border-color: black; */
    /* border-width: 1.5px; */
    outline: ${(props) => (props.$isEditing ? "0.5px solid black" : "none")};
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
  color: gray;

  &::placeholder {
    // 해당 input 태그의 placeholder 색상 바꾸기
    color: #d3d3d3;
  }

  &:focus {
    /* border-color: black;
    border-width: 1.5px; */
    /* outline: 0.5px solid black; */
    outline: none;
  }
`;

const CrudButton = styled.button<{
  $bgColor: string;
  width?: string;
  $isEditing?: boolean;
}>`
  border: none;
  border-radius: 0.5rem;

  margin-left: 0.75rem;
  width: ${(props) => (props.width ? props.width : "4rem")};
  height: 2rem;

  /* background-color: #86acff; */
  // isEditing props를 전달해주지 않은 버튼은 $bgColor로 전달받은 색이 그냥 나오고
  // isEditing props를 전달받은 버튼은 조건에 따라 색상 변경
  background-color: ${(props) =>
    props.$isEditing ? "#86acff" : props.$bgColor};
  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: bold;
  color: white;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const ChartArea = styled.div`
  margin: 0 1rem;
  padding: 2.25rem 2rem 0 2rem;
  display: flex;
  flex-direction: column;

  color: #636262;
  font-size: 0.75rem;
  font-weight: bold;

  span {
    width: 4rem;
  }

  div {
    transform: translate(2rem, -0.75rem);
    /* width: 220px; */
    height: 200px;
  }
`;

const GapBlankBody = styled.div`
  /* border: 1px solid black; */

  width: 71.5rem;
  margin: 1.25rem 0;

  display: flex;
  justify-content: flex-end;
`;

interface ScorePageProps {
  studentId?: number;
}

const ScorePage: React.FC<ScorePageProps> = () => {
  // const { selectedStudent } = useSelectedStudentStore();
  const { selectedStudent, clearSelectedStudent } = useSelectedStudentStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // grade/class 상태를 ScorePage에서 보관
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [selectedClass, setSelectedClass] = useState(5);

  // ── 추가: 해당 학년·반의 학생 목록 가져오기 ──
  const { data: studentList } = useStudentsListApi(
    selectedGrade,
    selectedClass
  );

  const [editForm, setEditForm] = useState({
    name: "",
    phoneNum: "",
    birthday: "",
  });

  const [addForm, setAddForm] = useState({
    name: "",
    phoneNum: "",
    birthday: "",
  });

  // 폼 유효성 검사 플래그
  const canSubmitAdd =
    addForm.name.trim() !== "" &&
    addForm.phoneNum.trim() !== "" &&
    addForm.birthday.trim() !== "";

  const canSubmitEdit =
    editForm.name.trim() !== "" &&
    editForm.phoneNum.trim() !== "" &&
    editForm.birthday.trim() !== "";

  useEffect(() => {
    if (selectedStudent) {
      setEditForm({
        name: selectedStudent.name,
        phoneNum: selectedStudent.phoneNum,
        birthday: selectedStudent.birthday,
      });
    }
  }, [selectedStudent]);

  // 수정 모드 진입 핸들러
  const handleIsEditing = () => {
    setIsEditing(true);
  };

  // 수정 취소 핸들러
  const handleCancelEdit = () => {
    if (selectedStudent) {
      setEditForm({
        name: selectedStudent.name,
        phoneNum: selectedStudent.phoneNum,
        birthday: selectedStudent.birthday,
      });
    }
    setIsEditing(false);
  };

  // 학생 추가 모드 진입 핸들러
  const handleAddClick = () => {
    setIsAdding(true);
    setAddForm({ name: "", phoneNum: "", birthday: "" });
    // 편집 모드 꺼두기
    setIsEditing(false);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setAddForm({ name: "", phoneNum: "", birthday: "" });
  };

  // const handleSubmit = async () => {
  //   if (!selectedStudent) return; // 이걸 안해주면 아래 await fetch에서 'possibly null' 경고 나옴
  //   try {
  //     await fetch(ENDPOINTS.studentInfo(selectedStudent.id), {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         name: editForm.name,
  //         phoneNum: editForm.phoneNum,
  //         birthday: editForm.birthday,
  //       }),
  //     });
  //     alert("수정 완료");
  //     setIsEditing(false);
  //   } catch (err) {
  //     console.error("수정 실패", err);
  //   }
  // };

  // 수정 완료 핸들러
  const handleSubmitEdit = async () => {
    // 유효성 검사
    if (!canSubmitEdit) {
      alert("이름, 전화번호, 생년월일을 모두 입력해주세요.");
      return;
    }
    if (!selectedStudent) return;
    try {
      await fetch(ENDPOINTS.studentInfo(selectedStudent.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      // 스토어 업데이트
      useSelectedStudentStore.getState().setSelectedStudent({
        ...selectedStudent,
        ...editForm,
      });
      alert("수정 완료");
      setIsEditing(false);
    } catch (err) {
      console.error("수정 실패", err);
    }
  };

  // 학생 추가 완료 핸들러
  const handleSubmitAdd = async () => {
    // 유효성 검사
    if (!canSubmitAdd) {
      alert("이름, 전화번호, 생년월일을 모두 입력해주세요.");
      return;
    }
    try {
      // 자동 학번 부여 로직
      const order = studentList.length + 1; // 기존 학생 수 + 1
      const studentNum = selectedGrade * 10000 + selectedClass * 100 + order;

      const body = {
        studentNum, // 자동 생성된 학번
        grade: selectedGrade, // lifted state 사용
        classroom: selectedClass, // lifted state 사용
        ...addForm,
      };
      const res = await fetch(ENDPOINTS.students, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const newStudent = await res.json();
      console.log("생성된 학생:", newStudent);
      alert("학생 추가 완료");
      setIsAdding(false);
      // 목록 갱신을 위해 같은 반 상태 강제 트리거
      setSelectedClass((c) => c);
    } catch (err) {
      console.error("학생 추가 실패", err);
    }
  };

  // ─ 삭제 핸들러 ───────────────────────────────────
  const handleDelete = async () => {
    if (!selectedStudent) {
      alert("삭제할 학생을 선택하세요.");
      return;
    }
    if (!window.confirm(`${selectedStudent.name} 학생을 삭제하시겠습니까?`)) {
      return;
    }
    try {
      await fetch(ENDPOINTS.studentInfo(selectedStudent.id), {
        method: "DELETE",
      });
      alert("삭제 완료");
      clearSelectedStudent();
      // 목록 갱신을 위해 반 상태를 다시 세팅
      setSelectedClass((c) => c);
    } catch (err) {
      console.error("삭제 실패", err);
      alert("삭제에 실패했습니다.");
    }
  };

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
            <LongInput
              // value={selectedStudent?.name || ""}
              value={isAdding ? addForm.name : editForm.name}
              readOnly={!(isEditing || isAdding)}
              $isEditing={isEditing || isAdding}
              onChange={(e) =>
                isAdding
                  ? setAddForm({ ...addForm, name: e.target.value })
                  : setEditForm({ ...editForm, name: e.target.value })
              }
            />
          </div>
          <div className="item">
            <span>학년, 반</span>
            <span className="fixed">
              {/* {selectedStudent
                ? `${selectedStudent.grade}학년 ${selectedStudent.classroom}반`
                : ""} */}
              {selectedGrade}학년 {selectedClass}반
            </span>
            <div>
              <button>상담 내역</button>
              <button>피드백</button>
            </div>
          </div>
          <div className="item">
            <span>전화번호</span>
            <LongInput
              // value={selectedStudent?.phoneNum || ""}
              value={isAdding ? addForm.phoneNum : editForm.phoneNum}
              readOnly={!(isEditing || isAdding)}
              $isEditing={isEditing || isAdding}
              onChange={(e) =>
                isAdding
                  ? setAddForm({ ...addForm, phoneNum: e.target.value })
                  : setEditForm({ ...editForm, phoneNum: e.target.value })
              }
            />
          </div>
          <div className="item">
            <span>생년월일</span>
            <LongInput
              // value={selectedStudent?.birthday || ""}
              value={isAdding ? addForm.birthday : editForm.birthday}
              readOnly={!(isEditing || isAdding)}
              $isEditing={isEditing || isAdding}
              onChange={(e) =>
                isAdding
                  ? setAddForm({ ...addForm, birthday: e.target.value })
                  : setEditForm({ ...editForm, birthday: e.target.value })
              }
            />
          </div>
          <div className="item">
            <span>총 성적</span>
            <NormalInput value={selectedStudent?.totalScore || ""} readOnly />
          </div>
          <div className="item">
            <span>평균 등급</span>
            <NormalInput value={selectedStudent?.averageScore || ""} readOnly />
          </div>
          <div className="item"></div>
          <div className="item"></div>
          <div className="item">
            {isAdding ? (
              // 추가모드
              <div>
                <CrudButton $bgColor="gray" onClick={handleCancelAdd}>
                  취소
                </CrudButton>
                <CrudButton
                  $bgColor="#86acff"
                  onClick={handleSubmitAdd}
                  $isEditing
                  disabled={!canSubmitAdd}
                >
                  완료
                </CrudButton>
              </div>
            ) : isEditing ? (
              // 수정 모드
              <div>
                <CrudButton $bgColor="#B0B0B0" onClick={handleCancelEdit}>
                  취소
                </CrudButton>
                <CrudButton
                  $bgColor="#86acff"
                  onClick={handleSubmitEdit}
                  $isEditing
                  disabled={!canSubmitEdit}
                >
                  완료
                </CrudButton>
              </div>
            ) : (
              <CrudButton $bgColor="#FFA0A0" onClick={handleIsEditing}>
                수정
              </CrudButton>
            )}
          </div>
        </GridArea>
        <ChartArea>
          <span>평균 점수</span>
          <div>
            <ScoreRadarChart />
          </div>
        </ChartArea>
      </StudentInfoBody>
      <GapBlankBody>
        <CrudButton $bgColor="#70C776;" width="5rem" onClick={handleAddClick}>
          학생 추가
        </CrudButton>
        <CrudButton
          $bgColor="#FF6969"
          onClick={handleDelete}
          disabled={!selectedStudent}
        >
          삭제
        </CrudButton>
      </GapBlankBody>
      <GradeTable
        grade={selectedGrade}
        classroom={selectedClass}
        onGradeChange={setSelectedGrade}
        onClassChange={setSelectedClass}
      />
    </>
  );
};

export default ScorePage;
