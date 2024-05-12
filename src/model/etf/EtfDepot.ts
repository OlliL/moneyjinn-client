import type { EtfFlow } from "./EtfFlow";
import type { EtfSummary } from "./EtfSummary";

export type EtfDepot = {
  etfFlows?: Array<EtfFlow>;
  etfEffectiveFlows?: Array<EtfFlow>;
  etfSummary?: EtfSummary;
  calcEtfSalePieces?: number;
  calcEtfBidPrice?: number;
  calcEtfAskPrice?: number;
  calcEtfTransactionCostsAbsolute?: number;
  calcEtfTransactionCostsRelative?: number;
};
