import type { UserTransport } from "@/model/rest/transport/UserTransport";
import type { ValidationResponse } from "../ValidationResponse";

export type LoginResponse = ValidationResponse & {
  userTransport: UserTransport;
  token: string;
  refreshToken: string;
};
