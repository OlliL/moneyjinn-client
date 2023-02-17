import type { EtfEffectiveFlowTransport } from "@/api";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import { mapEtfFlowTransportToModel } from "./EtfFlowTransportMapper";

export function mapEtfEffectiveFlowTransportToModel(
  transport: EtfEffectiveFlowTransport
): EtfFlow {
  return mapEtfFlowTransportToModel(transport);
}
