import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { ShowMoneyflowReceiptResponse } from "@/model/rest/moneyflow/ShowMoneyflowReceiptResponse";
import { throwError } from "@/tools/views/ThrowError";

class MoneyflowReceiptControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "moneyflowreceipt";

  async fetchReceipt(moneyflowId: number): Promise<string> {
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

    if (showMoneyflowReceiptResponse.error) {
      throwError(showMoneyflowReceiptResponse.error.code);
    }

    // FIXME: receiptType!
    return showMoneyflowReceiptResponse.showMoneyflowReceiptResponse.receipt;
  }
}

export default new MoneyflowReceiptControllerHandler();
