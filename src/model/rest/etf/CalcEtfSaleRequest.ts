export type CalcEtfSaleRequest = {
  calcEtfSaleRequest: {
    isin: string;
    pieces: number;
    bidPrice: number;
    askPrice: number;
    TransactionCosts: number;
  };
};
