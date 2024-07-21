import { CapitalsourceState } from "@/model/capitalsource/CapitalsourceState";

export function mapCapitalsourceStateTransportToEnum(
  source: number,
): CapitalsourceState {
  if (source === 1) return CapitalsourceState.NON_CASH;
  return CapitalsourceState.CASH;
}

export function mapCapitalsourceStateEnumToTransport(
  source: CapitalsourceState,
): number {
  if (source === CapitalsourceState.NON_CASH) return 1;
  return 2;
}
