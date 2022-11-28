import type { MoneyflowSplitEntryTransport } from "../transport/MoneyflowSplitEntryTransport";
import type { MoneyflowTransport } from "../transport/MoneyflowTransport";

export type UpdateMoneyflowRequest = {
  updateMoneyflowRequest: {
    moneyflowTransport: MoneyflowTransport;
    deleteMoneyflowSplitEntryIds?: Array<number>;
    updateMoneyflowSplitEntryTransport?: Array<MoneyflowSplitEntryTransport>;
    insertMoneyflowSplitEntryTransport?: Array<MoneyflowSplitEntryTransport>;
  };
};
