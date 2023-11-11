import type { EtfFlowTransport } from "@/api";
import type { EtfFlow } from "@/model/etf/EtfFlow";

export function mapEtfFlowTransportToModel(
  transport: EtfFlowTransport,
): EtfFlow {
  const model: EtfFlow = {
    amount: transport.amount,
    etfflowid: transport.etfflowid,
    isin: transport.isin,
    nanoseconds: transport.nanoseconds,
    timestamp: new Date(transport.timestamp),
    price: transport.price,
  };
  return model;
}

export function mapEtfFlowModelToTransport(model: EtfFlow): EtfFlowTransport {
  const transport: EtfFlowTransport = {
    amount: model.amount,
    etfflowid: model.etfflowid,
    isin: model.isin,
    nanoseconds: model.nanoseconds,
    timestamp: model.timestamp.toISOString(),
    price: model.price,
  };
  return transport;
}
