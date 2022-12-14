import type { MoneyflowSplitEntryTransport } from "../transport/MoneyflowSplitEntryTransport";
import type { MoneyflowTransport } from "../transport/MoneyflowTransport";

export type SearchMoneyflowsByAmountResponse = {
  searchMoneyflowsByAmountResponse: {
    moneyflowTransport: Array<MoneyflowTransport>;
    moneyflowSplitEntryTransport: Array<MoneyflowSplitEntryTransport>;
  };
};
