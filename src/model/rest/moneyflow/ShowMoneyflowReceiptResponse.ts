import type { AbstractResponse } from "../AbstractResponse";

export type ShowMoneyflowReceiptResponse = AbstractResponse & {
  receipt: string;
  receiptType: number;
};
