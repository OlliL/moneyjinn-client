import type { ErrorResponse } from "../ErrorResponse";

export type GetAvailableMonthResponse = {
  error?: ErrorResponse;
  getAvailableMonthResponse: {
    year: number;
    month: number;
    allYears: Array<number>;
    allMonth: Array<number>;
  };
};
