import type { ValidationItemTransport } from "../transport/ValidationItemTransport";

export type CalcEtfSaleResponse = {
  calcEtfSaleResponse: {
    result: boolean;
    validationItemTransport: Array<ValidationItemTransport>;
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
};
