import type { ErrorResponse } from "../ErrorResponse";
import type { ImportedMoneyflowReceiptTransport } from "../transport/ImportedMoneyflowReceiptTransport";
import type { ValidationItemTransport } from "../transport/ValidationItemTransport";

export type ShowImportImportedMoneyflowReceiptsResponse = ErrorResponse & {
  showImportImportedMoneyflowReceiptsResponse: {
    result: boolean;
    validationItemTransport: Array<ValidationItemTransport>;
    importedMoneyflowReceiptTransport: Array<ImportedMoneyflowReceiptTransport>;
  };
};
