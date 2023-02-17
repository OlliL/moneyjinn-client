import type { ContractpartnerAccountTransport } from "@/api";
import type { ErrorResponse } from "../ErrorResponse";

export type ShowContractpartnerAccountListResponse = ErrorResponse & {
  contractpartnerAccountTransports: Array<ContractpartnerAccountTransport>;
};
