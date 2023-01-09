import type { ErrorResponse } from "../ErrorResponse";
import type { AccessRelationTransport } from "../transport/AccessRelationTransport";
import type { GroupTransport } from "../transport/GroupTransport";
import type { UserTransport } from "../transport/UserTransport";

export type ShowUserListResponse = ErrorResponse & {
  userTransports: Array<UserTransport>;
  groupTransports: Array<GroupTransport>;
  accessRelationTransports: Array<AccessRelationTransport>;
};
