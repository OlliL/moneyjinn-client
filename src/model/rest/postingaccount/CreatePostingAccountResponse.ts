import type { ErrorResponse } from "../ErrorResponse";
import type { ValidationItemTransport } from "../transport/ValidationItemTransport";

export type CreatePostingAccountResponse = ErrorResponse & {
  createPostingAccountResponse: {
    result: boolean;
    validationItemTransport: Array<ValidationItemTransport>;
    postingAccountId: number;
  };
};
