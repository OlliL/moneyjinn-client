import type { ContractpartnerTransport } from "@/api";

export type ContractpartnerChangedEventTransport = {
  eventType: string;
  contractpartnerTransport: ContractpartnerTransport;
};
