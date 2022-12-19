import type { ErrorResponse } from "../ErrorResponse";

export type ShowTrendsFormResponse = ErrorResponse & {
  showTrendsFormResponse: {
    minDate: string;
    maxDate: string;
    settingTrendCapitalsourceId: Array<number>;
  };
};
