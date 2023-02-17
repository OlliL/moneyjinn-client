import type { UserTransport } from "@/api";
import type { ValidationResponse } from "../ValidationResponse";

export type LoginResponse = ValidationResponse & {
  userTransport: UserTransport;
  token: string;
  refreshToken: string;
};
