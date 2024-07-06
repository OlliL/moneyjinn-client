import type { UserTransport } from "@/api";
import type { User } from "@/model/user/User";
import {
  mapUserRoleEnumToTransport,
  mapUserTransportRoleEnumToEnum,
} from "./UserRoleEnumMapper";

export function mapUserTransportToModel(transport: UserTransport): User {
  const model: User = {
    id: transport.id,
    userName: transport.userName,
    role: mapUserTransportRoleEnumToEnum(transport.role),
    userIsNew: transport.userIsNew === 1,
    userPassword: transport.userPassword,
  };
  return model;
}

export function mapUserToTransport(model: User): UserTransport {
  const transport: UserTransport = {
    id: model.id,
    userName: model.userName,
    role: mapUserRoleEnumToTransport(model.role),
    userIsNew: model.userIsNew ? 1 : 0,
    userPassword: model.userPassword,
  };
  return transport;
}
