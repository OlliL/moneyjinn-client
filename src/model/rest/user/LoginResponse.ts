import type { ErrorResponse } from "./ErrorResponse";
import type { UserTransport } from "./transport/UserTransport";

export type LoginResponse = {
  error?: ErrorResponse;
  loginResponse: {
    userTransport: UserTransport;
    token: string;
  };
};
