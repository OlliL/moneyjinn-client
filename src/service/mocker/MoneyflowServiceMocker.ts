import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import MoneyflowService from "@/service/MoneyflowService";
import { vi } from "vitest";

export default class MoneyflowServiceMocker {
  static mockSearchMoneyflowsResolved(moneyflows: Array<Moneyflow>): void {
    MoneyflowService.searchMoneyflows = vi.fn().mockResolvedValue(moneyflows);
  }

  static mockFetchMoneyflowById(
    createMoneyflow: (id: number) => Moneyflow,
  ): void {
    MoneyflowService.fetchMoneyflow = vi
      .fn()
      .mockImplementation(async (id: number) => createMoneyflow(id));
  }

  static mockCreateMoneyflowResolved(): void {
    MoneyflowService.createMoneyflow = vi.fn().mockResolvedValue(undefined);
  }

  static mockCreateMoneyflowRejected(error: unknown): void {
    MoneyflowService.createMoneyflow = vi.fn().mockRejectedValue(error);
  }

  static mockSearchMoneyflowsByAmountResolved(
    moneyflows: Array<Moneyflow>,
  ): void {
    MoneyflowService.searchMoneyflowsByAmount = vi
      .fn()
      .mockResolvedValue(moneyflows);
  }
}
