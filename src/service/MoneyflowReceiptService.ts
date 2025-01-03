import { MoneyflowReceiptControllerApi } from "@/api";
import AbstractService from "@/service/AbstractService";
import { ErrorCode, getErrorMessage } from "@/model/ErrorCode";
import type { MoneyflowReceipt } from "@/model/moneyflow/MoneyflowReceipt";
import { MoneyflowReceiptType } from "@/model/moneyflow/MoneyflowReceiptType";

class MoneyflowReceiptService extends AbstractService {
  private readonly api: MoneyflowReceiptControllerApi;

  public constructor() {
    super();

    this.api = super.createApi(MoneyflowReceiptControllerApi);
  }

  async fetchReceipt(moneyflowId: number): Promise<MoneyflowReceipt> {
    const response = await this.api.showMoneyflowReceipt(moneyflowId);

    const showMoneyflowReceiptResponse = response.data;

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
        throw new Error(getErrorMessage(ErrorCode.MEDIA_TYPE_UNKNOWN));
      }
    }

    const moneyflowReceipt: MoneyflowReceipt = {
      moneyflowId: moneyflowId,
      receipt: showMoneyflowReceiptResponse.receipt,
      receiptType: receiptType,
    };

    return moneyflowReceipt;
  }

  async deleteMoneyflowReceipt(id: number) {
    await this.api.deleteMoneyflowReceipt(id);
  }
}

export default new MoneyflowReceiptService();
