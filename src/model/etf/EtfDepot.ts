import type { EtfFlow } from "./EtfFlow";

export type EtfDepot = {
  etfFlows?: Array<EtfFlow>;
  etfEffectiveFlows?: Array<EtfFlow>;
  calcEtfSalePieces?: number;
  calcEtfBidPrice?: number;
  calcEtfAskPrice?: number;
  calcEtfTransactionCosts?: number;
};
