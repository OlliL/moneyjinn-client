import type { ErrorResponse } from "../ErrorResponse";

export type GetAvailableMonthResponse = ErrorResponse & {
  year: number;
  month: number;
  allYears: Array<number>;
  allMonth: Array<number>;
};
