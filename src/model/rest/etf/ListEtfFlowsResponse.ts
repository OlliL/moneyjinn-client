import type { ErrorResponse } from "../ErrorResponse";
import type { EtfEffectiveFlowTransport } from "../transport/EtfEffectiveFlowTransport";
import type { EtfFlowTransport } from "../transport/EtfFlowTransport";
import type { EtfTransport } from "../transport/EtfTransport";

export type ListEtfFlowsResponse = ErrorResponse & {
  listEtfFlowsResponse: {
    etfTransport: Array<EtfTransport>;
    etfFlowTransport: Array<EtfFlowTransport>;
    etfEffectiveFlowTransport: Array<EtfEffectiveFlowTransport>;
    calcEtfSaleIsin: string;
    calcEtfSalePieces: number;
    calcEtfBidPrice: number;
    calcEtfAskPrice: number;
    calcEtfTransactionCosts: number;
  };
};
