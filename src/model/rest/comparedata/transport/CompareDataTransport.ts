import type { MoneyflowTransport } from "../../transport/MoneyflowTransport";
import type { CompareDataDatasetTransport } from "./CompareDataDatasetTransport";

export type CompareDataTransport = {
  moneyflowTransport?: MoneyflowTransport;
  compareDataDatasetTransport?: CompareDataDatasetTransport;
};
