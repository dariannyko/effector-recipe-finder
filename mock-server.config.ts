import type { MockServerConfig } from "mock-config-server";

export const mockServerConfig: MockServerConfig = {
  rest: {
    baseUrl: "/api",
    configs: [
      {
        path: "/signin",
        method: "post",
        routes: [
          {
            data: { error: "invalid_request" },
            interceptors: {
              response: (data, { setStatusCode }) => {
                setStatusCode(400);
                return data;
              },
            },
          },
          {
            data: { error: "invalid_credentials" },
            entities: {
              body: {
                email: "dariannyko@gmail.com",
              },
            },
            interceptors: {
              response: (data, { setStatusCode }) => {
                setStatusCode(403);
                return data;
              },
            },
          },
          {
            data: { email: "dariannyko@gmail.com", username: "dariannyko" },
            entities: {
              body: {
                email: "dariannyko@gmail.com",
                password: "dariannyko",
              },
            },
            interceptors: {
              response: (data, { appendHeader }) => {
                appendHeader("Set-Cookie", "token=auth-user-token");
                return data;
              },
            },
          },
        ],
      },
      {
        path: "/signup",
        method: "post",
        routes: [
          {
            data: {
              username: "sergei sova",
            },
            interceptors: {
              response: (data, { appendHeader, request }) => {
                appendHeader("Set-Cookie", "token=auth-user-token");
                return { ...data, email: request.body.email };
              },
            },
          },
        ],
      },
      {
        path: "/reset-password",
        method: "post",
        routes: [
          {
            data: { success: true },
            interceptors: {
              response: (data, { appendHeader }) => {
                appendHeader("Set-Cookie", "token=auth-user-token");
                return data;
              },
            },
          },
        ],
      },
    ],
  },
};

export default mockServerConfig;
