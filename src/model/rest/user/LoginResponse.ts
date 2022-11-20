import type { ErrorResponse } from "@/model/rest/ErrorResponse";
import type { UserTransport } from "@/model/rest/transport/UserTransport";

export type LoginResponse = {
  error?: ErrorResponse;
  loginResponse: {
    userTransport: UserTransport;
    token: string;
  };
};
