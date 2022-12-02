import type { ContractpartnerTransport } from "../transport/ContractpartnerTransport";

export type CreateContractpartnerRequest = {
  createContractpartnerRequest: {
    contractpartnerTransport: ContractpartnerTransport;
  };
};
