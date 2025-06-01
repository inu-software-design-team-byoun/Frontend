// components/GradeTableEx.tsx
import React, { useEffect } from "react";
import styled from "styled-components";
import { useScoreApi } from "../hooks/useScoreApi"; // useGradeApi → useScoreApi
import { useStudentsListApi } from "../hooks/useStudentListApi";

import GradeRow from "./GradeRow";
import { TransformedStudent } from "../hooks/useScoreApi"; // 맨 위 import 추가
import SelectArrow from "../assets/icon/SelectArrow.png";
import { useStudentScoreStore } from "../store/useStudentScoreStore";
import isEqual from "lodash/isEqual";

const Wrapper = styled.div`
  margin-left: 0.5rem;
  margin-right: 3rem;
  width: 71.5rem;
  height: 27rem; // 432px;
  background-color: white;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.25);
  border-radius: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

  /* bottom: 0;
  position: sticky;
  z-index: 2; */
`;

const MainArea = styled.table`
  color: black;
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;

  th {
    border-bottom: 1px solid #86acff;
    padding: 0.5rem;
    height: 1.5rem;
    text-align: center;
    font-weight: bold;
    font-size: 1rem;
  }
`;

const ScrollableTbody = styled.div`
  max-height: 277px; // 원하는 높이로 조절
  overflow-y: auto;

  // 스크롤 바 디자인
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }

  table {
    color: black;
    border-collapse: collapse;
    width: 100%;
    table-layout: fixed;
    color: black;
  }

  td {
    /* color: black; */
    border-bottom: 1px solid #ccc;
    height: 2.5rem;
    /* padding: 0.5rem; */
    text-align: center;
    font-size: 1rem;
  }
`;

const ClassArea = styled.div`
  width: 100%;
  height: 64px;
  border-bottom: 2px solid #86acff;

  display: flex;
  align-items: center;

  button {
    margin-left: 2rem;
    width: 4rem;
    height: 2rem;

    color: black;
  }
`;

const Select = styled.select<{ $syllable: number }>`
  margin-left: ${(props) => (props.$syllable === 3 ? "1.25rem" : "1rem")};
  width: ${(props) =>
    props.$syllable === 3 ? "92px" : props.$syllable === 2 ? "80px" : "124px"};
  height: 2.5rem;
  padding: 0 1rem; // 12px;
  border: 2px solid #86acff;
  border-radius: 0.65rem;

  color: black;
  font-family: NanumSquare;
  font-size: 1rem;
  font-weight: bold;

  background-color: white;

  &:focus {
    outline: none;
    /* border-color: black; */
  }

  appearance: none;
  -webkit-appearance: none;
  background-color: white;

  background-image: url(${SelectArrow});
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 0.75rem;
`;

interface GradeTableProps {
  grade: number;
  classroom: number;
  onGradeChange: (g: number) => void;
  onClassChange: (c: number) => void;
}

export const GradeTable: React.FC<GradeTableProps> = ({
  grade,
  classroom,
  onGradeChange,
  onClassChange,
}) => {
  // const [selectedGrade, setSelectedGrade] = useState(1);
  // const [selectedClass, setSelectedClass] = useState(5);

  // // const { data } = useScoreApi(selectedGrade, selectedClass);

  // const { data: studentList } = useStudentsListApi(
  //   selectedGrade,
  //   selectedClass
  // );
  // const { data: scoreData } = useScoreApi(selectedGrade, selectedClass);

  // // 학생별 점수 매핑을 위한 Map 생성
  // const scoreMap = new Map<number, TransformedStudent>();
  // scoreData.forEach((s) => scoreMap.set(s.id, s));

  // // studentList 기준으로, 점수가 없으면 null 처리
  // const mergedStudents: TransformedStudent[] = studentList.map((stu) => ({
  //   id: stu.id,
  //   studentNum: stu.studentNum,
  //   name: stu.name,
  //   grade: stu.grade,
  //   classroom: stu.classroom,
  //   phoneNum: stu.phoneNum,
  //   birthday: stu.birthday,
  //   totalScore: scoreMap.get(stu.id)?.totalScore ?? null,
  //   averageScore: scoreMap.get(stu.id)?.averageScore ?? null,
  //   korean: scoreMap.get(stu.id)?.korean ?? null,
  //   math: scoreMap.get(stu.id)?.math ?? null,
  //   english: scoreMap.get(stu.id)?.english ?? null,
  //   society: scoreMap.get(stu.id)?.society ?? null,
  //   science: scoreMap.get(stu.id)?.science ?? null,
  //   art: scoreMap.get(stu.id)?.art ?? null,
  //   music: scoreMap.get(stu.id)?.music ?? null,
  //   physical: scoreMap.get(stu.id)?.physical ?? null,
  // }));
  // const [students, setStudents] = useState<TransformedStudent[]>([]);

  const { data: studentList } = useStudentsListApi(grade, classroom);
  const { data: scoreData } = useScoreApi(grade, classroom);

  const scoreMap = new Map<number, TransformedStudent>();
  scoreData.forEach((s) => scoreMap.set(s.id, s));

  const mergedStudents: TransformedStudent[] = studentList.map((stu) => ({
    id: stu.id,
    studentNum: stu.studentNum,
    name: stu.name,
    grade: stu.grade,
    classroom: stu.classroom,
    phoneNum: stu.phoneNum,
    birthday: stu.birthday,
    totalScore: scoreMap.get(stu.id)?.totalScore ?? null,
    averageScore: scoreMap.get(stu.id)?.averageScore ?? null,
    korean: scoreMap.get(stu.id)?.korean ?? null,
    math: scoreMap.get(stu.id)?.math ?? null,
    english: scoreMap.get(stu.id)?.english ?? null,
    society: scoreMap.get(stu.id)?.society ?? null,
    science: scoreMap.get(stu.id)?.science ?? null,
    art: scoreMap.get(stu.id)?.art ?? null,
    music: scoreMap.get(stu.id)?.music ?? null,
    physical: scoreMap.get(stu.id)?.physical ?? null,
  }));

  // useEffect(() => {
  //   setStudents(data);
  // }, [data]);

  // if (loading) return <div>Loading...</div>;

  const subjects = [
    "korean",
    "math",
    "english",
    "society",
    "science",
    "art",
    "music",
    "physical",
  ];

  useEffect(() => {
    const current = useStudentScoreStore.getState().students;
    if (!isEqual(current, mergedStudents)) {
      useStudentScoreStore.getState().setStudents(mergedStudents);
    }
  }, [mergedStudents]);

  return (
    <Wrapper>
      <div>
        <TopRectangle />
        <ClassArea>
          <Select
            $syllable={3}
            // value={selectedGrade}
            // onChange={(e) => setSelectedGrade(Number(e.target.value))}
            value={grade}
            onChange={(e) => onGradeChange(Number(e.target.value))}
          >
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
          </Select>
          <Select
            $syllable={2}
            // value={selectedClass}
            // onChange={(e) => setSelectedClass(Number(e.target.value))}
            value={classroom}
            onChange={(e) => onClassChange(Number(e.target.value))}
          >
            <option value="1">1반</option>
            <option value="2">2반</option>
            <option value="3">3반</option>
            <option value="4">4반</option>
            <option value="5">5반</option>
            <option value="6">6반</option>
          </Select>
          <Select
            $syllable={4}
            //  value={selectedSemester}
            //  onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="1학기 중간">1학기 중간</option>
            <option value="1학기 기말">1학기 기말</option>
            <option value="2학기 중간">2학기 중간</option>
            <option value="2학기 기말">2학기 기말</option>
          </Select>
        </ClassArea>

        <MainArea>
          <colgroup>
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            {/* <col style={{ width: "11%" }} /> */}
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>이름</th>
              <th>국어</th>
              <th>수학</th>
              <th>영어</th>
              <th>사회</th>
              <th>과학</th>
              <th>미술</th>
              <th>음악</th>
              <th>체육</th>
              <th></th>
            </tr>
          </thead>
        </MainArea>
        <ScrollableTbody>
          <table>
            <colgroup>
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "8%" }} />
              {/* <col style={{ width: "11%" }} /> */}
            </colgroup>
            {/* <tbody>
              {data.map((student) => (
                <GradeRow
                  key={student.id}
                  student={student}
                  subjects={subjects}
                />
              ))}
            </tbody> */}
            <tbody>
              {/* {mergedStudents.map((student) => (
                <GradeRow
                  key={student.id}
                  student={student}
                  subjects={subjects}
                />
              ))} */}
              {mergedStudents.map((stu) => (
                <GradeRow key={stu.id} student={stu} subjects={subjects} />
              ))}
            </tbody>
          </table>
        </ScrollableTbody>
      </div>
      <BottomRectangle />
    </Wrapper>
  );
};
