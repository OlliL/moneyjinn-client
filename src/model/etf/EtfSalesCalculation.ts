import type { ValidationResult } from "../validation/ValidationResult";

export type EtfSalesCalculation = {
  validationResult: ValidationResult;
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
