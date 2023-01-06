import type { PostingAccountTransport } from "../transport/PostingAccountTransport";

export type PostingAccountChangedEventTransport = {
  postingAccountChangedEventTransport: {
    eventType: string;
    postingAccountTransport: PostingAccountTransport;
  };
};
