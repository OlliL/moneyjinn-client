import type { EtfFlow } from "@/model/etf/EtfFlow";
import type { EtfFlowTransport } from "@/model/rest/transport/EtfFlowTransport";

export function mapEtfFlowTransportToModel(
  transport: EtfFlowTransport
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
