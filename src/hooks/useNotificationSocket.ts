import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export interface NotificationPayload {
  id: number;
  message: string;
  date: string; // ISO 문자열 (예: "2025-06-03T12:34:56.789Z")
}

const DEFAULT_WS_URL = import.meta.env.VITE_BACKEND_SOCKET_URL;

export function useNotificationSocket({
  userId,
  onNotification,
  wsUrl = DEFAULT_WS_URL,
}: {
  userId: string | undefined;
  onNotification: (payload: NotificationPayload) => void;
  wsUrl?: string;
}) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    // 이미 연결돼 있으면 중복 연결 방지
    if (socketRef.current && socketRef.current.connected) {
      console.log("⛔ 이미 연결된 소켓 존재:", socketRef.current.id);
      return;
    }

    const socket: Socket = io(wsUrl, {
      query: { userId },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    console.log("📡 소켓 연결 시도:", userId);

    socket.on("connect", () => {
      console.log("✅ 소켓 연결 성공:", socket.id);
    });

    socket.on("notification", (payload) => {
      console.log("📨 알림 수신:", payload.message);
      onNotification(payload);
    });

    socket.on("disconnect", (reason) => {
      console.warn("❌ 소켓 연결 끊김:", reason);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      console.log("🧹 소켓 연결 해제:", userId);
    };
  }, [userId, wsUrl]);
}
