import type { Group } from "@/model/group/Group";
import type { GroupTransport } from "@/model/rest/transport/GroupTransport";

export function mapGroupTransportToModel(transport: GroupTransport): Group {
  const model: Group = {
    id: transport.id,
    name: transport.name,
  };
  return model;
}

export function mapGroupToTransport(model: Group): GroupTransport {
  const transport: GroupTransport = {
    id: model.id,
    name: model.name,
  };
  return transport;
}
