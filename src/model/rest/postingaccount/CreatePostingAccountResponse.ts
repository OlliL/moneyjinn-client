import type { ValidationResponse } from "../ValidationResponse";

export type CreatePostingAccountResponse = ValidationResponse & {
  postingAccountId: number;
};
