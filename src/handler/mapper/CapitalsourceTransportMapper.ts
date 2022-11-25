import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import type { CapitalsourceTransport } from "@/model/rest/transport/CapitalsourceTransport";
import { mapCapitalsourceStateTransportToEnum } from "./CapitalsourceStateMapper";
import { mapCapitalsourceTypeTransportToEnum } from "./CapitalsourceTypeMapper";

export function mapCapitalsourceTransportToModel(
  transport: CapitalsourceTransport
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
    importAllowed: transport.importAllowed === 1 ? true : false,
  };
  return model;
}
