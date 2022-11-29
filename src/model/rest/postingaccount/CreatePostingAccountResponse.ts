import type { ValidationItemTransport } from "../transport/ValidationItemTransport";

export type CreatePostingAccountResponse = {
  createPostingAccountResponse: {
    result: boolean;
    validationItemTransport: Array<ValidationItemTransport>;
    postingAccountId: number;
  };
};
