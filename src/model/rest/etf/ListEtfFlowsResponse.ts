import type { AbstractResponse } from "../AbstractResponse";
import type { EtfEffectiveFlowTransport } from "../transport/EtfEffectiveFlowTransport";
import type { EtfFlowTransport } from "../transport/EtfFlowTransport";
import type { EtfTransport } from "../transport/EtfTransport";

export type ListEtfFlowsResponse = AbstractResponse & {
  etfTransports: Array<EtfTransport>;
  etfFlowTransports: Array<EtfFlowTransport>;
  etfEffectiveFlowTransports: Array<EtfEffectiveFlowTransport>;
  calcEtfSaleIsin: string;
  calcEtfSalePieces: number;
  calcEtfBidPrice: number;
  calcEtfAskPrice: number;
  calcEtfTransactionCosts: number;
};
