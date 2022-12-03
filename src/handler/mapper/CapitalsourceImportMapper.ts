import { CapitalsourceImport } from "@/model/capitalsource/CapitalsourceImport";

export function mapCapitalsourceImportTransportToEnum(
  source: number
): CapitalsourceImport {
  switch (source) {
    case 2: {
      return CapitalsourceImport.BALANCE_ALLOWED;
    }
    case 1: {
      return CapitalsourceImport.ALL_ALLOWED;
    }
    default: {
      // 0
      return CapitalsourceImport.NOT_ALLOWED;
    }
  }
}

export function mapCapitalsourceImportEnumToTransport(
  source: CapitalsourceImport
): number {
  switch (source) {
    case CapitalsourceImport.BALANCE_ALLOWED: {
      return 2;
    }
    case CapitalsourceImport.ALL_ALLOWED: {
      return 1;
    }
    default: {
      // CapitalsourceImport.NOT_ALLOWED
      return 0;
    }
  }
}
