import type { MoneyflowSplitEntry } from "./MoneyflowSplitEntry";

export type Moneyflow = {
  id: number;
  userId: number;
  bookingDate: Date;
  invoiceDate: Date;
  amount: number;
  capitalsourceId: number;
  capitalsourceComment: string;
  contractpartnerId: number;
  contractpartnerName: string;
  comment: string;
  private: boolean;
  postingAccountId: number;
  postingAccountName: string;
  moneyflowSplitEntries?: Array<MoneyflowSplitEntry>;
  hasReceipt: boolean;
};
