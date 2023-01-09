import type { AbstractResponse } from "../AbstractResponse";
import type { PostingAccountTransport } from "../transport/PostingAccountTransport";

export type ShowPostingAccountListResponse = AbstractResponse & {
  postingAccountTransports: Array<PostingAccountTransport>;
};
