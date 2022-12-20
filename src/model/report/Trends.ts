import type { MonthAmount } from "./MonthAmount";

export type Trends = {
  trendsSettled: Array<MonthAmount>;
  trendsCalculated: Array<MonthAmount>;
};
