import type { ErrorResponse } from "../ErrorResponse";

export type GetAvailableMonthResponse = ErrorResponse & {
  getAvailableMonthResponse: {
    year: number;
    month: number;
    allYears: Array<number>;
    allMonth: Array<number>;
  };
};
