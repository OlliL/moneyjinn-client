export type EtfSalesCalculation = {
  etfId: number;
  originalBuyPrice: number;
  sellPrice: number;
  newBuyPrice: number;
  profit: number;
  accumulatedPreliminaryLumpSum: number;
  chargeable: number;
  transactionCostsAbsoluteSell: number;
  transactionCostsAbsoluteBuy: number;
  transactionCostsRelativeSell: number;
  transactionCostsRelativeBuy: number;
  rebuyLosses: number;
  overallCosts: number;
  pieces: number;
};
