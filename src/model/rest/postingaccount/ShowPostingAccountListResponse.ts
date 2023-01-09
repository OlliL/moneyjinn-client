import type { ErrorResponse } from "../ErrorResponse";
import type { PostingAccountTransport } from "../transport/PostingAccountTransport";

export type ShowPostingAccountListResponse = ErrorResponse & {
  postingAccountTransports: Array<PostingAccountTransport>;
};
