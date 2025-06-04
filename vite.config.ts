// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// vite.config.ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      // 옵션: 필요 없으면 빈 객체
      svgrOptions: {
        icon: true, // SVG 사이즈를 인라인으로 조정할 수 있게 해줌
      },
    }),
  ],
  server: {
    port: 5173, // 원하는 포트 번호로 변경
    allowedHosts: ["hiedu.site"],
  },
});
