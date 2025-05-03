// AddinfoPage.tsx
import React, { useState } from "react";
import styled from "styled-components";

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

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  /* padding-top: 6.25rem; */
  /* background-color: white; */

  background-image: url(${BackgroundImage});
  background-size: cover;

  /* 이미지를 컨테이너에 맞게 조절 */
  /* background-size: contain; */
  /* 이미지가 중앙에 오도록 조정 */
  /* background-position: center; */
  /* 반복 방지 */
  /* background-repeat: no-repeat; */

  display: flex;
  justify-content: center;
`;

const AuthBody = styled.div`
  /* border: 1px solid black; */

  width: 25rem; // 400px
  height: 100vh;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoBody = styled.div`
  /* border: 1px solid black; */
  position: relative;

  margin: 4.5rem 0 1.25rem 0;

  width: 25rem;
  height: 13.125rem;

  align-items: center;
  font-size: 44px;
  color: white;

  div {
    /* border: 1px solid black; */
    width: 100%;
    height: 8.25rem;
  }

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
  margin: 0.25rem 0 0.25rem 0;

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
  /* border: 1px solid black; */
  width: 22.25rem;
  height: 3.5;
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

  &:focus {
    outline: none;
    /* border-color: black; */
  }

  appearance: none; // 브라우저 기본 스타일 제거
  -webkit-appearance: none;
  background-color: white;

  background-image: url(${SelectArrow});
  background-repeat: no-repeat;
  background-position: right 1.25rem center;
  background-size: 1rem;

  // placeholder 스타일처럼 기본값일 때 회색으로 만들기
  color: ${(props) => (props.$isNone ? "#757575" : "black")};
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
    color: black;
    border: none;
    width: 20rem;
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
  const [role, setRole] = useState("student");
  const [grade, setGrade] = useState("none");
  const [classNum, setClassNum] = useState("none");
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [birthday, setBirthday] = useState("");

  const formatPhone = (input: string) => {
    const numbersOnly = input.replace(/\D/g, ""); // 숫자만 추출
    if (numbersOnly.length <= 3) return numbersOnly;
    if (numbersOnly.length <= 7)
      return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
  };

  const formatBirthday = (input: string) => {
    const numbersOnly = input.replace(/\D/g, ""); // 숫자만 추출
    if (numbersOnly.length <= 4) return numbersOnly;
    if (numbersOnly.length <= 6)
      return `${numbersOnly.slice(0, 4)}-${numbersOnly.slice(4)}`;
    return `${numbersOnly.slice(0, 4)}-${numbersOnly.slice(4, 6)}-${numbersOnly.slice(6, 8)}`;
  };

  // const isFormValid =
  //   grade !== "none" &&
  //   classNum !== "none" &&
  //   name.trim() !== "" &&
  //   studentId.trim() !== "" &&
  //   phoneNum.trim() !== "" &&
  //   birthday.trim() !== "";
  const isFormValid =
    name.trim() !== "" &&
    phoneNum.trim() !== "" &&
    birthday.trim() !== "" &&
    (role !== "student" ||
      (grade !== "none" && classNum !== "none" && studentId.trim() !== ""));

  const handleSubmit = async () => {
    const payload = {
      grade,
      classNum,
      name,
      studentId,
      phoneNum,
      birthday,
    };

    try {
      const res = await fetch("/api/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("등록 실패");
      alert("성공적으로 회원가입되셨습니다.");
    } catch (error) {
      alert("가입 과정에서 오류가 발생하였습니다: " + error);
    }
  };

  return (
    <Wrapper>
      <BtnForDev link="/login" />
      <AuthBody>
        <LogoBody>
          <img className="lower" src={CloudImage} />
          <img className="higher" src={hieduLogo} />
        </LogoBody>
        <RoleSelect>
          <label>
            <input
              type="radio"
              value="student"
              checked={role === "student"}
              onChange={(e) => setRole(e.target.value)}
            />
            학생
          </label>
          <label>
            <input
              type="radio"
              value="teacher"
              checked={role === "teacher"}
              onChange={(e) => setRole(e.target.value)}
            />
            선생
          </label>
          <label>
            <input
              type="radio"
              value="parent"
              checked={role === "parent"}
              onChange={(e) => setRole(e.target.value)}
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
              <img src={studentIcon} />
            </InputArea>
          </>
        )}
        <InputArea>
          <input
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <img src={nameIcon} />
        </InputArea>
        {role === "parent" && (
          <InputArea>
            <input
              placeholder="자녀 학번"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
            <img src={studentIcon} />
          </InputArea>
        )}
        <InputArea>
          <input
            placeholder="전화번호 11자리 '-' 없이 입력"
            value={phoneNum}
            onChange={(e) => setPhoneNum(formatPhone(e.target.value))}
          ></input>
          <img src={phoneIcon} />
        </InputArea>
        <InputArea>
          <input
            placeholder="생년월일 8자리 '-' 없이 입력"
            value={birthday}
            onChange={(e) => setBirthday(formatBirthday(e.target.value))}
            // type="date"
          ></input>
          <img src={birthdayIcon} />
        </InputArea>

        <SignButton
          $bgColor="#3BA8F0"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          <p>입력 완료</p>
        </SignButton>
      </AuthBody>
    </Wrapper>
  );
};
