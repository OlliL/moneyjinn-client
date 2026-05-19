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
}
