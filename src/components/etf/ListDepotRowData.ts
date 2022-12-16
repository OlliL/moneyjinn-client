import type { EtfFlow } from "@/model/etf/EtfFlow";

export type ListDepotRowData = EtfFlow & {
  name: string;
  chartUrl: string;
};
