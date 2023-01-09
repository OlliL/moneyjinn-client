import type { AccessRelationTransport } from "../transport/AccessRelationTransport";
import type { UserTransport } from "../transport/UserTransport";

export type CreateUserRequest = {
  userTransport: UserTransport;
  accessRelationTransport: AccessRelationTransport;
};
