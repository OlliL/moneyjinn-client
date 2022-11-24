import type { MoneyflowReceiptType } from "@/model/moneyflow/MoneyflowReceiptType";

export type MoneyflowReceipt = {
  moneyflowId: number;
  receipt: string;
  receiptType: MoneyflowReceiptType;
};
