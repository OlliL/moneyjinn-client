import type { ContractpartnerMatchingTransport } from "@/api";
import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";

export function mapContractpartnerMatchingTransportToModel(
  transport: ContractpartnerMatchingTransport,
): ContractpartnerMatching {
  const model: ContractpartnerMatching = {
    id: transport.id,
    contractpartnerId: transport.contractpartnerid,
    matchingText: transport.matchingText,
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
  };
  return transport;
}
