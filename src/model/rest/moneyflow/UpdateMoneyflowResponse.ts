import type { ErrorResponse } from "../ErrorResponse";
import type { MoneyflowSplitEntryTransport } from "../transport/MoneyflowSplitEntryTransport";
import type { MoneyflowTransport } from "../transport/MoneyflowTransport";
import type { ValidationItemTransport } from "../transport/ValidationItemTransport";

export type UpdateMoneyflowResponse = {
  error?: ErrorResponse;
  updateMoneyflowResponse: {
    result: boolean;
    validationItemTransport: Array<ValidationItemTransport>;
    moneyflowTransport: MoneyflowTransport;
    moneyflowSplitEntryTransport?: Array<MoneyflowSplitEntryTransport>;
    hasReceipt: boolean;
  };
};
