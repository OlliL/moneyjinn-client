import type { ImportedMoneyflowTransport } from "../transport/ImportedMoneyflowTransport";
import type { ValidationResponse } from "../ValidationResponse";

export type ShowAddImportedMoneyflowsResponse = ValidationResponse & {
  importedMoneyflowTransports: Array<ImportedMoneyflowTransport>;
};
