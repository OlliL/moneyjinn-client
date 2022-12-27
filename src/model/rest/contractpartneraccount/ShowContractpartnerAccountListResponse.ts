import type { ErrorResponse } from "../ErrorResponse";
import type { ContractpartnerAccountTransport } from "@/model/rest/transport/ContractpartnerAccountTransport";

export type ShowContractpartnerAccountListResponse = ErrorResponse & {
  showContractpartnerAccountListResponse: {
    contractpartnerAccountTransport: Array<ContractpartnerAccountTransport>;
  };
};
