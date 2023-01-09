import type { AccessRelationTransport } from "../transport/AccessRelationTransport";
import type { UserTransport } from "../transport/UserTransport";

export type UpdateUserRequest = {
  userTransport: UserTransport;
  accessRelationTransport: AccessRelationTransport;
};
