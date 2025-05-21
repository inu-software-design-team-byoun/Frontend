import { useEffect, useRef } from "react";

export interface Notification {
  id: number;
  date: string;
  text: string;
}

export function useNotificationSocket(onNotify: (n: Notification) => void) {
  const wsRef = useRef<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket("wss://localhost:3000/ws/notifications");

    wsRef.current = ws;
    ws.onopen = () => console.log("WS connected");
    ws.onmessage = (e) => {
      const n: Notification = JSON.parse(e.data);
      onNotify(n);
    };
    return () => {
      ws.close();
    };
  }, [onNotify]);

  return wsRef;
}
