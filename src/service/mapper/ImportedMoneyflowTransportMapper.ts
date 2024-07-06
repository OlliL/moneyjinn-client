import {
  mapMoneyflowToTransport,
  mapMoneyflowTransportToModel,
} from "./MoneyflowTransportMapper";
import type { ImportedMoneyflow } from "@/model/moneyflow/ImportedMoneyflow";
import type { ImportedMoneyflowTransport } from "@/api";

export function mapImportedMoneyflowTransportToModel(
  transport: ImportedMoneyflowTransport,
): ImportedMoneyflow {
  const model: ImportedMoneyflow = {
    ...mapMoneyflowTransportToModel(transport, false),
    accountNumber: transport.accountNumber,
    bankCode: transport.bankCode,
    externalid: transport.externalid,
    name: transport.name,
    usage: transport.usage,
    accountNumberCapitalsource: transport.accountNumberCapitalsource,
    bankCodeCapitalsource: transport.bankCodeCapitalsource,
  };
  return model;
}

export function mapImportedMoneyflowToTransport(
  model: ImportedMoneyflow,
): ImportedMoneyflowTransport {
  const transport: ImportedMoneyflowTransport = {
    ...mapMoneyflowToTransport(model),
    accountNumber: model.accountNumber,
    bankCode: model.bankCode,
    externalid: model.externalid,
    name: model.name,
    usage: model.usage,
    accountNumberCapitalsource: model.accountNumberCapitalsource,
    bankCodeCapitalsource: model.bankCodeCapitalsource,
  };
  return transport;
}
