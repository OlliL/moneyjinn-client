import type { ErrorResponse } from "../ErrorResponse";

export type ShowMoneyflowReceiptResponse = {
  error?: ErrorResponse;
  showMoneyflowReceiptResponse: {
    receipt: string;
    receiptType: number;
  };
};
