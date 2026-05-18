import type { MoneyflowReceipt } from "@/model/moneyflow/MoneyflowReceipt";
import MoneyflowReceiptService from "@/service/MoneyflowReceiptService";
import { vi } from "vitest";

export default class MoneyflowReceiptServiceMocker {
  static mockFetchReceiptResolved(moneyflowReceipt: MoneyflowReceipt): void {
    MoneyflowReceiptService.fetchReceipt = vi.fn().mockResolvedValue(
      moneyflowReceipt,
    );
  }
}

