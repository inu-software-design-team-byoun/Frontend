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
  classNumber: string;
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

const reverseSubjectMap: Record<string, number> = {
  "국어": 1,
  "수학": 2,
  "영어": 3,
  "사회": 4,
  "과학": 5,
  "미술": 6,
  "음악": 7,
  "체육": 8,
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
  const [classNumber, setClassNumber] = useState(initial.classNumber || "");
  const [phoneNum, setPhone] = useState(initial.phoneNum || "");
  const [birthday, setBirth] = useState(initial.birthday || "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, subject, grade, classNumber, phoneNum, birthday });
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
        value={classNumber}
        onChange={(e) => setClassNumber(e.target.value)}
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
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [modal, setModal] = useState<null | {
    mode: "add" | "edit";
    teacher?: Teacher;
  }>(null);

  useEffect(() => {
    axios.get("/admin/teachers")
      .then((res) => {
        console.log("📦 raw res:", res);
        console.log("📄 res.data:", res.data);

        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.teachers)
            ? res.data.teachers
            : [];

        console.log("✅ 최종 teachers 배열:", data);

        setTeachers(data);
      })
      .catch((err) => {
        console.error("❌ 불러오기 실패:", err);
      });
  }, []);


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

  return (
    <Container>
      <Title>교사 관리</Title>
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
              <Td>{teacher.classNumber}</Td>
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
    </Container>
  );
};
