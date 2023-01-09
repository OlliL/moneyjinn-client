import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { ShowAddImportedMoneyflowsResponse } from "@/model/rest/importedmoneyflow/ShowAddImportedMoneyflowsResponse";
import type { ImportImportedMoneyflowRequest } from "@/model/rest/importedmoneyflow/ImportImportedMoneyflowRequest";
import {
  mapImportedMoneyflowToTransport,
  mapImportedMoneyflowTransportToModel,
} from "./mapper/ImportedMoneyflowTransportMapper";
import type { ImportedMoneyflow } from "@/model/moneyflow/ImportedMoneyflow";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { mapMoneyflowSplitEntryToTransport } from "./mapper/MoneyflowSplitEntryTransportMapper";
import type { ValidationResponse } from "@/model/rest/ValidationResponse";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";

class ImportedMoneyflowControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "importedmoneyflow";

  async showAddImportedMoneyflows(): Promise<Array<ImportedMoneyflow>> {
    const usecase = "showAddImportedMoneyflows";

    const response = await super.get(
      ImportedMoneyflowControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showAddImportedMoneyflowsResponse =
      (await response.json()) as ShowAddImportedMoneyflowsResponse;

    const result: Array<ImportedMoneyflow> =
      showAddImportedMoneyflowsResponse.importedMoneyflowTransports?.map(
        (mim) => {
          return mapImportedMoneyflowTransportToModel(mim);
        }
      );

    return result;
  }

  async importImportedMoneyflow(
    importedMoneyflow: ImportedMoneyflow
  ): Promise<ValidationResult> {
    const usecase = "importImportedMoneyflows";

    const transport = mapImportedMoneyflowToTransport(importedMoneyflow);
    const request = {} as ImportImportedMoneyflowRequest;
    request.importedMoneyflowTransport = transport;
    if (importedMoneyflow.moneyflowSplitEntries) {
      request.insertMoneyflowSplitEntryTransports =
        importedMoneyflow.moneyflowSplitEntries.map((mse) => {
          return mapMoneyflowSplitEntryToTransport(mse);
        });
    }

    const response = await super.post(
      request,
      ImportedMoneyflowControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    if (response.status === 204) {
      return { result: true } as ValidationResult;
    }
    const validationResponse = (await response.json()) as ValidationResponse;
    const validationResult: ValidationResult = {
      result: validationResponse.result,
      validationResultItems: validationResponse.validationItemTransports?.map(
        (vit) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    return validationResult;
  }
  async deleteImportedMoneyflow(importedMoneyflowId: number) {
    const usecase = "deleteImportedMoneyflowById/" + importedMoneyflowId;

    const response = await super.delete(
      ImportedMoneyflowControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }
}

export default new ImportedMoneyflowControllerHandler();
