import type { MoneyflowSplitEntryTransport } from "../transport/MoneyflowSplitEntryTransport";
import type { MoneyflowTransport } from "../transport/MoneyflowTransport";

export type UpdateMoneyflowRequest = {
  moneyflowTransport: MoneyflowTransport;
  deleteMoneyflowSplitEntryIds?: Array<number>;
  updateMoneyflowSplitEntryTransports?: Array<MoneyflowSplitEntryTransport>;
  insertMoneyflowSplitEntryTransports?: Array<MoneyflowSplitEntryTransport>;
};
