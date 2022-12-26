import type { ErrorResponse } from "../ErrorResponse";
import type { ValidationItemTransport } from "../transport/ValidationItemTransport";

export type CreateUserResponse = ErrorResponse & {
  createUserResponse: {
    result: boolean;
    validationItemTransport: Array<ValidationItemTransport>;
    userId: number;
  };
};
