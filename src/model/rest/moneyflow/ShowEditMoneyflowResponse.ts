import type { AbstractResponse } from "../AbstractResponse";
import type { MoneyflowSplitEntryTransport } from "../transport/MoneyflowSplitEntryTransport";
import type { MoneyflowTransport } from "../transport/MoneyflowTransport";

export type ShowEditMoneyflowResponse = AbstractResponse & {
  moneyflowTransport: MoneyflowTransport;
  moneyflowSplitEntryTransports?: Array<MoneyflowSplitEntryTransport>;
  hasReceipt: boolean;
};
