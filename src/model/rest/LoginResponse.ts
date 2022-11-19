import type { UserTransport } from "./transport/UserTransport";

export type LoginResponse = {
  loginResponse: {
    userTransport: UserTransport;
    token: string;
  };
};
