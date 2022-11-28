import type { MoneyflowSplitEntryTransport } from "../transport/MoneyflowSplitEntryTransport";
import type { MoneyflowTransport } from "../transport/MoneyflowTransport";
import type { ValidationItemTransport } from "../transport/ValidationItemTransport";

export type UpdateMoneyflowResponse = {
  updateMoneyflowResponse: {
    result: boolean;
    validationItemTransport: Array<ValidationItemTransport>;
    moneyflowTransport: MoneyflowTransport;
    moneyflowSplitEntryTransport?: Array<MoneyflowSplitEntryTransport>;
    hasReceipt: boolean;
  };
};
