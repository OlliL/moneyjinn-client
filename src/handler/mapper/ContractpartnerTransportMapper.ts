import type { ContractpartnerTransport } from "@/api";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import { getISOStringDate } from "@/tools/views/FormatDate";

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
  model.validFrom.setHours(0, 0, 0, 0);
  model.validTil.setHours(0, 0, 0, 0);
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
    validFrom: getISOStringDate(model.validFrom),
    validTil: getISOStringDate(model.validTil),
  };
  return transport;
}
