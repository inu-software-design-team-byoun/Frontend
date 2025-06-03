// MainLayout.tsx
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import bookIcon from "../assets/bookIcon.svg";
import listIcon from "../assets/listIcon.svg";
import scoreIcon from "../assets/scoreIcon.svg";
import userIcon from "../assets/userIcon.svg";
import settingIcon from "../assets/settingIcon.svg";
import pencilIcon from "../assets/icon/pencilIcon.svg";
import dashboardIcon from "../assets/icon/dashboardIcon.svg";
import BellIcon from "../assets/icon/BellIcon.svg?react";
import DeleteIcon from "../assets/icon/DeleteIcon.svg";

import { NotiPopOver } from "../components/NotiPopOver";
import {
  useNotificationSocket,
  NotificationPayload,
} from "../hooks/useNotificationSocket";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";
import { StudentRecordModal } from "../components/StudentRecordModal";

type MainLayoutProps = {
  children: React.ReactNode;
  // ref?: string;
};

const wsUrl = import.meta.env.VITE_BACKEND_WS_URL;

// Notification 타입 정의
interface Notification {
  id: number;
  date: string;
  text: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const userId = useAuthStore((state) => state.userId);
  const userName = useAuthStore((state) => state.userName);
  const role = useAuthStore((state) => state.role);
  const teacherName = useAuthStore((state) => state.teacherName);
  // 조회할 때만 필요한 변수. 필요시 주석해제
  // const teacherGrade = useAuthStore((state) => state.teacherGrade);
  // const teacherClassroom = useAuthStore((state) => state.teacherClassroom);

  const setUserId = useAuthStore((state) => state.setUserId);
  const setUserName = useAuthStore((state) => state.setUserName);
  const setRole = useAuthStore((state) => state.setRole);
  const setTeacherName = useAuthStore((state) => state.setTeacherName);
  const setTeacherGrade = useAuthStore((state) => state.setTeacherGrade);
  const setTeacherClassroom = useAuthStore(
    (state) => state.setTeacherClassroom
  );

  const clearAuth = useAuthStore((state) => state.clearAuth);
  const token = useAuthStore.getState().accessToken;

  const fetchUserId = async () => {
    try {
      if (!token) return;
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/userId`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }
      const data = await response.json();
      console.log("/auth/userId 응답:", data);

      // 1-1) userId, userName, role 저장
      setUserId(data.userId);
      setUserName(data.name);
      setRole(data.role);

      // 1-2) role이 'teacher'일 때만 teacherInfo.name 저장
      if (data.role === "teacher" && data.teacherInfo?.name) {
        setTeacherName(data.teacherInfo.name);
        setTeacherGrade(data.teacherInfo.grade);
        setTeacherClassroom(data.teacherInfo.homeroom);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  // 그전 영역
  const [showNoti, setShowNoti] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // 컴포넌트 내부
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const toggleNoti = () => setShowNoti((prev) => !prev);

  const location = useLocation();
  const currentPath = location.pathname;

  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  const goToMain = () => {
    navigate("/");
  };

  const goToAttendance = () => {
    navigate("/attendance");
  };
  const goToCounsel = () => {
    navigate("/counsel");
  };

  const goToScoreInput = () => {
    navigate("/scoreinput");
  };

  const goToFeedback = () => {
    navigate("/feedback");
  };

  // 알림 관련
  // 문서 전체 클릭을 감지한 뒤, 그 클릭이 Wrapper 바깥이면 showNoti = false로 변경
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowNoti(false);
      }
    }
    if (showNoti) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNoti]);

  // 알림 소켓 연결 (커스텀 훅 사용)
  useNotificationSocket({
    userId: String(userId),
    wsUrl,
    onNotification: (data: NotificationPayload) => {
      const formattedDate = new Date(data.date).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === data.id);
        if (exists) return prev; // 중복이면 추가 안 함

        return [
          {
            id: data.id,
            date: formattedDate,
            text: data.message,
          },
          ...prev,
        ];
      });
    },
  });

  // 단일 삭제 (백엔드 연동)
  const deleteOne = async (id: number) => {
    await fetch(
      `${import.meta.env.VITE_BACKEND_API_BASE_URL}/notifications/${id}`,
      {
        method: "DELETE",
      }
    );
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // 전체 삭제 (백엔드 연동)
  const deleteAll = async () => {
    await fetch(
      `${import.meta.env.VITE_BACKEND_API_BASE_URL}/notifications/user/${userId}`,
      {
        method: "DELETE",
      }
    );
    setNotifications([]);
  };

  // 모달 관련
  const [showStudentModal, setShowStudentModal] = useState(false);

  return (
    <MainWrapper>
      <SideBarArea>
        <SideBar>
          <UserNameBox>
            {role === "teacher" ? (
              <>
                <UserLastName>
                  <span>{teacherName ? teacherName.charAt(0) : ""}</span>
                </UserLastName>
                <UserRole>
                  {teacherName && (
                    <>
                      <span className="name">{teacherName}</span>
                      <span> 선생님</span>
                    </>
                  )}
                </UserRole>
              </>
            ) : (
              // student나 parent 등 일반 사용자라면 userName만 보여주기
              <>
                <UserLastName>
                  <span>{userName ? userName.charAt(0) : ""}</span>
                </UserLastName>
                <UserRole>
                  {userName && <span className="name">{userName}</span>}
                  {/* 
                    필요하다면 role이 student면 “학생” 찍고, parent면 “학부모” 찍어도 됩니다.
                    예: <span> 학생</span> 또는 <span> 학부모</span> 
                  */}
                </UserRole>
              </>
            )}
            <NotificationWrapper ref={wrapperRef}>
              <NotificationButton onClick={toggleNoti}>
                <BellImg />
              </NotificationButton>
              <NotiPopOver $visible={showNoti}>
                <NotiHeader>알림</NotiHeader>
                <NotiContent>
                  {notifications.map((n) => (
                    <NotiItem key={n.id}>
                      <span>{n.date}</span>
                      <DeleteBtn onClick={() => deleteOne(n.id)}>
                        <img src={DeleteIcon} />
                      </DeleteBtn>
                      <p>{n.text}</p>
                    </NotiItem>
                  ))}
                </NotiContent>
                {notifications.length > 0 ? (
                  <ClearAllBtn onClick={deleteAll}>모두 지우기</ClearAllBtn>
                ) : (
                  <EmptyMsg>표시할 알림이 없습니다.</EmptyMsg>
                )}
              </NotiPopOver>
            </NotificationWrapper>
          </UserNameBox>

          <MainMenuBox>
            <span className="menurole">메인메뉴</span>
            <MenuTab $enabled={currentPath === "/"} onClick={goToMain}>
              <div>
                <img src={dashboardIcon} />
              </div>
              <span className="menuname">대시보드</span>
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
            <MenuTab
              $enabled={currentPath === "/counsel"}
              onClick={goToCounsel}
            >
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
                <img src={scoreIcon} />
              </div>
              <span className="menuname">성적</span>
            </MenuTab>
            <MenuTab
              $enabled={currentPath === "/feedback"}
              onClick={goToFeedback}
            >
              <div>
                <img src={pencilIcon} />
              </div>
              <span className="menuname">피드백</span>
            </MenuTab>
            <MenuTab $enabled={false} onClick={() => setShowStudentModal(true)}>
              학생 정보 보기
            </MenuTab>
            {/* 웹소켓 */}
            {/* <div>
              {messages?.map((message, index) => (
                <div key={index}>{message}</div>
              ))}
            </div> */}
          </MainMenuBox>
          <AccountMenuBox>
            <span className="menurole">설정</span>
            <MenuTab $enabled={false} onClick={handleLogout}>
              <div>
                <img src={dashboardIcon} style={{ opacity: 0 }} />
              </div>
              <span className="menuname">로그아웃</span>
            </MenuTab>
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
      {showStudentModal && (
        <StudentRecordModal
          onClose={() => setShowStudentModal(false)}
          studentId={36}
        />
      )}
    </MainWrapper>
  );
};

export default MainLayout;

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
  z-index: 10;

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

export const NotificationWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-left: auto; // 해당 요소에 좌측 마진을 자동으로 채워기
`;

const BellImg = styled(BellIcon)`
  /* color: black; */
  color: #787878;
  height: 20px;
`;
const NotificationButton = styled.button`
  position: relative;

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

export const NotiHeader = styled.div`
  flex-shrink: 0; /* 압축 금지 */
  height: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;

  border-bottom: 0.5px solid #bdbdbd;
`;

export const NotiContent = styled.div`
  flex: 1; /* 남은 공간 전부 차지 */
  min-height: 0; /* flex 자식이 스크롤될 수 있게 */
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #b5b5b5;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
`;

const NotiItem = styled.div`
  position: relative; // 내부 Delete 버튼 용
  border-top: 0.5px solid #bdbdbd;
  border-bottom: 0.5px solid #bdbdbd;

  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

  /* height: 4.5rem; // 56 -> 72px */
  min-height: 4.5rem;
  height: auto;

  span {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    margin: 0.25rem 1.5rem;
    height: 1.25rem;

    color: #aaaaaa;
    font-weight: normal;
  }

  p {
    margin: 0 1.5rem;
    height: 1.25rem;
  }

  img {
    width: 1rem;
  }
`;

// 개별 삭제 버튼
export const DeleteBtn = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 0.75rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  cursor: pointer;
`;

// 모두 지우기 버튼
export const ClearAllBtn = styled.button`
  align-self: flex-end;
  margin: 1rem;
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 0.25rem;
  background-color: #f5f5f5;
  font-size: 1rem;
  cursor: pointer;
`;

export const EmptyMsg = styled.div`
  flex-shrink: 0;
  padding: 1rem;
  color: #666;
  text-align: center;
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
    /* transition: 0.2s; */
    background-color: #dedede;
  }

  &:not(:hover) {
    transition: 0.2s;
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
