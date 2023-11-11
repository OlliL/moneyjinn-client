import {
  ImportedMoneyflowReceiptControllerApi,
  type CreateImportedMoneyflowReceiptsRequest,
} from "@/api";
import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import AbstractControllerHandler from "./AbstractControllerHandler";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";

class ImportedMoneyflowReceiptControllerHandler extends AbstractControllerHandler {
  private api: ImportedMoneyflowReceiptControllerApi;

  public constructor() {
    super();

    this.api = new ImportedMoneyflowReceiptControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance(),
    );
  }

  async showImportImportedMoneyflowReceipts(): Promise<
    Array<ImportedMoneyflowReceipt>
  > {
    const response = await this.api.showImportImportedMoneyflowReceipts();

    const showImportImportedMoneyflowReceiptsResponse = response.data;

    const result = new Array<ImportedMoneyflowReceipt>();
    if (
      showImportImportedMoneyflowReceiptsResponse.importedMoneyflowReceiptTransports
    ) {
      for (const mimr of showImportImportedMoneyflowReceiptsResponse.importedMoneyflowReceiptTransports) {
        result.push(mimr);
      }
    }

    return result;
  }

  async deleteImportedMoneyflowReceiptById(id: number) {
    await this.api.deleteImportedMoneyflowReceiptById(id);
  }

  async importImportedMoneyflowReceipt(id: number, moneyflowId: number) {
    await this.api.importImportedMoneyflowReceipt(id, moneyflowId);
  }

  async createImportedMoneyflowReceipts(
    receipts: Array<ImportedMoneyflowReceipt>,
  ) {
    const request = {} as CreateImportedMoneyflowReceiptsRequest;
    request.importedMoneyflowReceiptTransports = receipts;

    await this.api.createImportedMoneyflowReceipts(request);
  }
}
export default new ImportedMoneyflowReceiptControllerHandler();
