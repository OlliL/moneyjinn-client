import type { ErrorResponse } from "../ErrorResponse";

export type ShowReportingFormResponse = ErrorResponse & {
  showReportingFormResponse: {
    postingAccountIdsNo: Array<number>;
    minDate: string;
    maxDate: string;
  };
};
