import ImportedMoneyflowService from "@/service/ImportedMoneyflowService";
import { vi } from "vitest";

export default class ImportedMoneyflowServiceMocker {
  static mockImportImportedMoneyflowResolved(): void {
    ImportedMoneyflowService.importImportedMoneyflow = vi
      .fn()
      .mockResolvedValue(undefined);
  }

  static mockDeleteImportedMoneyflowByIdResolved(): void {
    ImportedMoneyflowService.deleteImportedMoneyflow = vi
      .fn()
      .mockResolvedValue(undefined);
  }
}
