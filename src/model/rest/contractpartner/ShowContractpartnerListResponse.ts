import type { ContractpartnerTransport } from "@/model/rest/transport/ContractpartnerTransport";
import type { ErrorResponse } from "../ErrorResponse";

export type ShowContractpartnerListResponse = ErrorResponse & {
  contractpartnerTransports: Array<ContractpartnerTransport>;
};
