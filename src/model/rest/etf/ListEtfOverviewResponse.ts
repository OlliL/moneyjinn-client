import type { ErrorResponse } from "../ErrorResponse";
import type { EtfSummaryTransport } from "../transport/EtfSummaryTransport";

export type ListEtfOverviewResponse = ErrorResponse & {
  etfSummaryTransports: Array<EtfSummaryTransport>;
};
