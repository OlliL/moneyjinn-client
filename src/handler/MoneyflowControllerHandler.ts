import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { CreateMoneyflowRequest } from "@/model/rest/moneyflow/CreateMoneyflowRequest";
import type { ValidationResponse } from "@/model/rest/ValidationResponse";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { mapMoneyflowSplitEntryToTransport } from "./mapper/MoneyflowSplitEntryTransportMapper";
import { mapMoneyflowToTransport } from "./mapper/MoneyflowTransportMapper";
import { mapValidationResponseToModel } from "./mapper/ValidationResponseMapper";

class MoneyflowControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "moneyflow";

  async createMoneyflow(
    moneyflow: Moneyflow,
    usedPreDefMoneyflowId: number,
    saveAsPreDefMoneyflow: boolean
  ): Promise<ValidationResult> {
    const usecase = "createMoneyflow";

    const request = { createMoneyflowRequest: {} } as CreateMoneyflowRequest;
    const innerRequest = request.createMoneyflowRequest;
    innerRequest.moneyflowTransport = mapMoneyflowToTransport(moneyflow);
    if (usedPreDefMoneyflowId != 0) {
      innerRequest.usedPreDefMoneyflowId = usedPreDefMoneyflowId;
    }
    if (saveAsPreDefMoneyflow) {
      innerRequest.saveAsPreDefMoneyflow = saveAsPreDefMoneyflow ? 1 : 0;
    }
    if (moneyflow.moneyflowSplitEntries) {
      const mse = moneyflow.moneyflowSplitEntries.filter(
        (mse) => mse.amount != 0
      );
      innerRequest.insertMoneyflowSplitEntryTransport = mse.map((mse) => {
        return mapMoneyflowSplitEntryToTransport(mse);
      });
    }

    const response = await super.post(
      request,
      MoneyflowControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    if (response.status === 204) {
      return { result: true } as ValidationResult;
    }

    const validationResponse = (await response.json()) as ValidationResponse;
    const validationResult = mapValidationResponseToModel(validationResponse);
    return validationResult;
  }
}

export default new MoneyflowControllerHandler();
