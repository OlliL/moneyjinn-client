import type { AbstractResponse } from "../AbstractResponse";
import type { EtfSummaryTransport } from "../transport/EtfSummaryTransport";

export type ListEtfOverviewResponse = AbstractResponse & {
  etfSummaryTransports: Array<EtfSummaryTransport>;
};
