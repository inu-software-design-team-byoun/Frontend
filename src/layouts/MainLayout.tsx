// src/layout/MainLayout.tsx
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";

import bookIcon from "../assets/bookIcon.svg";
import listIcon from "../assets/listIcon.svg";
import scoreIcon from "../assets/scoreIcon.svg";
import pencilIcon from "../assets/icon/pencilIcon.svg";
import dashboardIcon from "../assets/icon/dashboardIcon.svg";
import BellIcon from "../assets/icon/BellIcon.svg?react";
import DeleteIcon from "../assets/icon/DeleteIcon.svg";

import { NotiPopOver } from "../components/NotiPopOver";
import {
  useNotificationSocket,
  NotificationPayload,
} from "../hooks/useNotificationSocket";

import { useAuthStore } from "../hooks/useAuthStore";
import { useStudentRecordStore } from "../stores/useStudentRecordStore";

import { StudentRecordBody } from "../components/StudentRecordBody";
import { StudentRecordModal } from "../components/StudentRecordModal";

type MainLayoutProps = {
  children: React.ReactNode;
};

const wsUrl = import.meta.env.VITE_BACKEND_WS_URL;

interface Notification {
  id: number;
  date: string;
  text: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // --- auth store 값들 ---
  const userId = useAuthStore((state) => state.userId);
  const userName = useAuthStore((state) => state.userName);
  const role = useAuthStore((state) => state.role);
  const teacherName = useAuthStore((state) => state.teacherName);
  const studentId = useAuthStore((state) => state.studentId);

  const setUserId = useAuthStore((state) => state.setUserId);
  const setUserName = useAuthStore((state) => state.setUserName);
  const setRole = useAuthStore((state) => state.setRole);
  const setTeacherName = useAuthStore((state) => state.setTeacherName);
  const setTeacherGrade = useAuthStore((state) => state.setTeacherGrade);
  const setTeacherClassroom = useAuthStore(
    (state) => state.setTeacherClassroom
  );
  const setStudentId = useAuthStore((state) => state.setStudentId);

  const clearAuth = useAuthStore((state) => state.clearAuth);
  const token = useAuthStore.getState().accessToken;

  // --- 사용자 정보(fetchUserId) 가져오기 ---
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

      // 공통 필드 세팅
      setUserId(data.userId);
      setUserName(data.name);
      setRole(data.role);

      // teacher 모드인 경우
      if (data.role === "teacher" && data.teacherInfo) {
        setTeacherName(data.teacherInfo.name);
        setTeacherGrade(data.teacherInfo.grade);
        setTeacherClassroom(data.teacherInfo.homeroom);
      }

      // student 모드인 경우: studentInfo.id 저장
      if (data.role === "student" && data.studentInfo) {
        setStudentId(data.studentInfo.id);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // --- 로그인된 계정이 student라면, "/" 대신 "/student-record"로 자동 이동 ---
  useEffect(() => {
    if (role === "student" && currentPath === "/") {
      navigate("/student-record", { replace: true });
    }
  }, [role, currentPath, navigate]);

  // --- 알림 팝업 상태 관리 ---
  const [showNoti, setShowNoti] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const toggleNoti = () => setShowNoti((prev) => !prev);

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
        if (exists) return prev;
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

  const deleteOne = async (id: number) => {
    await fetch(
      `${import.meta.env.VITE_BACKEND_API_BASE_URL}/notifications/${id}`,
      { method: "DELETE" }
    );
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const deleteAll = async () => {
    await fetch(
      `${import.meta.env.VITE_BACKEND_API_BASE_URL}/notifications/user/${userId}`,
      { method: "DELETE" }
    );
    setNotifications([]);
  };

  // --- 교사용 모달 오픈 여부 (Zustand) ---
  const {
    isOpen: isModalOpen,
    studentId: modalStudentId,
    closeModal,
  } = useStudentRecordStore();

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  // ─── 교사용 페이지 이동 함수 ───────────────────────
  const goToMain = () => navigate("/");
  const goToAttendance = () => navigate("/attendance");
  const goToCounsel = () => navigate("/counsel");
  const goToScoreInput = () => navigate("/scoreinput");
  const goToFeedback = () => navigate("/feedback");

  // ─── 학생/학부모용 페이지 이동 함수 ─────────────────
  const goToStudentRecord = () => navigate("/student-record");
  const goToStudentScore = () => navigate("/student-score");

  return (
    <MainWrapper>
      {/* ── 교사용 모달 ── */}
      {role === "teacher" && isModalOpen && modalStudentId !== null && (
        <StudentRecordModal onClose={closeModal} studentId={modalStudentId} />
      )}
      {/* ───────────────── */}

      <SideBarArea>
        <SideBar>
          {/* 사용자 정보 영역 */}
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
              <>
                <UserLastName>
                  <span>{userName ? userName.charAt(0) : ""}</span>
                </UserLastName>
                <UserRole>
                  {userName && <span className="name">{userName}</span>}
                </UserRole>
              </>
            )}

            {/* 알림 버튼 */}
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

          {/* 사이드바 메뉴 */}
          <MainMenuBox>
            {role === "teacher" ? (
              /* ── 교사용 메뉴 ── */
              <>
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
              </>
            ) : (
              /* ── 학생/학부모용 메뉴 ── */
              <>
                <span className="menurole">메인메뉴</span>
                <MenuTab
                  $enabled={currentPath === "/student-record"}
                  onClick={goToStudentRecord}
                >
                  <div>
                    <img src={listIcon} />
                  </div>
                  <span className="menuname">학생부</span>
                </MenuTab>
              </>
            )}
          </MainMenuBox>

          {/* 로그아웃 탭 */}
          <AccountMenuBox>
            <span className="menurole">설정</span>
            <MenuTab $enabled={false} onClick={handleLogout}>
              <div>
                <img src={dashboardIcon} style={{ opacity: 0 }} />
              </div>
              <span className="menuname">로그아웃</span>
            </MenuTab>
          </AccountMenuBox>
        </SideBar>
      </SideBarArea>

      {/* 메인 컨텐츠 영역 */}
      <MainArea>
        {role !== "teacher" && currentPath === "/student-record" ? (
          // 학생/학부모 모드일 때, “학생부” 페이지 경로라면 StudentRecordBody 렌더링
          <StudentRecordBody studentId={studentId} />
        ) : (
          // 그 외 (교사용 페이지, 혹은 다른 경로)에는 children 렌더링
          children
        )}
      </MainArea>
    </MainWrapper>
  );
};

export default MainLayout;

/** ──────────────────────────────────────────────────────────────────────────── */
/**                                styled-components                             */
/** ──────────────────────────────────────────────────────────────────────────── */

export const MainWrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #f1feff;
  display: flex;
  flex-direction: row;
`;

export const SideBarArea = styled.div`
  width: 312px;
  height: 100vh;
`;

export const SideBar = styled.div`
  position: fixed;
  z-index: 10;
  margin: 3rem 2.5rem;
  width: 14.5rem;
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
  width: 11.5rem;
  height: 2rem;
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
  font-size: 1rem;
  color: black;

  .name {
    font-weight: bold;
  }
`;

export const NotificationWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-left: auto;
`;

const BellImg = styled(BellIcon)`
  color: #787878;
  height: 20px;
`;

const NotificationButton = styled.button`
  position: relative;
  border: none;
  background-color: #d9d9d9;
  border-radius: 2rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover ${BellImg} {
    color: #ffac33;
  }
`;

export const NotiHeader = styled.div`
  flex-shrink: 0;
  height: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-bottom: 0.5px solid #bdbdbd;
`;

export const NotiContent = styled.div`
  flex: 1;
  min-height: 0;
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
  position: relative;
  border-top: 0.5px solid #bdbdbd;
  border-bottom: 0.5px solid #bdbdbd;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
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

export const DeleteBtn = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 0.75rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  cursor: pointer;
`;

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
  width: 11.5rem;
`;

export const AccountMenuBox = styled.div`
  margin-top: 0.25rem;
  width: 11.5rem;
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
    display: flex;
    justify-content: center;
  }

  cursor: pointer;

  &:hover {
    background-color: #dedede;
  }

  &:not(:hover) {
    transition: 0.2s;
  }
`;

export const MainArea = styled.main`
  padding-top: 3rem;
  width: 75rem;
  height: 800px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;
