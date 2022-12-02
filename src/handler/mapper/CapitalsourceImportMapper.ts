import { CapitalsourceImport } from "@/model/capitalsource/CapitalsourceImport";

export function mapCapitalsourceImportTransportToEnum(
  source: number
): CapitalsourceImport {
  switch (source) {
    case 0: {
      return CapitalsourceImport.NOT_ALLOWED;
    }
    case 1: {
      return CapitalsourceImport.ALL_ALLOWED;
    }
    default: {
      // 2
      return CapitalsourceImport.BALANCE_ALLOWED;
    }
  }
}

export function mapCapitalsourceImportEnumToTransport(
  source: CapitalsourceImport
): number {
  switch (source) {
    case CapitalsourceImport.NOT_ALLOWED: {
      return 0;
    }
    case CapitalsourceImport.ALL_ALLOWED: {
      return 1;
    }
    default: {
      // CapitalsourceImport.BALANCE_ALLOWED
      return 2;
    }
  }
}
