import type { EtfEffectiveFlowTransport } from "@/api";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import { mapEtfFlowTransportToModel } from "./EtfFlowTransportMapper";

export function mapEtfEffectiveFlowTransportToModel(
  transport: EtfEffectiveFlowTransport,
): EtfFlow {
  const model = mapEtfFlowTransportToModel(transport);
  model.accumulatedPreliminaryLumpSum =
    transport.accumulatedPreliminaryLumpSum ?? 0;
  model.preliminaryLumpSumPerYear = transport.preliminaryLumpSumPerYear
    ? new Map(Object.entries(transport.preliminaryLumpSumPerYear))
    : new Map<string, number>();
  return model;
}
