import type { AbstractResponse } from "../AbstractResponse";

export type ShowReportingFormResponse = AbstractResponse & {
  postingAccountIds: Array<number>;
  minDate: string;
  maxDate: string;
};
