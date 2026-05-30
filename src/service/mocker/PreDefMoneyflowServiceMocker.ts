import type { BackendError } from "@/model/BackendError";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import { vi } from "vitest";

export default class PreDefMoneyflowServiceMocker {
  static mockFetchAllPreDefMoneyflow(
    preDefMoneyflows: PreDefMoneyflow[],
  ): void {
    PreDefMoneyflowService.fetchAllPreDefMoneyflow = vi
      .fn()
      .mockResolvedValue(preDefMoneyflows);
  }

  static mockCreatePreDefMoneyflowResolved(): void {
    PreDefMoneyflowService.createPreDefMoneyflow = vi
      .fn()
      .mockResolvedValue(undefined);
  }

  static mockCreatePreDefMoneyflowRejected(error: BackendError): void {
    PreDefMoneyflowService.createPreDefMoneyflow = vi
      .fn()
      .mockRejectedValue(error);
  }

  static mockUpdatePreDefMoneyflowResolved(): void {
    PreDefMoneyflowService.updatePreDefMoneyflow = vi
      .fn()
      .mockResolvedValue(undefined);
  }
}
