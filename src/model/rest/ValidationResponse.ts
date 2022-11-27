import type { ValidationItemTransport } from "./transport/ValidationItemTransport";

export type ValidationResponse = {
  validationResponse: {
    result: boolean;
    validationItemTransport: Array<ValidationItemTransport>;
  };
};
