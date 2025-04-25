import React from "react";
import { useState } from "react";
import styled from "styled-components";
import BackgroundImage from "../assets/img/LoginBack.png";

import { useGoogleLogin } from "@react-oauth/google";

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

  width: 25rem;
  /* height: 18.75rem; */

  display: flex;

  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  font-size: 44px;
  color: white;

  div {
    /* border: 1px solid black; */
    width: 100%;
    height: 8.25rem;
  }

  .lower {
    height: 3rem;
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

const SignButton = styled.button<{ $bgColor: string }>`
  margin-top: 2rem;
  border: none;
  border-radius: 1.25rem;

  width: 10rem;
  height: 3.5rem;

  background-color: ${(props) => props.$bgColor};
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25));

  cursor: pointer;
`;

const SecondaryArea = styled.div`
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  color: white;

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0.5rem 1.5rem;
  }

  p {
    font-size: 1rem;
    margin: 0.25rem 0.5rem;
    color: black;
  }

  a {
    font-size: 1.25rem;
    margin: 0.1rem;
    color: #00ac95;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    cursor: pointer;
  }

  .disabled {
    /* pointer-events: none; // a 링크 비활성화 */
    color: darkgray;
    cursor: not-allowed; // 마우스 커서 모양 지정
  }
`;

const GoogleLoginButton = styled.button`
  margin-top: 1rem;
  border: none;
  border-radius: 1.25rem;

  width: 20rem;
  height: 3.5rem;

  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 1.1rem;
  font-weight: bold;
  color: #4285f4;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25));
  cursor: pointer;

  img {
    width: 1.5rem;
    margin-right: 0.75rem;
  }
`;

export const LoginPage: React.FC = () => {
  // true이면 회원가입 페이지, false이면 로그인 페이지
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("✅ Google Login Success", tokenResponse);

      // access_token 백엔드로 전달
      const res = await fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: tokenResponse.access_token }),
      });

      const result = await res.json();
      console.log("서버 응답:", result);

      // 예: 받은 JWT 저장
      localStorage.setItem("token", result.token);
    },
    onError: (err) => {
      console.error("❌ Google Login Error", err);
    },
  });

  return (
    <Wrapper>
      <AuthBody>
        <LogoBody>
          <div></div>
          <span>Logo</span>
          {isSignUp ? <div className="lower"></div> : <div></div>}
        </LogoBody>
        {isSignUp ? (
          <InputArea>
            <input placeholder="example@company.ac.kr" type="text"></input>
          </InputArea>
        ) : null}
        <InputArea>
          <input placeholder="아이디" type="text"></input>
          {/* <img src={emailIcon} /> */}
        </InputArea>
        <InputArea>
          <input placeholder="비밀번호" type="text"></input>
        </InputArea>
        {isSignUp ? (
          <>
            <InputArea>
              <input placeholder="비밀번호 확인" type="text"></input>
            </InputArea>
            <SignButton $bgColor="#70C776">
              <p>회원가입</p>
            </SignButton>
            <GoogleLoginButton>
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
              />
              Google로 계속하기
            </GoogleLoginButton>
          </>
        ) : (
          <>
            <SignButton $bgColor="#3BA8F0">
              <p>로그인</p>
            </SignButton>
            <GoogleLoginButton onClick={loginWithGoogle}>
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt="Google logo"
              />
              Google로 계속하기
            </GoogleLoginButton>
          </>
        )}

        {isSignUp ? (
          <SecondaryArea>
            <div>
              <p>이미 계정이 있으신가요?</p>
              <a onClick={toggleSignUp}>로그인 하기</a>
            </div>
          </SecondaryArea>
        ) : (
          <SecondaryArea>
            <div>
              <p>비밀번호를 잊으셨나요?</p>
              <a className="disabled">비밀번호 찾기</a>
            </div>
            <div>
              <p>아직 계정이 없으신가요?</p>
              <a onClick={toggleSignUp}>회원가입</a>
            </div>
          </SecondaryArea>
        )}
      </AuthBody>
    </Wrapper>
  );
};
