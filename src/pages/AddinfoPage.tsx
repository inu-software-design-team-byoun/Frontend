// src/pages/AddinfoPage.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";

// images, icons
import BackgroundImage from "../assets/img/LoginBack.png";
import hieduLogo from "../assets/img/hieduLogo.svg";
import CloudImage from "../assets/img/CloudForLogo.svg";
import nameIcon from "../assets/icon/nameIcon.svg";
import studentIcon from "../assets/icon/studentIcon.svg";
import phoneIcon from "../assets/icon/phoneIcon.svg";
import birthdayIcon from "../assets/icon/birthdayIcon.svg";
import SelectArrow from "../assets/icon/SelectArrow.png";

// components
import { BtnForDev } from "../components/BtnForDev";

// api
import { ENDPOINTS } from "../constants/api";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(${BackgroundImage});
  background-size: cover;
  display: flex;
  justify-content: center;
`;

const AuthBody = styled.div`
  width: 25rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoBody = styled.div`
  position: relative;
  margin: 4.5rem 0 1.25rem 0;
  width: 25rem;
  height: 13.125rem;
  align-items: center;
  font-size: 44px;
  color: white;

  .lower {
    position: absolute;
    z-index: 1;
    width: 100%;
  }

  .higher {
    position: absolute;
    z-index: 2;
    width: 15.875rem;
    top: 2.625rem;
    left: 5rem;
  }
`;

const RoleSelect = styled.div`
  display: flex;
  gap: 1rem;
  margin: 0.25rem 0;
  label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: white;
    margin: 0 0.5rem;
  }
  input[type="radio"] {
    transform: scale(1.25);
    margin: 0;
  }
`;

const DropdownArea = styled.div`
  width: 22.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.75rem 0;
  font-size: 1.25rem;
`;

const StyledSelect = styled.select<{ $isNone: boolean }>`
  width: 9rem;
  height: 3.75rem;
  border: none;
  border-radius: 1.5rem;
  font-size: 1.25rem;
  font-weight: 500;
  padding-left: 1.75rem;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25));
  appearance: none;
  background-color: white;
  background-image: url(${SelectArrow});
  background-repeat: no-repeat;
  background-position: right 1.25rem center;
  background-size: 1rem;
  color: ${(props) => (props.$isNone ? "#757575" : "black")};
  &:focus {
    outline: none;
  }
`;

const InputArea = styled.div`
  width: 22.25rem;
  height: 4rem;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  margin: 0.75rem 0;
  border-radius: 1.5rem;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25));
  font-size: 1.25rem;
  input {
    flex: 1;
    color: black;
    border: none;
    margin-left: 1.75rem;
    background-color: transparent;
    font-size: 1.25rem;
    font-weight: 500;
  }
  input:focus {
    outline: none;
  }
  img {
    width: 1.5rem;
    margin-right: 1.5rem;
  }
`;

const SignButton = styled.button<{ $bgColor: string }>`
  margin-top: 1.25rem;
  border: none;
  border-radius: 1.25rem;
  width: 10rem;
  height: 3.5rem;
  background-color: ${(props) => (props.disabled ? "#a9a9a9" : props.$bgColor)};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25));
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
`;

export const AddinfoPage: React.FC = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState<"student" | "teacher" | "parent">("student");
  const [grade, setGrade] = useState("none");
  const [classNum, setClassNum] = useState("none");
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [birthday, setBirthday] = useState("");

  const formatPhone = (input: string) => {
    const nums = input.replace(/\D/g, "");
    if (nums.length <= 3) return nums;
    if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
    return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7, 11)}`;
  };

  const formatBirthday = (input: string) => {
    const nums = input.replace(/\D/g, "");
    if (nums.length <= 4) return nums;
    if (nums.length <= 6) return `${nums.slice(0, 4)}-${nums.slice(4)}`;
    return `${nums.slice(0, 4)}-${nums.slice(4, 6)}-${nums.slice(6, 8)}`;
  };

  const isFormValid =
    name.trim() !== "" &&
    phoneNum.trim() !== "" &&
    birthday.trim() !== "" &&
    (role !== "student" ||
      (grade !== "none" && classNum !== "none" && studentId.trim() !== ""));

  const handleSubmit = async () => {
    // const token = localStorage.getItem("accessToken"); // 이건 구글에서 주는 토큰인거같고
    const token = useAuthStore.getState().accessToken; // 이건 백엔드가 주는 토큰(애초에 개발자도구에 안보임. zustand)

    console.log("stored:", token);

    if (!token) {
      alert("로그인 정보가 없음");
      return;
    }

    const url = role === "teacher" ? ENDPOINTS.teachers : ENDPOINTS.students;
    // const url = ENDPOINTS.teachers;
    const bodyData =
      role === "teacher"
        ? {
            name,
            birthday,
            phoneNum,
          }
        : {
            role,
            name,
            phoneNum,
            birthday,
            ...(role === "student" && {
              grade,
              classNum,
              studentId,
            }),
            ...(role === "parent" && { studentId }),
          };

    // const token = localStorage.getItem("token");

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) throw new Error("등록 실패");
      alert("성공적으로 등록되었습니다.");
      navigate("/");
    } catch (error) {
      alert("등록 중 오류 발생: " + error);
    }
  };

  return (
    <Wrapper>
      <BtnForDev link="/login" />
      <AuthBody>
        <LogoBody>
          <img className="lower" src={CloudImage} alt="cloud" />
          <img className="higher" src={hieduLogo} alt="logo" />
        </LogoBody>

        <RoleSelect>
          <label>
            <input
              type="radio"
              value="student"
              checked={role === "student"}
              onChange={() => setRole("student")}
            />
            학생
          </label>
          <label>
            <input
              type="radio"
              value="teacher"
              checked={role === "teacher"}
              onChange={() => setRole("teacher")}
            />
            선생
          </label>
          <label>
            <input
              type="radio"
              value="parent"
              checked={role === "parent"}
              onChange={() => setRole("parent")}
            />
            학부모
          </label>
        </RoleSelect>

        {role === "student" && (
          <>
            <DropdownArea>
              <StyledSelect
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                $isNone={grade === "none"}
              >
                <option value="none" disabled>
                  학년
                </option>
                <option value="1">1학년</option>
                <option value="2">2학년</option>
                <option value="3">3학년</option>
              </StyledSelect>
              <StyledSelect
                value={classNum}
                onChange={(e) => setClassNum(e.target.value)}
                $isNone={classNum === "none"}
              >
                <option value="none" disabled>
                  반
                </option>
                <option value="1">1반</option>
                <option value="2">2반</option>
                <option value="3">3반</option>
                <option value="4">4반</option>
                <option value="5">5반</option>
                <option value="6">6반</option>
              </StyledSelect>
            </DropdownArea>
            <InputArea>
              <input
                placeholder="학번"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
              <img src={studentIcon} alt="student icon" />
            </InputArea>
          </>
        )}

        <InputArea>
          <input
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <img src={nameIcon} alt="name icon" />
        </InputArea>

        {role === "parent" && (
          <InputArea>
            <input
              placeholder="자녀 학번"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <img src={studentIcon} alt="student icon" />
          </InputArea>
        )}

        <InputArea>
          <input
            placeholder="전화번호 11자리 '-' 없이 입력"
            value={phoneNum}
            onChange={(e) => setPhoneNum(formatPhone(e.target.value))}
          />
          <img src={phoneIcon} alt="phone icon" />
        </InputArea>

        <InputArea>
          <input
            placeholder="생년월일 8자리 '-' 없이 입력"
            value={birthday}
            onChange={(e) => setBirthday(formatBirthday(e.target.value))}
          />
          <img src={birthdayIcon} alt="birthday icon" />
        </InputArea>

        <SignButton
          $bgColor="#3BA8F0"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          입력 완료
        </SignButton>
      </AuthBody>
    </Wrapper>
  );
};
