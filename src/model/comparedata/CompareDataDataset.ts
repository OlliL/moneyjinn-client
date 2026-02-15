export type CompareDataDataset = {
  bookingDate: Date;
  invoiceDate?: Date;
  amount: number;
  partner: string;
  contractpartnerId?: number;
  contractpartnerName?: string;
  comment: string;
  moneyflowComment?: string;
  postingAccountName?: string;
  postingAccountId?: number;
};
