import {
  ImportedMoneyflowReceiptControllerApi,
  type CreateImportedMoneyflowReceiptsRequest,
} from "@/api";
import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import type { ValidationResultItem } from "@/model/validation/ValidationResultItem";
import { throwError } from "@/tools/views/ThrowError";
import AbstractControllerHandler from "./AbstractControllerHandler";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";

class ImportedMoneyflowReceiptControllerHandler extends AbstractControllerHandler {
  private api: ImportedMoneyflowReceiptControllerApi;

  public constructor() {
    super();

    this.api = new ImportedMoneyflowReceiptControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance()
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
    receipts: Array<ImportedMoneyflowReceipt>
  ): Promise<ValidationResult> {
    const request = {} as CreateImportedMoneyflowReceiptsRequest;
    request.importedMoneyflowReceiptTransports = receipts;

    const response = await this.api.createImportedMoneyflowReceipts(request);

    const validationResult = {} as ValidationResult;
    if (response.status === 204) {
      validationResult.result = true;
    } else {
      const validationResponse = response.data;

      validationResult.result = validationResponse.result;
      validationResult.validationResultItems =
        validationResponse.validationItemTransports?.map((vit) => {
          return mapValidationItemTransportToModel(vit);
        });
    }

    return validationResult;
  }
}
export default new ImportedMoneyflowReceiptControllerHandler();
