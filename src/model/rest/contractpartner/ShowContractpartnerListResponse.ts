import type { ContractpartnerTransport } from "@/model/rest/transport/ContractpartnerTransport";
import type { AbstractResponse } from "../AbstractResponse";

export type ShowContractpartnerListResponse = AbstractResponse & {
  contractpartnerTransports: Array<ContractpartnerTransport>;
};
