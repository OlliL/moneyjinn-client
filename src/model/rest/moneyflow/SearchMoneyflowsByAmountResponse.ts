import type { AbstractResponse } from "../AbstractResponse";
import type { MoneyflowSplitEntryTransport } from "../transport/MoneyflowSplitEntryTransport";
import type { MoneyflowTransport } from "../transport/MoneyflowTransport";

export type SearchMoneyflowsByAmountResponse = AbstractResponse & {
  moneyflowTransports: Array<MoneyflowTransport>;
  moneyflowSplitEntryTransports: Array<MoneyflowSplitEntryTransport>;
};
