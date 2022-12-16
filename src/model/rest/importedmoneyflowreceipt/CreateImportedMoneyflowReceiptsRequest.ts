import type { ImportedMoneyflowReceiptTransport } from "../transport/ImportedMoneyflowReceiptTransport";

export type CreateImportedMoneyflowReceiptsRequest = {
  createImportedMoneyflowReceiptsRequest: {
    importedMoneyflowReceiptTransport: Array<ImportedMoneyflowReceiptTransport>;
  };
};
