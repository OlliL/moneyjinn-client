import type { EtfFlowTransport } from "@/api";
import type { EtfFlow } from "@/model/etf/EtfFlow";

export function mapEtfFlowTransportToModel(
  transport: EtfFlowTransport,
): EtfFlow {
  const model: EtfFlow = {
    amount: transport.amount,
    etfflowid: transport.etfflowid,
    etfId: transport.etfId,
    nanoseconds: transport.nanoseconds,
    timestamp: new Date(transport.timestamp),
    price: transport.price,
    accumulatedPreliminaryLumpSum: 0,
    preliminaryLumpSumPerYear: new Map<string, number>(),
  };
  return model;
}

export function mapEtfFlowModelToTransport(model: EtfFlow): EtfFlowTransport {
  const transport: EtfFlowTransport = {
    amount: model.amount,
    etfflowid: model.etfflowid,
    etfId: model.etfId,
    nanoseconds: model.nanoseconds,
    timestamp: model.timestamp.toISOString(),
    price: model.price,
  };
  return transport;
}
