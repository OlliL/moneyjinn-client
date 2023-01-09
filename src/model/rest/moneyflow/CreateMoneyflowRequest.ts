import type { MoneyflowSplitEntryTransport } from "../transport/MoneyflowSplitEntryTransport";
import type { MoneyflowTransport } from "../transport/MoneyflowTransport";

export type CreateMoneyflowRequest = {
  moneyflowTransport: MoneyflowTransport;
  insertMoneyflowSplitEntryTransports?: Array<MoneyflowSplitEntryTransport>;
  usedPreDefMoneyflowId?: number;
  saveAsPreDefMoneyflow?: number;
};
