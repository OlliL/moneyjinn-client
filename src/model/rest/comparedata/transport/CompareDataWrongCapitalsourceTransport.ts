import type { MoneyflowTransport } from "../../transport/MoneyflowTransport";
import type { CompareDataDatasetTransport } from "./CompareDataDatasetTransport";

export type CompareDataWrongCapitalsourceTransport = {
  moneyflowTransport: MoneyflowTransport;
  compareDataDatasetTransport: CompareDataDatasetTransport;
};
