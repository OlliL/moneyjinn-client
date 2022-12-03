import type { ErrorResponse } from "../ErrorResponse";
import type { ContractpartnerAccountTransport } from "@/model/rest/transport/ContractpartnerAccountTransport";

export type ShowContractpartnerAccountListResponse = {
  error?: ErrorResponse;
  showContractpartnerAccountListResponse: {
    contractpartnerAccountTransport: Array<ContractpartnerAccountTransport>;
    contractpartnerName: string;
  };
};
