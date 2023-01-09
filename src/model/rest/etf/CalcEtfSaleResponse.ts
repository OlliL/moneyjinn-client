import type { ValidationResponse } from "../ValidationResponse";

export type CalcEtfSaleResponse = ValidationResponse & {
  isin: string;
  originalBuyPrice: number;
  sellPrice: number;
  newBuyPrice: number;
  profit: number;
  chargeable: number;
  transactionCosts: number;
  rebuyLosses: number;
  overallCosts: number;
  pieces: number;
};
