import ImportedMoneyflowReceiptService from "@/service/ImportedMoneyflowReceiptService";
import { vi } from "vitest";
import type { BackendError } from "@/model/BackendError.ts";

export default class ImportedMoneyflowReceiptServiceMocker {
  static mockShowImportImportedMoneyflowReceipts(receipts: any[]) {
    ImportedMoneyflowReceiptService.showImportImportedMoneyflowReceipts = vi
      .fn()
      .mockResolvedValue(receipts);
  }

  static mockShowImportImportedMoneyflowReceiptsReject(error: BackendError) {
    ImportedMoneyflowReceiptService.showImportImportedMoneyflowReceipts = vi
      .fn()
      .mockRejectedValue(error);
  }

  static mockCreateImportedMoneyflowReceiptsResolved() {
    ImportedMoneyflowReceiptService.createImportedMoneyflowReceipts = vi
      .fn()
      .mockResolvedValue(undefined);
  }

  static mockCreateImportedMoneyflowReceiptsRejected(error: any) {
    ImportedMoneyflowReceiptService.createImportedMoneyflowReceipts = vi
      .fn()
      .mockRejectedValue(error);
  }

  static mockImportImportedMoneyflowReceiptResolved() {
    ImportedMoneyflowReceiptService.importImportedMoneyflowReceipt = vi
      .fn()
      .mockResolvedValue(undefined);
  }

  static mockDeleteImportedMoneyflowReceiptByIdResolved() {
    ImportedMoneyflowReceiptService.deleteImportedMoneyflowReceiptById = vi
      .fn()
      .mockResolvedValue(undefined);
  }
}
