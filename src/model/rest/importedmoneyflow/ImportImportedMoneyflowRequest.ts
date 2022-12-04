import type { ImportedMoneyflowTransport } from "../transport/ImportedMoneyflowTransport";
import type { MoneyflowSplitEntryTransport } from "../transport/MoneyflowSplitEntryTransport";

export type ImportImportedMoneyflowRequest = {
  importImportedMoneyflowRequest: {
    importedMoneyflowTransport: ImportedMoneyflowTransport;
    insertMoneyflowSplitEntryTransport?: Array<MoneyflowSplitEntryTransport>;
  };
};
