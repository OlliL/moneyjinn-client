import type { ContractpartnerAccountTransport } from "@/model/rest/transport/ContractpartnerAccountTransport";
import type { AbstractResponse } from "../AbstractResponse";

export type ShowContractpartnerAccountListResponse = AbstractResponse & {
  contractpartnerAccountTransports: Array<ContractpartnerAccountTransport>;
};
