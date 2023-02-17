import type { PostingAccountTransport } from "@/api";

export type PostingAccountChangedEventTransport = {
  eventType: string;
  postingAccountTransport: PostingAccountTransport;
};
