import type { ErrorResponse } from "../ErrorResponse";
import type { GroupTransport } from "../transport/GroupTransport";

export type ShowGroupListResponse = ErrorResponse & {
  showGroupListResponse: {
    groupTransport: Array<GroupTransport>;
  };
};
