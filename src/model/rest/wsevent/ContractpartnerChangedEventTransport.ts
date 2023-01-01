import type { ContractpartnerTransport } from "../transport/ContractpartnerTransport";

export type ContractpartnerChangedEventTransport = {
  contractpartnerChangedEventTransport: {
    eventType: string;
    contractpartnerTransport: ContractpartnerTransport;
  };
};
