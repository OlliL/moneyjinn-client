import type { ErrorResponse } from "../ErrorResponse";

export type GetAvailableMonthResponse = ErrorResponse & {
  getAvailableMonthResponse: {
    year: number;
    month: number;
    allYears: Array<number>;
    allMonth: Array<number>;
    nextMonthHasMoneyflows: number;
    previousMonthHasMoneyflows: number;
    previousMonth: number;
    previousYear: number;
    nextMonth: number;
    nextYear: number;
  };
};
