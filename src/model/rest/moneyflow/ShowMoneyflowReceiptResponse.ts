import type { ErrorResponse } from "../ErrorResponse";

export type ShowMoneyflowReceiptResponse = ErrorResponse & {
  receipt: string;
  receiptType: number;
};
