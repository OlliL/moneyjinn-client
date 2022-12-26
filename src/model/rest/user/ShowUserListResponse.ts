import type { ErrorResponse } from "../ErrorResponse";
import type { AccessRelationTransport } from "../transport/AccessRelationTransport";
import type { GroupTransport } from "../transport/GroupTransport";
import type { UserTransport } from "../transport/UserTransport";

export type ShowUserListResponse = ErrorResponse & {
  showUserListResponse: {
    userTransport: Array<UserTransport>;
    groupTransport: Array<GroupTransport>;
    accessRelationTransport: Array<AccessRelationTransport>;
  };
};
