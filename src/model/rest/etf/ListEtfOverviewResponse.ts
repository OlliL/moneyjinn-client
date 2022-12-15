import type { ErrorResponse } from "../ErrorResponse";
import type { EtfSummaryTransport } from "../transport/EtfSummaryTransport";

export type ListEtfOverviewResponse = ErrorResponse & {
  listEtfOverviewResponse: {
    etfSummaryTransport: Array<EtfSummaryTransport>;
  };
};
