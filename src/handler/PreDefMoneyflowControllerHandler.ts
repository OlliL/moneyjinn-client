import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import type { PreDefMoneyflowValidation } from "@/model/moneyflow/PreDefMoneyflowValidation";
import type { ShowPreDefMoneyflowListResponse } from "@/model/rest/predefmoneyflow/ShowPreDefMoneyflowListResponse";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { throwError } from "@/tools/views/ThrowError";
import { mapPreDefMoneyflowTransportToModel } from "./mapper/PreDefMoneyflowTransportMapper";

class PreDefMoneyflowControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "predefmoneyflow";

  async fetchAllPreDefMoneyflow(): Promise<Array<PreDefMoneyflow>> {
    const usecase = "showPreDefMoneyflowList/all";
    const response = await super.get(
      PreDefMoneyflowControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showPreDefMoneyflowListResponse =
      (await response.json()) as ShowPreDefMoneyflowListResponse;

    if (showPreDefMoneyflowListResponse.error) {
      throwError(showPreDefMoneyflowListResponse.error.code);
    }

    const PreDefMoneyflowArray = new Array<PreDefMoneyflow>();
    const transport = await showPreDefMoneyflowListResponse
      .showPreDefMoneyflowListResponse.preDefMoneyflowTransport;
    transport?.forEach((value) => {
      PreDefMoneyflowArray.push(mapPreDefMoneyflowTransportToModel(value));
    });

    return PreDefMoneyflowArray;
  }

  async createPreDefMoneyflow(
    mpm: PreDefMoneyflow
  ): Promise<PreDefMoneyflowValidation> {
    return { validationResult: { result: true } } as PreDefMoneyflowValidation;
  }
  async updatePreDefMoneyflow(mpm: PreDefMoneyflow): Promise<ValidationResult> {
    return { result: true } as ValidationResult;
  }
  async deletePreDefMoneyflow(id: number) {}
}

export default new PreDefMoneyflowControllerHandler();
