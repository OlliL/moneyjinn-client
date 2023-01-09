import type { ErrorResponse } from "../ErrorResponse";

export type ShowTrendsFormResponse = ErrorResponse & {
  minDate: string;
  maxDate: string;
  settingTrendCapitalsourceIds: Array<number>;
};
