import type { ImportedMoneyflowReceiptTransport } from "../transport/ImportedMoneyflowReceiptTransport";
import type { ValidationResponse } from "../ValidationResponse";

export type ShowImportImportedMoneyflowReceiptsResponse = ValidationResponse & {
  importedMoneyflowReceiptTransports: Array<ImportedMoneyflowReceiptTransport>;
};
