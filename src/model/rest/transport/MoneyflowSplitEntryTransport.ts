export type MoneyflowSplitEntryTransport = {
  id: number;
  moneyflowid: number;
  amount: number;
  comment: string;
  postingaccountid: number;
  postingaccountname?: string;
};
