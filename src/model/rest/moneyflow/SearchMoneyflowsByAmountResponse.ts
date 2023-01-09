import type { ErrorResponse } from "../ErrorResponse";
import type { MoneyflowSplitEntryTransport } from "../transport/MoneyflowSplitEntryTransport";
import type { MoneyflowTransport } from "../transport/MoneyflowTransport";

export type SearchMoneyflowsByAmountResponse = ErrorResponse & {
  moneyflowTransports: Array<MoneyflowTransport>;
  moneyflowSplitEntryTransports: Array<MoneyflowSplitEntryTransport>;
};
