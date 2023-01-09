import type { ValidationResponse } from "../ValidationResponse";

export type CreateUserResponse = ValidationResponse & {
  userId: number;
};
