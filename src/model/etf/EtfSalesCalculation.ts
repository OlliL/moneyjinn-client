export type EtfSalesCalculation = {
  isin: string;
  originalBuyPrice: number;
  sellPrice: number;
  newBuyPrice: number;
  profit: number;
  accumulatedPreliminaryLumpSum: number;
  chargeable: number;
  transactionCosts: number;
  rebuyLosses: number;
  overallCosts: number;
  pieces: number;
};
