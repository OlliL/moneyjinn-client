import type { MoneyflowSplitEntryTransport } from "../transport/MoneyflowSplitEntryTransport";
import type { MoneyflowTransport } from "../transport/MoneyflowTransport";
import type { ValidationResponse } from "../ValidationResponse";

export type UpdateMoneyflowResponse = ValidationResponse & {
  moneyflowTransport: MoneyflowTransport;
  moneyflowSplitEntryTransports?: Array<MoneyflowSplitEntryTransport>;
  hasReceipt: boolean;
};
