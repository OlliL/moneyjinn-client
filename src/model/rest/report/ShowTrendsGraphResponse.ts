import type { ErrorResponse } from "../ErrorResponse";
import type { TrendsCalculatedTransport } from "./transport/TrendsCalculatedTransport";
import type { TrendsSettledTransport } from "./transport/TrendsSettletTransport";

export type ShowTrendsGraphResponse = ErrorResponse & {
  showTrendsGraphResponse: {
    trendsSettledTransport: Array<TrendsSettledTransport>;
    trendsCalculatedTransport: Array<TrendsCalculatedTransport>;
  };
};
