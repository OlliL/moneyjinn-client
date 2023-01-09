import type { MoneyflowTransport } from "../transport/MoneyflowTransport";
import type { ValidationResponse } from "../ValidationResponse";

export type SearchMoneyflowsResponse = ValidationResponse & {
  moneyflowTransports: Array<MoneyflowTransport>;
};
