import type { ImportedMoneyflowReceiptTransport } from "../transport/ImportedMoneyflowReceiptTransport";

export type CreateImportedMoneyflowReceiptsRequest = {
  importedMoneyflowReceiptTransports: Array<ImportedMoneyflowReceiptTransport>;
};
