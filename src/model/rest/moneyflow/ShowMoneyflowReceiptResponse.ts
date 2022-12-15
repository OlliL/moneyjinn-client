import type { ErrorResponse } from "../ErrorResponse";

export type ShowMoneyflowReceiptResponse = ErrorResponse & {
  showMoneyflowReceiptResponse: {
    receipt: string;
    receiptType: number;
  };
};
