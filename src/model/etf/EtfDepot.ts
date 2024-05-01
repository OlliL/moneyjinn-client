import type { Etf } from "./Etf";
import type { EtfFlow } from "./EtfFlow";

export type EtfDepot = {
  etfs?: Array<Etf>;
  etfFlows?: Array<EtfFlow>;
  etfEffectiveFlows?: Array<EtfFlow>;
  defaultEtfId?: number;
  calcEtfSalePieces?: number;
  calcEtfBidPrice?: number;
  calcEtfAskPrice?: number;
  calcEtfTransactionCosts?: number;
};
