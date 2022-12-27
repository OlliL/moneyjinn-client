import type { ErrorResponse } from "../ErrorResponse";
import type { ContractpartnerTransport } from "@/model/rest/transport/ContractpartnerTransport";

export type ShowContractpartnerListResponse = ErrorResponse & {
  showContractpartnerListResponse: {
    contractpartnerTransport: Array<ContractpartnerTransport>;
  };
};
