import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { MoneyflowSplitEntry } from "@/model/moneyflow/MoneyflowSplitEntry";
import type { MoneyflowValidation } from "@/model/moneyflow/MoneyflowValidation";
import type { CreateMoneyflowRequest } from "@/model/rest/moneyflow/CreateMoneyflowRequest";
import type { UpdateMoneyflowRequest } from "@/model/rest/moneyflow/UpdateMoneyflowRequest";
import type { UpdateMoneyflowResponse } from "@/model/rest/moneyflow/UpdateMoneyflowResponse";
import type { ValidationResponse } from "@/model/rest/ValidationResponse";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { mapMoneyflowSplitEntryToTransport } from "./mapper/MoneyflowSplitEntryTransportMapper";
import {
  mapMoneyflowToTransport,
  mapMoneyflowTransportToModel,
} from "./mapper/MoneyflowTransportMapper";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";

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
      innerRequest.insertMoneyflowSplitEntryTransport =
        moneyflow.moneyflowSplitEntries.map((mse) => {
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
    const innerResponse = validationResponse.validationResponse;
    const validationResult: ValidationResult = {
      result: innerResponse.result,
      validationResultItems: innerResponse.validationItemTransport?.map(
        (vit) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    return validationResult;
  }
  async updateMoneyflow(
    moneyflow: Moneyflow,
    createMoneyflowSplitEntries: Array<MoneyflowSplitEntry>,
    updateMoneyflowSplitEntries: Array<MoneyflowSplitEntry>,
    deleteMoneyflowSplitEntryIds: Array<number>
  ): Promise<MoneyflowValidation> {
    const usecase = "updateMoneyflowV2";

    const request = { updateMoneyflowRequest: {} } as UpdateMoneyflowRequest;
    const innerRequest = request.updateMoneyflowRequest;
    innerRequest.moneyflowTransport = mapMoneyflowToTransport(moneyflow);
    innerRequest.insertMoneyflowSplitEntryTransport =
      createMoneyflowSplitEntries.map((mse) => {
        return mapMoneyflowSplitEntryToTransport(mse);
      });
    innerRequest.updateMoneyflowSplitEntryTransport =
      updateMoneyflowSplitEntries.map((mse) => {
        return mapMoneyflowSplitEntryToTransport(mse);
      });
    innerRequest.deleteMoneyflowSplitEntryIds = deleteMoneyflowSplitEntryIds;

    const response = await super.put(
      request,
      MoneyflowControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const updateMoneyflowResponse =
      (await response.json()) as UpdateMoneyflowResponse;
    const innerResponse = updateMoneyflowResponse.updateMoneyflowResponse;
    const moneyflowValidation = {} as MoneyflowValidation;
    const validationResult: ValidationResult = {
      result: innerResponse.result,
      validationResultItems: innerResponse.validationItemTransport?.map(
        (vit) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    moneyflowValidation.validationResult = validationResult;

    if (validationResult.result) {
      const mmf: Moneyflow = mapMoneyflowTransportToModel(
        innerResponse.moneyflowTransport,
        innerResponse.hasReceipt,
        innerResponse.moneyflowSplitEntryTransport
      );
      moneyflowValidation.mmf = mmf;
    }
    return moneyflowValidation;
  }
  async deleteMoneyflow(moneyflowId: number) {
    const usecase = "deleteMoneyflowById/" + moneyflowId;

    const response = await super.delete(
      MoneyflowControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }
}

export default new MoneyflowControllerHandler();
