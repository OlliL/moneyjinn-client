import type { PostingAccountTransport } from "../transport/PostingAccountTransport";

export type CreatePostingAccountRequest = {
  createPostingAccountRequest: {
    postingAccountTransport: PostingAccountTransport;
  };
};
