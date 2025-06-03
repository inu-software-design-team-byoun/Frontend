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

export interface Student {
    id: string;
    name: string;
    grade: number;
    classNumber: number;
    studentNumber: number;
    birthday: string;
    phoneNum: string;
}

export const StudentPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        axios.get("/students")
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : res.data.students ?? [];
                setStudents(data);
            })
            .catch((err) => {
                console.error("학생 목록 불러오기 실패:", err);
            });
    }, []);

    return (
        <Container>
            <Title>학생 관리</Title>
            <Table>
                <thead>
                    <tr>
                        <Th>이름</Th>
                        <Th>학년</Th>
                        <Th>반</Th>
                        <Th>번호</Th>
                        <Th>생년월일</Th>
                        <Th>전화번호</Th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((s) => (
                        <tr key={s.id}>
                            <Td>{s.name}</Td>
                            <Td>{s.grade}</Td>
                            <Td>{s.classNumber}</Td>
                            <Td>{s.studentNumber}</Td>
                            <Td>{s.birthday}</Td>
                            <Td>{s.phoneNum}</Td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};
