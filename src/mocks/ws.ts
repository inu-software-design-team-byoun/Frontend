// src/mocks/ws.ts
import { Server } from "mock-socket";

export function setupMockWS() {
  const mockServer = new Server("wss://your-backend.com/ws/notifications");

  mockServer.on("connection", (socket) => {
    // 연결되자마자 새 알림 1건 푸시
    socket.send(
      JSON.stringify({
        id: 99,
        date: "2025.05.20",
        text: "MSW+mock-socket 으로 모킹된 알림입니다.",
      })
    );
  });
}
