import type { ContractpartnerMatchingTransport } from "@/api";
import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";

export function mapContractpartnerMatchingTransportToModel(
  transport: ContractpartnerMatchingTransport,
): ContractpartnerMatching {
  const model: ContractpartnerMatching = {
    id: transport.id,
    contractpartnerId: transport.contractpartnerid,
    contractpartnerName: transport.contractpartnername,
    matchingText: transport.matchingText,
    postingAccountId: transport.postingAccountId,
    postingAccountName: transport.postingAccountName,
    moneyflowComment: transport.moneyflowComment,
  };
  return model;
}

export function mapContractpartnerMatchingToTransport(
  model: ContractpartnerMatching,
): ContractpartnerMatchingTransport {
  const transport: ContractpartnerMatchingTransport = {
    id: model.id,
    contractpartnerid: model.contractpartnerId,
    matchingText: model.matchingText,
    postingAccountId: model.postingAccountId,
    postingAccountName: model.postingAccountName,
    moneyflowComment: model.moneyflowComment,
  };
  return transport;
}
