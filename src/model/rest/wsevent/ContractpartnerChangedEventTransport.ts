import type { ContractpartnerTransport } from "../transport/ContractpartnerTransport";

export type ContractpartnerChangedEventTransport = {
  eventType: string;
  contractpartnerTransport: ContractpartnerTransport;
};
