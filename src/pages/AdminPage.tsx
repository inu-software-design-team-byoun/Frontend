import React, { useState } from "react";
import styled from "styled-components";

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
  phone: string;
  birth: string;
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
  const [classNumber, setClassNumber] = useState(initial.classNumber || "");
  const [phone, setPhone] = useState(initial.phone || "");
  const [birth, setBirth] = useState(initial.birth || "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, subject, grade, classNumber, phone, birth });
      }}
    >
      <Input
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        placeholder="담당 과목"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
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
        value={classNumber}
        onChange={(e) => setClassNumber(e.target.value)}
        required
      />
      <Input
        placeholder="전화번호"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <Input
        placeholder="생년월일 (YYYY-MM-DD)"
        value={birth}
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
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: "1",
      name: "홍길동",
      subject: "수학",
      grade: "1",
      classNumber: "2",
      phone: "010-1234-5678",
      birth: "1980-01-01",
    },
    {
      id: "2",
      name: "김철수",
      subject: "영어",
      grade: "2",
      classNumber: "1",
      phone: "010-2345-6789",
      birth: "1982-03-15",
    },
  ]);
  const [modal, setModal] = useState<null | {
    mode: "add" | "edit";
    teacher?: Teacher;
  }>(null);

  const handleAdd = (data: Omit<Teacher, "id">) => {
    setTeachers([...teachers, { ...data, id: Date.now().toString() }]);
    setModal(null);
  };

  const handleEdit = (data: Omit<Teacher, "id">) => {
    if (!modal?.teacher) return;
    setTeachers(
      teachers.map((t) => (t.id === modal.teacher!.id ? { ...t, ...data } : t))
    );
    setModal(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setTeachers(teachers.filter((t) => t.id !== id));
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
              <Td>{teacher.subject}</Td>
              <Td>{teacher.grade}</Td>
              <Td>{teacher.classNumber}</Td>
              <Td>{teacher.phone}</Td>
              <Td>{teacher.birth}</Td>
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
