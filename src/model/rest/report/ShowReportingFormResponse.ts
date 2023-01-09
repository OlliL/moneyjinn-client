import type { ErrorResponse } from "../ErrorResponse";

export type ShowReportingFormResponse = ErrorResponse & {
  postingAccountIds: Array<number>;
  minDate: string;
  maxDate: string;
};
