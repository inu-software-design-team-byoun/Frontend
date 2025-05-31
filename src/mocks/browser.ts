// browser.ts
import { SetupWorker, setupWorker } from "msw/browser";
import handlers from "./handlers";

// handler 등록 후 worker 설정
export const worker: SetupWorker = setupWorker(...handlers);
// worker 실행
// worker.start({
//   // 처리되지 않은 요청 보이지 않게 처리
//   onUnhandledRequest: "bypass",
// });
