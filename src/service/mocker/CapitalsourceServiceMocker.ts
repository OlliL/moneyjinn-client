import type { BackendError } from "@/model/BackendError";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import CapitalsourceService from "@/service/CapitalsourceService";
import { vi } from "vitest";

export default class CapitalsourceServiceMocker {
  static mockFetchAllCapitalsource(capitalsources: Capitalsource[]): void {
    CapitalsourceService.fetchAllCapitalsource = vi
      .fn()
      .mockResolvedValue(capitalsources);
  }

  static mockCreateCapitalsourceResolved(): void {
    CapitalsourceService.createCapitalsource = vi
      .fn()
      .mockResolvedValue(undefined);
  }

  static mockCreateCapitalsourceRejected(error: BackendError): void {
    CapitalsourceService.createCapitalsource = vi.fn().mockRejectedValue(error);
  }

  static mockUpdateCapitalsourceResolved(): void {
    CapitalsourceService.updateCapitalsource = vi
      .fn()
      .mockResolvedValue(undefined);
  }
}
