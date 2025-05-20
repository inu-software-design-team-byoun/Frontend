// handlers.ts
import { http, HttpResponse } from "msw";

const handlers = [
  http.get(`http://localhost:8080/api/event`, () => {
    return HttpResponse.json({
      status: 200,
      data: ["mocking응답성공"],
    });
  }),
];
export default handlers;
