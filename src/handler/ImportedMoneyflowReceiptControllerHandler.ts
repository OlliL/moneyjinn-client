import type { ImportedMoneyflowReceipt } from "@/model/moneyflow/ImportedMoneyflowReceipt";
import type { ErrorResponse } from "@/model/rest/ErrorResponse";
import type { ShowImportImportedMoneyflowReceiptsResponse } from "@/model/rest/importedmoneyflowreceipt/ShowImportImportedMoneyflowReceiptsResponse";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import type { ValidationResultItem } from "@/model/validation/ValidationResultItem";
import AbstractControllerHandler from "./AbstractControllerHandler";

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

    const data =
      showImportImportedMoneyflowReceiptsResponse.showImportImportedMoneyflowReceiptsResponse;

    const result: Array<ImportedMoneyflowReceipt> =
      data.importedMoneyflowReceiptTransport;

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
        error: errorResponse.error.code,
      } as ValidationResultItem;
      console.log(errorResponse, validationResultItem);
      validationResult.result = false;
      validationResult.validationResultItems = [validationResultItem];
      console.log(validationResult);
    }
    return validationResult;
  }
}
export default new ImportedMoneyflowReceiptControllerHandler();
