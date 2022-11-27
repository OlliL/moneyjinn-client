import type { MoneyflowSplitEntryTransport } from "../transport/MoneyflowSplitEntryTransport";
import type { MoneyflowTransport } from "../transport/MoneyflowTransport";

export type CreateMoneyflowRequest = {
  createMoneyflowRequest: {
    moneyflowTransport: MoneyflowTransport;
    insertMoneyflowSplitEntryTransport?: Array<MoneyflowSplitEntryTransport>;
    usedPreDefMoneyflowId?: number;
    saveAsPreDefMoneyflow?: number;
  };
};
