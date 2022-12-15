import type { ErrorResponse } from "../ErrorResponse";
import type { ImportedMoneyflowTransport } from "../transport/ImportedMoneyflowTransport";

export type ShowAddImportedMoneyflowsResponse = ErrorResponse & {
  showAddImportedMoneyflowsResponse: {
    importedMoneyflowTransport: Array<ImportedMoneyflowTransport>;
  };
};
