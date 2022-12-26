import type { ErrorResponse } from "../ErrorResponse";
import type { ValidationItemTransport } from "../transport/ValidationItemTransport";

export type UpdateUserResponse = ErrorResponse & {
  updateUserResponse: {
    result: boolean;
    validationItemTransport: Array<ValidationItemTransport>;
  };
};
