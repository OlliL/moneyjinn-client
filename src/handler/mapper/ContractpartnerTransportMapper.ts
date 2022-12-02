import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { ContractpartnerTransport } from "@/model/rest/transport/ContractpartnerTransport";

export function mapContractpartnerTransportToModel(
  transport: ContractpartnerTransport
): Contractpartner {
  const model: Contractpartner = {
    id: transport.id,
    userId: transport.userid,
    country: transport.country,
    moneyflowComment: transport.moneyflowComment,
    name: transport.name,
    postcode: transport.postcode,
    postingAccountId: transport.postingAccountId,
    postingAccountName: transport.postingAccountName,
    street: transport.street,
    town: transport.town,
    validFrom: new Date(transport.validFrom),
    validTil: new Date(transport.validTil),
  };
  return model;
}

export function mapContractpartnerToTransport(
  model: Contractpartner
): ContractpartnerTransport {
  const transport: ContractpartnerTransport = {
    id: model.id,
    userid: model.userId,
    country: model.country,
    moneyflowComment: model.moneyflowComment,
    name: model.name,
    postcode: model.postcode,
    postingAccountId: model.postingAccountId,
    postingAccountName: model.postingAccountName,
    street: model.street,
    town: model.town,
    validFrom: model.validFrom?.toISOString(),
    validTil: model.validTil?.toISOString(),
  };
  return transport;
}
