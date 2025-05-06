import React from "react";
import styled from "styled-components";
import BackgroundImage from "../assets/img/LoginBack.png";
import hieduLogo from "../assets/img/hieduLogo.svg";
import CloudImage from "../assets/img/CloudForLogo.svg";
import ContinueWithGoogleButton from "../assets/img/ContinueWithGoogleButton.svg";
import { ENDPOINTS } from "../constants/api";

import { BtnForDev } from "../components/BtnForDev";
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

const GoogleLoginButton = styled.button`
  margin-top: 6rem;
  border: none;
  border-radius: 1.25rem;

  width: 20rem;
  height: 3.5rem;

  background: none;
  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;

  img {
    border: none;
    /* width: 1.5rem; */
    margin-right: 0.75rem;
  }
`;

export const LoginPage: React.FC = () => {
  // const loginWithGoogle = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     console.log("✅ Google Login Success", tokenResponse);

  //     // access_token 백엔드로 전달
  //     const res = await fetch("http://localhost:3000/api/auth/google", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ accessToken: tokenResponse.access_token }),
  //     });

  //     const result = await res.json();
  //     console.log("서버 응답:", result);

  //     // 예: 받은 JWT 저장
  //     localStorage.setItem("token", result.token);
  //   },
  //   onError: (err) => {
  //     console.error("❌ Google Login Error", err);
  //   },
  // });

  const loginWithGoogle = () => {
    // window.location.href = "https://hiedu.site/api/auth/google";
    window.location.href = ENDPOINTS.auth;
    console.log("Google Login Clicked");
  };

  return (
    <Wrapper>
      <BtnForDev link="/addinfo" />
      <AuthBody>
        <LogoBody>
          <img className="lower" src={CloudImage} />
          <img className="higher" src={hieduLogo} />
        </LogoBody>
        {/* <GoogleLoginButton onClick={() => loginWithGoogle()}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
          />
          Google로 계속하기
        </GoogleLoginButton> */}
        <GoogleLoginButton onClick={loginWithGoogle}>
          <img src={ContinueWithGoogleButton} />
        </GoogleLoginButton>
      </AuthBody>
    </Wrapper>
  );
};
