import type { ContractpartnerAccountTransport } from "@/model/rest/transport/ContractpartnerAccountTransport";
import type { ErrorResponse } from "../ErrorResponse";

export type ShowContractpartnerAccountListResponse = ErrorResponse & {
  contractpartnerAccountTransports: Array<ContractpartnerAccountTransport>;
};
