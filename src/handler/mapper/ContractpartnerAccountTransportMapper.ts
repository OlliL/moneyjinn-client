import type { ContractpartnerAccountTransport } from "@/api";
import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";

export function mapContractpartnerAccountTransportToModel(
  transport: ContractpartnerAccountTransport
): ContractpartnerAccount {
  const model: ContractpartnerAccount = {
    id: transport.id,
    contractpartnerid: transport.contractpartnerid,
    accountNumber: transport.accountNumber,
    bankCode: transport.bankCode,
  };
  return model;
}

export function mapContractpartnerAccountToTransport(
  model: ContractpartnerAccount
): ContractpartnerAccountTransport {
  const transport: ContractpartnerAccountTransport = {
    id: model.id,
    contractpartnerid: model.contractpartnerid,
    accountNumber: model.accountNumber,
    bankCode: model.bankCode,
  };
  return transport;
}
