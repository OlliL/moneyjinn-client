import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import CapitalsourceService from "@/service/CapitalsourceService";
import { vi } from "vitest";

export default class CapitalsourceServiceMocker {
  static mockFetchAllCapitalsource(capitalsources: Capitalsource[]): void {
    CapitalsourceService.fetchAllCapitalsource = vi
      .fn()
      .mockResolvedValue(capitalsources);
  }
}

