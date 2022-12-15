import type { ErrorResponse } from "../ErrorResponse";
import type { PostingAccountTransport } from "../transport/PostingAccountTransport";

export type ShowPostingAccountListResponse = ErrorResponse & {
  showPostingAccountListResponse: {
    initials: Array<string>;
    postingAccountTransport: Array<PostingAccountTransport>;
  };
};
