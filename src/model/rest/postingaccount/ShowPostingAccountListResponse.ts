import type { ErrorResponse } from "../ErrorResponse";
import type { PostingAccountTransport } from "../transport/PostingAccountTransport";

export type ShowPostingAccountListResponse = ErrorResponse & {
  showPostingAccountListResponse: {
    postingAccountTransport: Array<PostingAccountTransport>;
  };
};
