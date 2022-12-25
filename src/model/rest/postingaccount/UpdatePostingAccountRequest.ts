import type { PostingAccountTransport } from "../transport/PostingAccountTransport";

export type UpdatePostingAccountRequest = {
  updatePostingAccountRequest: {
    postingAccountTransport: PostingAccountTransport;
  };
};
