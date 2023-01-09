import type { AbstractResponse } from "../AbstractResponse";
import type { TrendsCalculatedTransport } from "./transport/TrendsCalculatedTransport";
import type { TrendsSettledTransport } from "./transport/TrendsSettletTransport";

export type ShowTrendsGraphResponse = AbstractResponse & {
  trendsSettledTransports: Array<TrendsSettledTransport>;
  trendsCalculatedTransports: Array<TrendsCalculatedTransport>;
};
