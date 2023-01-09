import type { ErrorResponse } from "../ErrorResponse";
import type { MoneyflowSplitEntryTransport } from "../transport/MoneyflowSplitEntryTransport";
import type { MoneyflowTransport } from "../transport/MoneyflowTransport";

export type ShowEditMoneyflowResponse = ErrorResponse & {
  moneyflowTransport: MoneyflowTransport;
  moneyflowSplitEntryTransports?: Array<MoneyflowSplitEntryTransport>;
  hasReceipt: boolean;
};
