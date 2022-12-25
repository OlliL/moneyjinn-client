import type { ErrorResponse } from "../ErrorResponse";
import type { ValidationItemTransport } from "../transport/ValidationItemTransport";

export type CreateGroupResponse = ErrorResponse & {
  createGroupResponse: {
    result: boolean;
    validationItemTransport: Array<ValidationItemTransport>;
    groupId: number;
  };
};
