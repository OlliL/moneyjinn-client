import type { UserTransport } from "@/api";
import type { User } from "@/model/user/User";

export function mapUserTransportToModel(transport: UserTransport): User {
  const model: User = {
    id: transport.id,
    userName: transport.userName,
    userIsAdmin: transport.userIsAdmin === 1 ? true : false,
    userIsNew: transport.userIsNew === 1 ? true : false,
    userCanLogin: transport.userCanLogin === 1 ? true : false,
    userCanImport: transport.userCanImport === 1 ? true : false,
    userPassword: transport.userPassword,
  };
  return model;
}

export function mapUserToTransport(model: User): UserTransport {
  const transport: UserTransport = {
    id: model.id,
    userName: model.userName,
    userIsAdmin: model.userIsAdmin ? 1 : 0,
    userIsNew: model.userIsNew ? 1 : 0,
    userCanLogin: model.userCanLogin ? 1 : 0,
    userCanImport: model.userCanImport ? 1 : 0,
    userPassword: model.userPassword,
  };
  return transport;
}
