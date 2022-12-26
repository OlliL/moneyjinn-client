import type { AccessRelation } from "@/model/user/AccessRelation";
import type { AccessRelationTransport } from "@/model/rest/transport/AccessRelationTransport";

export function mapAccessRelationTransportToModel(
  transport: AccessRelationTransport
): AccessRelation {
  const model: AccessRelation = {
    id: transport.id,
    refId: transport.refId,
    validFrom: new Date(transport.validfrom),
    validTil: transport.validtil ? new Date(transport.validtil) : undefined,
  };
  return model;
}

export function mapAccessRelationToTransport(
  model: AccessRelation
): AccessRelationTransport {
  const transport: AccessRelationTransport = {
    id: model.id,
    refId: model.refId,
    validfrom: model.validFrom.toISOString(),
    validtil: model.validTil ? model.validTil.toISOString() : undefined,
  };
  return transport;
}
