import type { AbstractResponse } from "../AbstractResponse";

export type ShowTrendsFormResponse = AbstractResponse & {
  minDate: string;
  maxDate: string;
  settingTrendCapitalsourceIds: Array<number>;
};
