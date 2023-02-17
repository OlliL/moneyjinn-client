import type { ContractpartnerTransport } from "@/api";
import type { ErrorResponse } from "../ErrorResponse";

export type ShowContractpartnerListResponse = ErrorResponse & {
  contractpartnerTransports: Array<ContractpartnerTransport>;
};
