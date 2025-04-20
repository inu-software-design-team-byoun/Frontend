import React from "react";
import styled from "styled-components";
import bookIcon from "../assets/bookIcon.svg";
import listIcon from "../assets/listIcon.svg";
import scoreIcon from "../assets/scoreIcon.svg";
import userIcon from "../assets/userIcon.svg";
import settingIcon from "../assets/settingIcon.svg";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const goToMain = () => {
    navigate("/");
  };

  const goToAttendance = () => {
    navigate("/attendance");
  };

  return (
    <MainWrapper>
      <SideBarArea>
        <SideBar>
          <UserNameBox>
            <UserLastName>
              <span>앨</span>
            </UserLastName>
            <UserRole>
              <span className="name">앨런 튜링</span>
              <span> 선생님</span>
            </UserRole>
          </UserNameBox>
          <MainMenuBox>
            <span className="menurole">메인메뉴</span>
            <MenuTab $enabled={true}>
              <div>
                <img src={scoreIcon} />
              </div>
              <span className="menuname" onClick={goToMain}>
                성적
              </span>
            </MenuTab>
            <MenuTab $enabled={false}>
              <div>
                <img src={bookIcon} />
              </div>

              <span className="menuname" onClick={goToAttendance}>
                학생부
              </span>
            </MenuTab>
            <MenuTab $enabled={false}>
              <div>
                <img src={listIcon} />
              </div>
              <span className="menuname">상담내역</span>
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
