import type { AbstractResponse } from "../AbstractResponse";
import type { AccessRelationTransport } from "../transport/AccessRelationTransport";
import type { GroupTransport } from "../transport/GroupTransport";
import type { UserTransport } from "../transport/UserTransport";

export type ShowUserListResponse = AbstractResponse & {
  userTransports: Array<UserTransport>;
  groupTransports: Array<GroupTransport>;
  accessRelationTransports: Array<AccessRelationTransport>;
};
