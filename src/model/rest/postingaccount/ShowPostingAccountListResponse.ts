import type { ErrorResponse } from "../ErrorResponse";
import type { PostingAccountTransport } from "../transport/PostingAccountTransport";

export type ShowPostingAccountListResponse = {
  error?: ErrorResponse;
  showPostingAccountListResponse: {
    initials: Array<string>;
    postingAccountTransport: Array<PostingAccountTransport>;
  };
};
