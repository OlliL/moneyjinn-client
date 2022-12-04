import type { MoneyflowTransport } from "./MoneyflowTransport";

export type ImportedMoneyflowTransport = MoneyflowTransport & {
  accountNumber: string;
  bankCode: string;
  externalid: string;
  name: string;
  usage: string;
  accountNumberCapitalsource: string;
  bankCodeCapitalsource: string;
};
