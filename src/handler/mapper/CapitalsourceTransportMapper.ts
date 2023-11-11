import type { CapitalsourceTransport } from "@/api";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import { getISOStringDate } from "@/tools/views/FormatDate";
import {
  mapCapitalsourceImportEnumToTransport,
  mapCapitalsourceImportTransportToEnum,
} from "./CapitalsourceImportMapper";
import {
  mapCapitalsourceStateEnumToTransport,
  mapCapitalsourceStateTransportToEnum,
} from "./CapitalsourceStateMapper";
import {
  mapCapitalsourceTypeEnumToTransport,
  mapCapitalsourceTypeTransportToEnum,
} from "./CapitalsourceTypeMapper";

export function mapCapitalsourceTransportToModel(
  transport: CapitalsourceTransport,
): Capitalsource {
  const model: Capitalsource = {
    id: transport.id,
    userId: transport.userid,
    state: mapCapitalsourceStateTransportToEnum(transport.state),
    type: mapCapitalsourceTypeTransportToEnum(transport.type),
    accountNumber: transport.accountNumber,
    bankCode: transport.bankCode,
    comment: transport.comment,
    validFrom: new Date(transport.validFrom),
    validTil: new Date(transport.validTil),
    groupUse: transport.groupUse === 1 ? true : false,
    importAllowed: mapCapitalsourceImportTransportToEnum(
      transport.importAllowed,
    ),
  };
  model.validFrom.setHours(0, 0, 0, 0);
  model.validTil.setHours(0, 0, 0, 0);

  return model;
}

export function mapCapitalsourceToTransport(
  model: Capitalsource,
): CapitalsourceTransport {
  const transport: CapitalsourceTransport = {
    id: model.id,
    userid: model.userId,
    state: mapCapitalsourceStateEnumToTransport(model.state),
    type: mapCapitalsourceTypeEnumToTransport(model.type),
    accountNumber: model.accountNumber,
    bankCode: model.bankCode,
    comment: model.comment,
    validFrom: getISOStringDate(model.validFrom),
    validTil: getISOStringDate(model.validTil),
    groupUse: model.groupUse ? 1 : 0,
    importAllowed: mapCapitalsourceImportEnumToTransport(model.importAllowed),
  };
  return transport;
}
