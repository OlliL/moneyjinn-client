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
