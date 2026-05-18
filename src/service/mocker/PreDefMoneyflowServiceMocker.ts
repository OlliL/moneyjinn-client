import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import PreDefMoneyflowService from "@/service/PreDefMoneyflowService";
import { vi } from "vitest";

export default class PreDefMoneyflowServiceMocker {
  static mockFetchAllPreDefMoneyflow(preDefMoneyflows: PreDefMoneyflow[]): void {
    PreDefMoneyflowService.fetchAllPreDefMoneyflow = vi
      .fn()
      .mockResolvedValue(preDefMoneyflows);
  }
}

