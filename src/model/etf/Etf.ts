export type Etf = {
  id: number;
  userId: number;
  isin: string;
  name: string;
  wkn: string;
  ticker: string;
  chartUrl: string;
  transactionCostsAbsolute?: number;
  transactionCostsRelative?: number;
  transactionCostsMaximum?: number;
  partialTaxExemption?: number;
  isFavorite: boolean;
};
