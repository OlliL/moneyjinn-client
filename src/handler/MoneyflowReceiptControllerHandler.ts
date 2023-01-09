import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import { ErrorCode } from "@/model/ErrorCode";
import type { MoneyflowReceipt } from "@/model/moneyflow/MoneyflowReceipt";
import { MoneyflowReceiptType } from "@/model/moneyflow/MoneyflowReceiptType";
import type { ShowMoneyflowReceiptResponse } from "@/model/rest/moneyflow/ShowMoneyflowReceiptResponse";
import { throwError } from "@/tools/views/ThrowError";

class MoneyflowReceiptControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "moneyflowreceipt";

  async fetchReceipt(moneyflowId: number): Promise<MoneyflowReceipt> {
    const usecase = "showMoneyflowReceipt/" + moneyflowId;
    const response = await super.get(
      MoneyflowReceiptControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showMoneyflowReceiptResponse =
      (await response.json()) as ShowMoneyflowReceiptResponse;

    if (showMoneyflowReceiptResponse.errorResponse) {
      throwError(showMoneyflowReceiptResponse.errorResponse.code);
    }

    let receiptType: MoneyflowReceiptType;
    switch (showMoneyflowReceiptResponse.receiptType) {
      case 1: {
        receiptType = MoneyflowReceiptType.JPEG;
        break;
      }
      case 2: {
        receiptType = MoneyflowReceiptType.PDF;
        break;
      }
      default: {
        receiptType = MoneyflowReceiptType.UNKNOWN;
        throwError(ErrorCode.MEDIA_TYPE_UNKNOWN);
      }
    }

    const moneyflowReceipt: MoneyflowReceipt = {
      moneyflowId: moneyflowId,
      receipt: showMoneyflowReceiptResponse.receipt,
      receiptType: receiptType,
    };

    return moneyflowReceipt;
  }
  async deleteMoneyflowReceipt(moneyflowId: number) {
    const usecase = "deleteMoneyflowReceipt/" + moneyflowId;

    const response = await super.delete(
      MoneyflowReceiptControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }
}

export default new MoneyflowReceiptControllerHandler();
