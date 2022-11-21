import { CapitalsourceState } from "@/model/capitalsource/CapitalsourceState";

export function mapCapitalsourceStateTransportToEnum(
  source: number
): CapitalsourceState {
  switch (source) {
    case 1: {
      return CapitalsourceState.CACHE;
    }
    default: {
      // 2
      return CapitalsourceState.NON_CACHE;
    }
  }
}
