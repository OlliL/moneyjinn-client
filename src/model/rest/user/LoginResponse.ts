import type { ErrorResponse } from "@/model/rest/ErrorResponse";
import type { UserTransport } from "@/model/rest/transport/UserTransport";

export type LoginResponse = ErrorResponse & {
  loginResponse: {
    userTransport: UserTransport;
    token: string;
    refreshToken: string;
  };
};
