import type { AbstractResponse } from "./AbstractResponse";
import type { ValidationItemTransport } from "./transport/ValidationItemTransport";

export type ValidationResponse = AbstractResponse & {
  result: boolean;
  validationItemTransports: Array<ValidationItemTransport>;
};
