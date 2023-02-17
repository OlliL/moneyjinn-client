import type { TrendsMonthAmount } from "./TrendsMonthAmount";

export type Trends = {
  trendsSettled?: Array<TrendsMonthAmount>;
  trendsCalculated?: Array<TrendsMonthAmount>;
};
