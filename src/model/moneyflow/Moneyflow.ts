import type { MoneyflowSplitEntry } from "./MoneyflowSplitEntry";

export type Moneyflow = {
  id: number;
  userid: number;
  bookingdate: Date;
  invoicedate: Date;
  amount: number;
  capitalsourceid: number;
  capitalsourcecomment: string;
  contractpartnerid: number;
  contractpartnername: string;
  comment: string;
  private: boolean;
  postingaccountid: number;
  postingaccountname: string;
  moneyflowSplitEntries?: Array<MoneyflowSplitEntry>;
  hasReceipt: boolean;
};
