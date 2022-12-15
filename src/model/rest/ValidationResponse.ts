import type { ErrorResponse } from "./ErrorResponse";
import type { ValidationItemTransport } from "./transport/ValidationItemTransport";

export type ValidationResponse = ErrorResponse & {
  validationResponse: {
    result: boolean;
    validationItemTransport: Array<ValidationItemTransport>;
  };
};
