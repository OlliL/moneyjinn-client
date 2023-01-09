import type { AbstractResponse } from "../AbstractResponse";
import type { GroupTransport } from "../transport/GroupTransport";

export type ShowGroupListResponse = AbstractResponse & {
  groupTransports: Array<GroupTransport>;
};
