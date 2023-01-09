import type { PostingAccountTransport } from "../transport/PostingAccountTransport";

export type PostingAccountChangedEventTransport = {
  eventType: string;
  postingAccountTransport: PostingAccountTransport;
};
