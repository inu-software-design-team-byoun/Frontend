import React from "react";
import styled from "styled-components";
import BackgroundImage from "../assets/img/LoginBack.png";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  /* padding-top: 6.25rem; */
  /* background-color: white; */

  background-image: url(${BackgroundImage});

  background-size: cover;

  z-index: 2;

  /* 이미지를 컨테이너에 맞게 조절 */
  /* background-size: contain; */
  /* 이미지가 중앙에 오도록 조정 */
  /* background-position: center; */
  /* 반복 방지 */
  /* background-repeat: no-repeat; */
`;

const AuthBody = styled.div`
  width: 100%;
  height: 100%;

  border: 1px solid black;
`;

export const LoginPage: React.FC = () => {
  return (
    <Wrapper>
      <AuthBody></AuthBody>
    </Wrapper>
  );
};
