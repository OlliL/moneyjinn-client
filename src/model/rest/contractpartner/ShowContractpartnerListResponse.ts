import type { ErrorResponse } from "../ErrorResponse";
import type { ContractpartnerTransport } from "@/model/rest/transport/ContractpartnerTransport";

export type ShowContractpartnerListResponse = {
  error?: ErrorResponse;
  showContractpartnerListResponse: {
    initials: Array<string>;
    contractpartnerTransport: Array<ContractpartnerTransport>;
    currentlyValid: number;
  };
};
