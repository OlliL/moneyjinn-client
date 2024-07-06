import type { GroupTransport } from "@/api";
import type { Group } from "@/model/group/Group";

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
