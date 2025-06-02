// hooks/fetchStudentInfo.ts
import { ENDPOINTS } from "../constants/api";
import { useSelectedStudentStore } from "../stores/useSelectedStudentStore";

export const fetchStudentInfo = async (
  studentId: number,
  // grade: number,
  // classroom: number,
  totalScore: number,
  averageScore: number
) => {
  const setSelectedStudent =
    useSelectedStudentStore.getState().setSelectedStudent;

  try {
    const res = await fetch(ENDPOINTS.studentInfo(studentId));
    const matched = await res.json();

    // const matched = students.find((stu: any) => stu.id === studentId);

    if (matched) {
      setSelectedStudent({
        id: matched.id,
        name: matched.name,
        grade: matched.grade,
        classroom: matched.classroom,
        phoneNum: matched.phoneNum,
        birthday: matched.birthday,
        picture: matched.picture || null, // ""해야되나?
        totalScore, // GradeRowEx에서 props로 넘겨준 totalScore, averageScore
        averageScore, // GradeRowEx에서는 이 두 변수를 미리 학년,반별 성적에서 받아온 상태였기 때문
      });
    }
    console.log(matched.id, "번 학생 정보를 불러왔습니다.");
    console.log(matched);
  } catch (err) {
    console.error("학생 정보 요청 실패", err);
  }
};
