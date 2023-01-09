import type { ErrorResponse } from "./ErrorResponse";
import type { ValidationItemTransport } from "./transport/ValidationItemTransport";

export type ValidationResponse = ErrorResponse & {
  result: boolean;
  validationItemTransports: Array<ValidationItemTransport>;
};
