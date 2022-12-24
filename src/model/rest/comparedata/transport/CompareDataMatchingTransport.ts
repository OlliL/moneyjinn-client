import type { MoneyflowTransport } from "../../transport/MoneyflowTransport";
import type { CompareDataDatasetTransport } from "./CompareDataDatasetTransport";

export type CompareDataMatchingTransport = {
  moneyflowTransport: MoneyflowTransport;
  compareDataDatasetTransport: CompareDataDatasetTransport;
};
