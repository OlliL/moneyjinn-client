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

    super.handleResponseError(response);

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
    const response = await this.api.deleteImportedMoneyflowReceiptById(id);
    return super.handleResponseError(response);
  }

  async importImportedMoneyflowReceipt(
    id: number,
    moneyflowId: number
  ): Promise<ValidationResult> {
    const response = await this.api.importImportedMoneyflowReceipt(
      id,
      moneyflowId
    );

    super.handleResponseError(response);

    const validationResult = {} as ValidationResult;
    if (response.status === 204) {
      validationResult.result = true;
    } else {
      const errorResponse = response.data;
      const validationResultItem = {
        error: errorResponse.code,
      } as ValidationResultItem;
      validationResult.result = false;
      validationResult.validationResultItems = [validationResultItem];
    }
    return validationResult;
  }

  async createImportedMoneyflowReceipts(
    receipts: Array<ImportedMoneyflowReceipt>
  ): Promise<ValidationResult> {
    const request = {} as CreateImportedMoneyflowReceiptsRequest;
    request.importedMoneyflowReceiptTransports = receipts;

    const response = await this.api.createImportedMoneyflowReceipts(request);

    super.handleResponseError(response);

    const validationResult = {} as ValidationResult;
    if (response.status === 204) {
      validationResult.result = true;
    } else {
      const validationResponse = response.data;

      if (validationResponse.code) {
        throwError(validationResponse.code);
      }

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
