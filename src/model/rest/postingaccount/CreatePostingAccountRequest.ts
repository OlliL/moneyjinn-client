import type { PostingAccountTransport } from "../transport/PostingAccountTransport";

export type CreatePostingAccountRequest = {
  postingAccountTransport: PostingAccountTransport;
};
