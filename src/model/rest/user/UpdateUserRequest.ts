import type { AccessRelationTransport } from "../transport/AccessRelationTransport";
import type { UserTransport } from "../transport/UserTransport";

export type UpdateUserRequest = {
  updateUserRequest: {
    userTransport: UserTransport;
    accessRelationTransport: AccessRelationTransport;
  };
};
