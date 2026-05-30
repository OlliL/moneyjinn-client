import { BackendError } from "@/model/BackendError";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import CrudEtfPreliminaryLumpSumService from "@/service/CrudEtfPreliminaryLumpSumService";
import { vi } from "vitest";

export default class CrudEtfPreliminaryLumpSumServiceMocker {
  static mockFetchAllEtfPreliminaryLumpSum(
    items: EtfPreliminaryLumpSum[],
  ): void {
    CrudEtfPreliminaryLumpSumService.fetchAllEtfPreliminaryLumpSum = vi
      .fn()
      .mockResolvedValue(items);
  }

  static mockCreateEtfPreliminaryLumpSumResolved(
    mep: EtfPreliminaryLumpSum,
  ): void {
    CrudEtfPreliminaryLumpSumService.createEtfPreliminaryLumpSum = vi
      .fn()
      .mockResolvedValue(mep);
  }

  static mockUpdateEtfPreliminaryLumpSumResolved(): void {
    CrudEtfPreliminaryLumpSumService.updateEtfPreliminaryLumpSum = vi
      .fn()
      .mockResolvedValue(undefined);
  }

  static mockCreateEtfPreliminaryLumpSumRejected(error: BackendError): void {
    CrudEtfPreliminaryLumpSumService.createEtfPreliminaryLumpSum = vi
      .fn()
      .mockRejectedValue(error);
  }
}
