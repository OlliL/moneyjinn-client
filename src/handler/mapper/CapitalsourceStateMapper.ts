import { CapitalsourceState } from "@/model/capitalsource/CapitalsourceState";

export function mapCapitalsourceStateTransportToEnum(
  source: number,
): CapitalsourceState {
  switch (source) {
    case 1: {
      return CapitalsourceState.NON_CACHE;
    }
    default: {
      // 2
      return CapitalsourceState.CACHE;
    }
  }
}

export function mapCapitalsourceStateEnumToTransport(
  source: CapitalsourceState,
): number {
  switch (source) {
    case CapitalsourceState.NON_CACHE: {
      return 1;
    }
    default: {
      // CapitalsourceState.CACHE
      return 2;
    }
  }
}
