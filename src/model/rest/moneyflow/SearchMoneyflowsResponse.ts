import type { ErrorResponse } from "../ErrorResponse";
import type { MoneyflowTransport } from "../transport/MoneyflowTransport";
import type { ValidationItemTransport } from "../transport/ValidationItemTransport";

export type SearchMoneyflowsResponse = {
  error?: ErrorResponse;
  searchMoneyflowsResponse: {
    result: boolean;
    validationItemTransport: Array<ValidationItemTransport>;
    moneyflowTransport: Array<MoneyflowTransport>;
  };
};
