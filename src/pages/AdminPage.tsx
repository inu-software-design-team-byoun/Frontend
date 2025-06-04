import styled from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

const Container = styled.div`
  max-width: 900px;
  margin: 40px auto;
  padding: 32px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 32px;
`;

const Th = styled.th`
  background: #f5f6fa;
  font-weight: 600;
  padding: 12px 8px;
  border-bottom: 2px solid #eaeaea;
`;

const Td = styled.td`
  padding: 10px 8px;
  border-bottom: 1px solid #eaeaea;
  text-align: center;
`;

const Button = styled.button`
  background-color: #007aff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  margin: 0 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background: #005bb5;
  }
  &.delete {
    background: #ff4d4f;
    &:hover {
      background: #d9363e;
    }
  }
  &.edit {
    background: #ffa940;
    &:hover {
      background: #d48806;
    }
  }
`;

const AddButton = styled(Button)`
  margin-bottom: 16px;
  background: #52c41a;
  &:hover {
    background: #389e0d;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 32px 24px;
  min-width: 400px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  font-size: 15px;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
`;

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  grade: string;
  homeroom: string;
  phoneNum: string;
  birthday: string;
}

const subjectMap: Record<number, string> = {
  1: "국어",
  2: "수학",
  3: "영어",
  4: "사회",
  5: "과학",
  6: "미술",
  7: "음악",
  8: "체육",
};

const SUBJECTS = [
  { code: 1, name: "국어" },
  { code: 2, name: "수학" },
  { code: 3, name: "영어" },
  { code: 4, name: "사회" },
  { code: 5, name: "과학" },
  { code: 6, name: "미술" },
  { code: 7, name: "음악" },
  { code: 8, name: "체육" },
];

interface Student {
  id: number;
  studentNum: number;
  name: string;
  grade: number;
  classroom: number;
  phoneNum: string;
  birthday: string;
}

interface Parent {
  id: number;
  name: string;
  phoneNum: string;
  birthday: string;
  studentId: number;
}

interface ParentFormInput {
  name: string;
  phoneNum: string;
  birthday: string;
  studentId: number;
}

interface TeacherFormProps {
  initial?: Partial<Teacher>;
  onSubmit: (teacher: Omit<Teacher, "id">) => void;
  onCancel: () => void;
}

const TeacherForm: React.FC<TeacherFormProps> = ({
  initial = {},
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState(initial.name || "");
  const [subject, setSubject] = useState(initial.subject || "");
  const [grade, setGrade] = useState(initial.grade || "");
  const [homeroom, sethomeroom] = useState(initial.homeroom || "");
  const [phoneNum, setPhone] = useState(initial.phoneNum || "");
  const [birthday, setBirth] = useState(initial.birthday || "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, subject, grade, homeroom, phoneNum, birthday });
      }}
    >
      <Input
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "16px",
          border: "1px solid #eaeaea",
          borderRadius: "6px",
          fontSize: "15px",
        }}
      >
        <option value="">담당 과목 선택</option>
        {SUBJECTS.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>
      <Input
        placeholder="학년"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        required
      />
      <Input
        placeholder="반"
        value={homeroom}
        onChange={(e) => sethomeroom(e.target.value)}
        required
      />
      <Input
        placeholder="전화번호"
        value={phoneNum}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <Input
        placeholder="생년월일 (YYYY-MM-DD)"
        value={birthday}
        onChange={(e) => setBirth(e.target.value)}
        required
      />
      <div style={{ textAlign: "right" }}>
        <Button type="submit">저장</Button>
        <Button type="button" className="delete" onClick={onCancel}>
          취소
        </Button>
      </div>
    </form>
  );
};

export const AdminPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<
    "teachers" | "students" | "parents"
  >("teachers");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [modal, setModal] = useState<null | {
    mode: "add" | "edit";
    teacher?: Teacher;
    student?: Student;
    parent?: Parent;
  }>(null);

  useEffect(() => {
    if (selectedTab === "teachers") {
      axios
        .get("/admin/teachers")
        .then((res) => {
          const data = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data.teachers)
              ? res.data.teachers
              : [];
          setTeachers(data);
        })
        .catch((err) => {
          console.error("❌ 불러오기 실패:", err);
        });
    }
  }, [selectedTab]);

  useEffect(() => {
    if (selectedTab === "students") {
      axios
        .get("/students")
        .then((res) => setStudents(res.data))
        .catch((err) => console.error("학생 불러오기 실패:", err));
    }
  }, [selectedTab]);

  useEffect(() => {
    if (selectedTab === "parents") {
      axios
        .get("/parents")
        .then((res) => setParents(res.data))
        .catch((err) => console.error("학부모 불러오기 실패:", err));
    }
  }, [selectedTab]);

  const handleAdd = async (data: Omit<Teacher, "id">) => {
    try {
      const response = await axios.post("/admin/teachers", {
        ...data,
        userId: 1, // 실제 로그인 유저 ID로 교체 필요
      });
      setTeachers([...teachers, response.data]);
    } catch (e) {
      console.error("등록 실패", e);
    }
    setModal(null);
  };

  const handleEdit = async (data: Omit<Teacher, "id">) => {
    if (!modal?.teacher) return;
    try {
      await axios.patch(`/admin/teachers/${modal.teacher.id}`, data);
      setTeachers(
        teachers.map((t) =>
          t.id === modal.teacher!.id ? { ...t, ...data } : t
        )
      );
    } catch (e) {
      console.error("수정 실패", e);
    }
    setModal(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/admin/teachers/${id}`);
      setTeachers(teachers.filter((t) => t.id !== id));
    } catch (e) {
      console.error("삭제 실패", e);
    }
  };

  interface StudentFormProps {
    initial?: Partial<Student>;
    onSubmit: (data: Omit<Student, "id">) => void;
    onCancel: () => void;
  }

  interface ParentFormProps {
    initial?: Partial<Parent>;
    onSubmit: (data: Omit<Parent, "id">) => void;
    onCancel: () => void;
  }

  const StudentForm: React.FC<StudentFormProps> = ({
    initial = {},
    onSubmit,
    onCancel,
  }) => {
    const [studentNum, setStudentNum] = useState(
      initial.studentNum?.toString() || ""
    );
    const [name, setName] = useState(initial.name || "");
    const [grade, setGrade] = useState(initial.grade?.toString() || "");
    const [classroom, setClassroom] = useState(
      initial.classroom?.toString() || ""
    );
    const [phoneNum, setPhoneNum] = useState(initial.phoneNum || "");
    const [birthday, setBirthday] = useState(initial.birthday || "");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({
        studentNum: parseInt(studentNum, 10),
        name,
        grade: parseInt(grade, 10),
        classroom: parseInt(classroom, 10),
        phoneNum,
        birthday,
      });
    };

    return (
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="학번"
          value={studentNum}
          onChange={(e) => setStudentNum(e.target.value)}
          required
        />
        <Input
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder="학년"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          required
        />
        <Input
          placeholder="반"
          value={classroom}
          onChange={(e) => setClassroom(e.target.value)}
          required
        />
        <Input
          placeholder="전화번호"
          value={phoneNum}
          onChange={(e) => setPhoneNum(e.target.value)}
          required
        />
        <Input
          placeholder="생년월일"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
        />
        <div style={{ textAlign: "right" }}>
          <Button type="submit">저장</Button>
          <Button type="button" className="delete" onClick={onCancel}>
            취소
          </Button>
        </div>
      </form>
    );
  };

  const ParentForm: React.FC<ParentFormProps> = ({
    initial = {},
    onSubmit,
    onCancel,
  }) => {
    const [name, setName] = useState(initial.name || "");
    const [studentId, setStudentNum] = useState(
      initial.studentId?.toString() || ""
    );
    const [phoneNum, setPhoneNum] = useState(initial.phoneNum || "");
    const [birthday, setBirthday] = useState(initial.birthday || "");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit({
        name,
        studentId: parseInt(studentId, 10),
        phoneNum,
        birthday,
      });
    };

    return (
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder="자녀"
          value={studentId}
          onChange={(e) => setStudentNum(e.target.value)}
          required
        />
        <Input
          placeholder="전화번호"
          value={phoneNum}
          onChange={(e) => setPhoneNum(e.target.value)}
          required
        />
        <Input
          placeholder="생년월일"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          required
        />
        <div style={{ textAlign: "right" }}>
          <Button type="submit">저장</Button>
          <Button type="button" className="delete" onClick={onCancel}>
            취소
          </Button>
        </div>
      </form>
    );
  };

  const handleStudentEdit = async (id: number, data: Omit<Student, "id">) => {
    try {
      await axios.patch(`/students/${id}`, data);
      setStudents(students.map((s) => (s.id === id ? { ...s, ...data } : s)));
    } catch (e) {
      console.error("학생 수정 실패", e);
    }
    setModal(null);
  };

  const handleStudentDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error("학생 삭제 실패", e);
    }
  };

  const handleParentEdit = async (id: number, data: ParentFormInput) => {
    try {
      await axios.patch(`/parents/${id}`, data);
      setParents(parents.map((s) => (s.id === id ? { ...s, ...data } : s)));
    } catch (e) {
      console.error("학부모 수정 실패", e);
    }
    setModal(null);
  };

  const handleParentDelete = async (id: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/parents/${id}`);
      setParents((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error("학부모 삭제 실패", e);
    }
  };

  return (
    <Container>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title>
          {selectedTab === "teachers"
            ? "교사 관리"
            : selectedTab === "students"
              ? "학생 관리"
              : "학부모 관리"}
        </Title>
        <select
          value={selectedTab}
          onChange={(e) =>
            setSelectedTab(
              e.target.value as "teachers" | "students" | "parents"
            )
          }
          style={{
            fontSize: "16px",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <option value="teachers">교사 관리</option>
          <option value="students">학생 관리</option>
          <option value="parents">학부모 관리</option>
        </select>
      </div>

      {selectedTab === "teachers" ? (
        <>
          <AddButton onClick={() => setModal({ mode: "add" })}>
            + 교사 추가
          </AddButton>
          <Table>
            <thead>
              <tr>
                <Th>이름</Th>
                <Th>담당 과목</Th>
                <Th>학년</Th>
                <Th>반</Th>
                <Th>전화번호</Th>
                <Th>생년월일</Th>
                <Th>관리</Th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <Td>{teacher.name}</Td>
                  <Td>{subjectMap[teacher.subject]}</Td>
                  <Td>{teacher.grade}</Td>
                  <Td>{teacher.homeroom}</Td>
                  <Td>{teacher.phoneNum}</Td>
                  <Td>{teacher.birthday}</Td>
                  <Td>
                    <Button
                      className="edit"
                      onClick={() => setModal({ mode: "edit", teacher })}
                    >
                      수정
                    </Button>
                    <Button
                      className="delete"
                      onClick={() => handleDelete(teacher.id)}
                    >
                      삭제
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          {modal && (
            <ModalBackground>
              <Modal>
                <ModalTitle>
                  {modal.mode === "add" ? "교사 추가" : "교사 정보 수정"}
                </ModalTitle>
                <TeacherForm
                  initial={modal.teacher}
                  onSubmit={modal.mode === "add" ? handleAdd : handleEdit}
                  onCancel={() => setModal(null)}
                />
              </Modal>
            </ModalBackground>
          )}
        </>
      ) : selectedTab === "students" ? (
        <div style={{ marginTop: "32px" }}>
          <p>✅ 학생 관리</p>
          {selectedTab === "students" && (
            <>
              <Table>
                <thead>
                  <tr>
                    <Th>이름</Th>
                    <Th>학번</Th>
                    <Th>학년</Th>
                    <Th>반</Th>
                    <Th>전화번호</Th>
                    <Th>생년월일</Th>
                    <Th>관리</Th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <Td>{student.name}</Td>
                      <Td>{student.studentNum}</Td>
                      <Td>{student.grade}</Td>
                      <Td>{student.classroom}</Td>
                      <Td>{student.phoneNum}</Td>
                      <Td>{student.birthday}</Td>
                      <Td>
                        <Button
                          className="edit"
                          onClick={() => setModal({ mode: "edit", student })}
                        >
                          수정
                        </Button>
                        <Button
                          className="delete"
                          onClick={() => handleStudentDelete(student.id)}
                        >
                          삭제
                        </Button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {modal?.student && (
                <ModalBackground>
                  <Modal>
                    <ModalTitle>학생 정보 수정</ModalTitle>
                    <StudentForm
                      initial={modal.student}
                      onSubmit={(formData) =>
                        handleStudentEdit(modal.student!.id, formData)
                      }
                      onCancel={() => setModal(null)}
                    />
                  </Modal>
                </ModalBackground>
              )}
            </>
          )}
        </div>
      ) : (
        <div style={{ marginTop: "32px" }}>
          <p>✅ 학부모 관리</p>
          {selectedTab === "parents" && (
            <>
              <Table>
                <thead>
                  <tr>
                    <Th>이름</Th>
                    <Th>자녀</Th>
                    <Th>전화번호</Th>
                    <Th>관리</Th>
                  </tr>
                </thead>
                <tbody>
                  {parents.map((parent) => (
                    <tr key={parent.id}>
                      <Td>{parent.name}</Td>
                      <Td>{parent.studentId}</Td>
                      <Td>{parent.phoneNum}</Td>
                      <Td>
                        <Button
                          className="edit"
                          onClick={() => setModal({ mode: "edit", parent })}
                        >
                          수정
                        </Button>
                        <Button
                          className="delete"
                          onClick={() => handleParentDelete(parent.id)}
                        >
                          삭제
                        </Button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {modal?.parent && (
                <ModalBackground>
                  <Modal>
                    <ModalTitle>학부모 정보 수정</ModalTitle>
                    <ParentForm
                      initial={modal.parent}
                      onSubmit={(formData) =>
                        handleParentEdit(modal.parent!.id, formData)
                      }
                      onCancel={() => setModal(null)}
                    />
                  </Modal>
                </ModalBackground>
              )}
            </>
          )}
        </div>
      )}
    </Container>
  );
};
