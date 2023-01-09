import type { ErrorResponse } from "../ErrorResponse";
import type { AccessRelationTransport } from "../transport/AccessRelationTransport";

export type ShowEditUserResponse = ErrorResponse & {
  accessRelationTransports: Array<AccessRelationTransport>;
};
