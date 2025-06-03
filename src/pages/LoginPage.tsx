import React, { useEffect } from "react";
import styled from "styled-components";
import BackgroundImage from "../assets/img/LoginBack.png";
import hieduLogo from "../assets/img/hieduLogo.svg";
import CloudImage from "../assets/img/CloudForLogo.svg";
import ContinueWithGoogleButton from "../assets/img/ContinueWithGoogleButton.svg";
import { ENDPOINTS } from "../constants/api";

import { BtnForDev } from "../components/BtnForDev";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";
// import { useGoogleLogin } from "@react-oauth/google";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;

  background-image: url(${BackgroundImage});
  background-size: cover;

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
  const userId = useAuthStore((state) => state.userId);

  const navigate = useNavigate();

  // URL에 ?token=xxx 가 있으면 저장하고 addinfo로 이동
  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (!token) return;

      try {
        const res = await fetch(ENDPOINTS.check + `?token=${token}`);
        const result = await res.json();

        useAuthStore
          .getState()
          .setAuth(result.id, result.name, result.role, token);

        if (result.exists) {
          navigate("/"); // 유저가 있으면 메인페이지로
        } else {
          navigate("/addinfo");
        }
      } catch (e) {
        console.error("check-user 요청 실패", e);
      }
    };

    checkTokenAndRedirect();
  }, [navigate]);

  // React 컴포넌트는 다음 렌더링 주기에서 userId를 반영하므로 출력용 useEffect를 따로 구현
  useEffect(() => {
    console.log("현재 로그인한 유저 id:", userId);
  }, [userId]);

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
