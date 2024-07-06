import { CapitalsourceType } from "@/model/capitalsource/CapitalsourceType";

export function mapCapitalsourceTypeTransportToEnum(
  source: number,
): CapitalsourceType {
  switch (source) {
    case 1: {
      return CapitalsourceType.CURRENT_ASSET;
    }
    case 2: {
      return CapitalsourceType.LONG_TERM_ASSET;
    }
    case 3: {
      return CapitalsourceType.RESERVE_ASSET;
    }
    case 4: {
      return CapitalsourceType.PROVISION_ASSET;
    }
    default: {
      // 5
      return CapitalsourceType.CREDIT;
    }
  }
}

export function mapCapitalsourceTypeEnumToTransport(
  source: CapitalsourceType,
): number {
  switch (source) {
    case CapitalsourceType.CURRENT_ASSET: {
      return 1;
    }
    case CapitalsourceType.LONG_TERM_ASSET: {
      return 2;
    }
    case CapitalsourceType.RESERVE_ASSET: {
      return 3;
    }
    case CapitalsourceType.PROVISION_ASSET: {
      return 4;
    }
    default: {
      // CapitalsourceType.CREDIT
      return 5;
    }
  }
}
