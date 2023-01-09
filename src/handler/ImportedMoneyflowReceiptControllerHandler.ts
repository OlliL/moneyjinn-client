import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import type { ErrorResponse } from "@/model/rest/ErrorResponse";
import type { CreateImportedMoneyflowReceiptsRequest } from "@/model/rest/importedmoneyflowreceipt/CreateImportedMoneyflowReceiptsRequest";
import type { ShowImportImportedMoneyflowReceiptsResponse } from "@/model/rest/importedmoneyflowreceipt/ShowImportImportedMoneyflowReceiptsResponse";
import type { ValidationResponse } from "@/model/rest/ValidationResponse";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import type { ValidationResultItem } from "@/model/validation/ValidationResultItem";
import { throwError } from "@/tools/views/ThrowError";
import AbstractControllerHandler from "./AbstractControllerHandler";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";

class ImportedMoneyflowReceiptControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "importedmoneyflowreceipt";

  async showImportImportedMoneyflowReceipts(): Promise<
    Array<ImportedMoneyflowReceipt>
  > {
    const usecase = "showImportImportedMoneyflowReceipts";

    const response = await super.get(
      ImportedMoneyflowReceiptControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showImportImportedMoneyflowReceiptsResponse =
      (await response.json()) as ShowImportImportedMoneyflowReceiptsResponse;

    const result: Array<ImportedMoneyflowReceipt> =
      showImportImportedMoneyflowReceiptsResponse.importedMoneyflowReceiptTransports;

    return result;
  }

  async deleteImportedMoneyflowReceiptById(id: number) {
    const usecase = "deleteImportedMoneyflowReceiptById/" + id;

    const response = await super.delete(
      ImportedMoneyflowReceiptControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }

  async importImportedMoneyflowReceipt(
    id: number,
    moneyflowId: number
  ): Promise<ValidationResult> {
    const usecase = "importImportedMoneyflowReceipt/" + id + "/" + moneyflowId;

    const response = await super.post(
      null,
      ImportedMoneyflowReceiptControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const validationResult = {} as ValidationResult;
    if (response.status === 204) {
      validationResult.result = true;
    } else {
      const errorResponse = (await response.json()) as ErrorResponse;
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
    const usecase = "createImportedMoneyflowReceipts";

    const request = {} as CreateImportedMoneyflowReceiptsRequest;
    request.importedMoneyflowReceiptTransports = receipts;

    const response = await super.post(
      request,
      ImportedMoneyflowReceiptControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const validationResult = {} as ValidationResult;
    if (response.status === 204) {
      validationResult.result = true;
    } else {
      const validationResponse = (await response.json()) as ValidationResponse;

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
