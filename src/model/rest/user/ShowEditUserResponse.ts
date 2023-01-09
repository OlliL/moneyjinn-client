import type { AbstractResponse } from "../AbstractResponse";
import type { AccessRelationTransport } from "../transport/AccessRelationTransport";

export type ShowEditUserResponse = AbstractResponse & {
  accessRelationTransports: Array<AccessRelationTransport>;
};
