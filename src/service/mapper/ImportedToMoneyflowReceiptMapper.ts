import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import type { MoneyflowReceipt } from "@/model/moneyflow/MoneyflowReceipt";
import { MoneyflowReceiptType } from "@/model/moneyflow/MoneyflowReceiptType";

export function mapImportedMoneyflowReceiptToMoneyflowReceipt(
  importedReceipt: ImportedMoneyflowReceipt,
): MoneyflowReceipt {
  let mediaType = MoneyflowReceiptType.UNKNOWN;
  switch (importedReceipt.mediaType) {
    case "image/jpeg":
      mediaType = MoneyflowReceiptType.JPEG;
      break;
    case "application/pdf":
      mediaType = MoneyflowReceiptType.PDF;
      break;
  }
  return {
    moneyflowId: 0,
    receipt: importedReceipt.receipt,
    receiptType: mediaType,
  };
}
