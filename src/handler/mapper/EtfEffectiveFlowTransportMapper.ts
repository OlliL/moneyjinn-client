import type { EtfFlow } from "@/model/etf/EtfFlow";
import type { EtfEffectiveFlowTransport } from "@/model/rest/transport/EtfEffectiveFlowTransport";
import { mapEtfFlowTransportToModel } from "./EtfFlowTransportMapper";

export function mapEtfEffectiveFlowTransportToModel(
  transport: EtfEffectiveFlowTransport
): EtfFlow {
  return mapEtfFlowTransportToModel(transport);
}
