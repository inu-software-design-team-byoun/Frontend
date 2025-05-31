import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ 추가

const clientId = "YOUR_GOOGLE_CLIENT_ID"; // 🔑 여기에 실제 클라이언트 ID 입력

//const useMsw = true;
const useMsw = false;
async function enableMocking() {
  if (process.env.NODE_ENV === "development" && useMsw) {
    import("./mocks/browser").then(({ worker }) => worker.start());
    // const { worker } = await import("./mocks/browser");
    // await worker.start();
  }
}

if (useMsw) {
  enableMocking().then(() => {
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
          <App />
        </GoogleOAuthProvider>
      </StrictMode>
    );
  });
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <GoogleOAuthProvider clientId={clientId}>
        <App />
      </GoogleOAuthProvider>
    </StrictMode>
  );
}
