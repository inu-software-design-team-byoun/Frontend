// AddinfoPage.tsx
import React from "react";
import styled from "styled-components";
import BackgroundImage from "../assets/img/LoginBack.png";
import hieduLogo from "../assets/img/hieduLogo.svg";
import CloudImage from "../assets/img/CloudForLogo.svg";

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

  margin: 4.75rem 0 2.5rem 0;

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

const InputArea = styled.div`
  width: 25rem;
  height: 4rem;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  margin: 1rem 0;
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
  }

  input:focus {
    outline: none;
  }
`;

export const AddinfoPage: React.FC = () => {
  return (
    <Wrapper>
      <AuthBody>
        <LogoBody>
          <img className="lower" src={CloudImage} />
          <img className="higher" src={hieduLogo} />
        </LogoBody>
        <InputArea>
          <input placeholder="example@company.ac.kr" type="text"></input>
        </InputArea>

        <InputArea>
          <input placeholder="아이디" type="text"></input>
        </InputArea>
        <InputArea>
          <input placeholder="비밀번호" type="text"></input>
        </InputArea>
      </AuthBody>
    </Wrapper>
  );
};
