import type { Etf } from "@/model/etf/Etf";
import CrudEtfService from "@/service/CrudEtfService";
import { vi } from "vitest";

export default class CrudEtfServiceMocker {
  static mockFetchAllEtf(etfs: Etf[]): void {
    CrudEtfService.fetchAllEtf = vi.fn().mockResolvedValue(etfs);
  }
}
