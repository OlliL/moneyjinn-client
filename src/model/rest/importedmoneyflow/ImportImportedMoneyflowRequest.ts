import type { ImportedMoneyflowTransport } from "../transport/ImportedMoneyflowTransport";
import type { MoneyflowSplitEntryTransport } from "../transport/MoneyflowSplitEntryTransport";

export type ImportImportedMoneyflowRequest = {
  importedMoneyflowTransport: ImportedMoneyflowTransport;
  insertMoneyflowSplitEntryTransports?: Array<MoneyflowSplitEntryTransport>;
};
