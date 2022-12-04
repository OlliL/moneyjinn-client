import type { Moneyflow } from "./Moneyflow";

export type ImportedMoneyflow = Moneyflow & {
  accountNumber: string;
  bankCode: string;
  externalid: string;
  name: string;
  usage: string;
  accountNumberCapitalsource: string;
  bankCodeCapitalsource: string;
};
