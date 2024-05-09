import { CapitalsourceState } from "@/model/capitalsource/CapitalsourceState";

export function mapCapitalsourceStateTransportToEnum(
  source: number,
): CapitalsourceState {
  if (source === 1) return CapitalsourceState.NON_CACHE;
  return CapitalsourceState.CACHE;
}

export function mapCapitalsourceStateEnumToTransport(
  source: CapitalsourceState,
): number {
  if (source === CapitalsourceState.NON_CACHE) return 1;
  return 2;
}
