import {
  ImportedMoneyflowReceiptControllerApi,
  type CreateImportedMoneyflowReceiptsRequest,
} from "@/api";
import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import AbstractService from "./AbstractService";

class ImportedMoneyflowReceiptService extends AbstractService {
  private readonly api: ImportedMoneyflowReceiptControllerApi;

  public constructor() {
    super();

    this.api = super.createApi(ImportedMoneyflowReceiptControllerApi);
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
export default new ImportedMoneyflowReceiptService();
