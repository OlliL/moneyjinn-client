import type { BackendError } from "@/model/BackendError";
import type { Etf } from "@/model/etf/Etf";
import CrudEtfService from "@/service/CrudEtfService";
import { vi } from "vitest";

export default class CrudEtfServiceMocker {
  static mockFetchAllEtf(etfs: Etf[]): void {
    CrudEtfService.fetchAllEtf = vi.fn().mockResolvedValue(etfs);
  }

  static mockCreateEtfResolved(etf: Etf): void {
    CrudEtfService.createEtf = vi.fn().mockResolvedValue(etf);
  }

  static mockUpdateEtfResolved(): void {
    CrudEtfService.updateEtf = vi.fn().mockResolvedValue(undefined);
  }

  static mockCreateEtfRejected(error: BackendError): void {
    CrudEtfService.createEtf = vi.fn().mockRejectedValue(error);
  }
}
