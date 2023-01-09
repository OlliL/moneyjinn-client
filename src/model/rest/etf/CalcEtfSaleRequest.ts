export type CalcEtfSaleRequest = {
  isin: string;
  pieces: number;
  bidPrice: number;
  askPrice: number;
  transactionCosts: number;
};
