import React from "react";
import styled from "styled-components";
import bookIcon from "../assets/bookIcon.svg";
import listIcon from "../assets/listIcon.svg";
import scoreIcon from "../assets/scoreIcon.svg";
import userIcon from "../assets/userIcon.svg";
import settingIcon from "../assets/settingIcon.svg";
import pencilIcon from "../assets/icon/pencilIcon.svg";
import BellIcon from "../assets/icon/BellIcon.svg?react";

import { useNavigate, useLocation } from "react-router-dom";

const BellImg = styled(BellIcon)`
  /* color: black; */
  color: #787878;
  height: 20px;
`;

export const MainWrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #f1feff;

  display: flex;
  flex-direction: row;
`;

export const SideBarArea = styled.div`
  width: 312px; // Sidebar랑 좀 안맞음. fixed라서 그런듯
  height: 100vh;
`;

export const SideBar = styled.div`
  position: fixed; // 브라우저의 전체화면(viewport)를 기준으로 html 요소 배치. 부모 요소로부터 완전히 독립

  margin: 3rem 2.5rem;
  width: 14.5rem;
  /* height: 50.25rem; */
  height: 89vh;
  border-radius: 1.5rem;
  filter: drop-shadow(0 0 2em #d3d3d3);

  background-color: white;

  display: flex;
  flex-direction: column;
  align-items: center;

  .menurole {
    font-size: 0.75rem;
    color: #5f5f5f;
    font-weight: bold;
    margin-left: 0.25rem;
    margin-bottom: 0.75rem;
  }

  .menuname {
    font-size: 1rem;
    color: #5f5f5f;
    font-weight: bold;
  }
`;

export const UserNameBox = styled.div`
  margin: 1.75rem 1.5rem;
  width: 11.5rem; //184px
  height: 2rem;
  /* border: 1px black solid; */

  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const UserLastName = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background-color: #86acff;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
`;

export const UserRole = styled.span`
  margin-left: 1rem;

  line-height: center;
  font-size: 1rem;
  color: black;

  .name {
    font-weight: bold;
  }
`;

const NotificationButton = styled.button`
  /* justify-self: end; // flex-box내에서 이거 안됨 */
  margin-left: auto; // 해당 요소에 좌측 마진을 자동으로 채워라

  border: none;
  /* background-color: transparent; */
  background-color: #d9d9d9;

  border-radius: 2rem;

  width: 2rem;
  height: 2rem;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  transition: transform 0.2s ease-in-out;

  /* hover 상태일 때, 내부 Bellimg 에 적용 */
  &:hover ${BellImg} {
    color: #ffac33; /* 색상 변경 */
  }
`;

export const MainMenuBox = styled.div`
  margin-top: 0.25rem;
  width: 11.5rem; //184px
  height: 28rem;
  /* border: 1px solid black; */

  color: #5f5f5f;

  display: flex;
  flex-direction: column;
`;

export const AccountMenuBox = styled.div`
  margin-top: 0.25rem;
  width: 11.5rem; //184px
  height: 11rem;
  /* border: 1px solid black; */

  display: flex;
  flex-direction: column;
`;

export const MenuTab = styled.div<{ $enabled: boolean }>`
  margin: 0.25rem 0;
  width: 11.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background-color: ${(props) => (props.$enabled ? "#dedede" : "white")};

  display: flex;
  align-items: center;

  div {
    width: 3.25rem;
    height: 1.25rem;
    /* border: solid 1px black; */

    display: flex;
    justify-content: center;
  }

  cursor: pointer;

  &:hover {
    transition: 0.2s;
    background-color: #dedede;
  }
`;

export const MainArea = styled.main`
  padding-top: 3rem;
  /* width: 79vw; */
  width: 75rem; //1200px
  /* height: 100vh; */
  height: 800px;
  flex: 1;
  display: flex;
  flex-direction: column;

  /* border-left: black 1px solid; */
`;

type MainLayoutProps = {
  children: React.ReactNode;
  ref?: string;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, ref }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navigate = useNavigate();

  const goToMain = () => {
    navigate("/");
  };

  const goToAttendance = () => {
    navigate("/attendance");
  };

  const goToScoreInput = () => {
    navigate("/scoreinput");
  };

  return (
    <MainWrapper>
      <SideBarArea>
        <SideBar>
          <UserNameBox>
            <UserLastName>
              <span>비</span>
            </UserLastName>
            <UserRole>
              <span className="name">비제이</span>
              <span> 선생님</span>
            </UserRole>
            <NotificationButton>
              <BellImg />
            </NotificationButton>
          </UserNameBox>

          <MainMenuBox>
            <span className="menurole">메인메뉴</span>
            <MenuTab $enabled={currentPath === "/"} onClick={goToMain}>
              <div>
                <img src={scoreIcon} />
              </div>
              <span className="menuname">성적</span>
            </MenuTab>
            <MenuTab
              $enabled={currentPath === "/attendance"}
              onClick={goToAttendance}
            >
              <div>
                <img src={bookIcon} />
              </div>
              <span className="menuname">출석부</span>
            </MenuTab>
            <MenuTab $enabled={currentPath === "/counsel"}>
              <div>
                <img src={listIcon} />
              </div>
              <span className="menuname">상담내역</span>
            </MenuTab>
            <MenuTab
              $enabled={currentPath === "/scoreinput"}
              onClick={goToScoreInput}
            >
              <div>
                <img src={pencilIcon} />
              </div>
              <span className="menuname">성적 입력</span>
            </MenuTab>
          </MainMenuBox>
          <AccountMenuBox>
            <span className="menurole">설정</span>
            <MenuTab $enabled={false}>
              <div>
                <img src={userIcon} />
              </div>
              <span className="menuname">사용자계정</span>
            </MenuTab>
            <MenuTab $enabled={false}>
              <div>
                <img src={settingIcon} />
              </div>
              <span className="menuname">설정</span>
            </MenuTab>
          </AccountMenuBox>
        </SideBar>
      </SideBarArea>
      <MainArea>{children}</MainArea>
    </MainWrapper>
  );
};

export default MainLayout;
