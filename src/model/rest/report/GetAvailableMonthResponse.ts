import type { AbstractResponse } from "../AbstractResponse";

export type GetAvailableMonthResponse = AbstractResponse & {
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
