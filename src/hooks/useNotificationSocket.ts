import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

export interface NotificationPayload {
  message: string;
}

const DEFAULT_WS_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

export function useNotificationSocket({
  userId,
  onNotification,
  wsUrl = DEFAULT_WS_URL,
}: {
  userId: string | undefined;
  onNotification: (payload: NotificationPayload) => void;
  wsUrl?: string;
}) {
  useEffect(() => {
    if (!userId) return;
    const socket: Socket = io(wsUrl, {
      query: { userId },
      transports: ["websocket"],
    });

    socket.on("notification", onNotification);

    return () => {
      socket.disconnect();
    };
  }, [userId, wsUrl]);
}
