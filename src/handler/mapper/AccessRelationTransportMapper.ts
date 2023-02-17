import type { AccessRelationTransport } from "@/api";
import type { AccessRelation } from "@/model/user/AccessRelation";
import { getISOStringDate } from "@/tools/views/FormatDate";

export function mapAccessRelationTransportToModel(
  transport: AccessRelationTransport
): AccessRelation {
  const model: AccessRelation = {
    id: transport.id,
    refId: transport.refId,
    validFrom: new Date(transport.validfrom),
    validTil: transport.validtil ? new Date(transport.validtil) : undefined,
  };
  model.validFrom.setHours(0, 0, 0, 0);
  model.validTil?.setHours(0, 0, 0, 0);
  return model;
}

export function mapAccessRelationToTransport(
  model: AccessRelation
): AccessRelationTransport {
  const transport: AccessRelationTransport = {
    id: model.id,
    refId: model.refId,
    validfrom: getISOStringDate(model.validFrom),
    validtil: model.validTil ? getISOStringDate(model.validTil) : undefined,
  };
  return transport;
}
