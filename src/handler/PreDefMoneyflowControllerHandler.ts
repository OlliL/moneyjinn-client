import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import type { PreDefMoneyflowValidation } from "@/model/moneyflow/PreDefMoneyflowValidation";
import type { CreatePreDefMoneyflowRequest } from "@/model/rest/predefmoneyflow/CreatePreDefMoneyflowRequest";
import type { CreatePreDefMoneyflowResponse } from "@/model/rest/predefmoneyflow/CreatePreDefMoneyflowResponse";
import type { ShowPreDefMoneyflowListResponse } from "@/model/rest/predefmoneyflow/ShowPreDefMoneyflowListResponse";
import type { UpdatePreDefMoneyflowRequest } from "@/model/rest/predefmoneyflow/UpdatePreDefMoneyflowRequest";
import type { ValidationResponse } from "@/model/rest/ValidationResponse";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { throwError } from "@/tools/views/ThrowError";
import {
  mapPreDefMoneyflowToTransport,
  mapPreDefMoneyflowTransportToModel,
} from "./mapper/PreDefMoneyflowTransportMapper";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";

class PreDefMoneyflowControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "predefmoneyflow";

  async fetchAllPreDefMoneyflow(): Promise<Array<PreDefMoneyflow>> {
    const usecase = "showPreDefMoneyflowList";
    const response = await super.get(
      PreDefMoneyflowControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showPreDefMoneyflowListResponse =
      (await response.json()) as ShowPreDefMoneyflowListResponse;

    if (showPreDefMoneyflowListResponse.errorResponse) {
      throwError(showPreDefMoneyflowListResponse.errorResponse.code);
    }

    const PreDefMoneyflowArray = new Array<PreDefMoneyflow>();
    const transports =
      await showPreDefMoneyflowListResponse.preDefMoneyflowTransports;
    transports?.forEach((value) => {
      PreDefMoneyflowArray.push(mapPreDefMoneyflowTransportToModel(value));
    });

    return PreDefMoneyflowArray;
  }

  async createPreDefMoneyflow(
    mpm: PreDefMoneyflow
  ): Promise<PreDefMoneyflowValidation> {
    const usecase = "createPreDefMoneyflow";
    const request = {} as CreatePreDefMoneyflowRequest;
    request.preDefMoneyflowTransport = mapPreDefMoneyflowToTransport(mpm);

    const response = await super.post(
      request,
      PreDefMoneyflowControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const createPreDefMoneyflowResponse =
      (await response.json()) as CreatePreDefMoneyflowResponse;
    const preDefMoneyflowValidation = {} as PreDefMoneyflowValidation;
    const validationResult: ValidationResult = {
      result: createPreDefMoneyflowResponse.result,
      validationResultItems:
        createPreDefMoneyflowResponse.validationItemTransports?.map((vit) => {
          return mapValidationItemTransportToModel(vit);
        }),
    };

    preDefMoneyflowValidation.validationResult = validationResult;

    if (validationResult.result) {
      const createMpm: PreDefMoneyflow = mpm;
      createMpm.id = createPreDefMoneyflowResponse.preDefMoneyflowId;
      preDefMoneyflowValidation.preDefMoneyflow = createMpm;
    }
    return preDefMoneyflowValidation;
  }
  async updatePreDefMoneyflow(mpm: PreDefMoneyflow): Promise<ValidationResult> {
    const usecase = "updatePreDefMoneyflow";
    const request = {} as UpdatePreDefMoneyflowRequest;
    request.preDefMoneyflowTransport = mapPreDefMoneyflowToTransport(mpm);

    const response = await super.put(
      request,
      PreDefMoneyflowControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
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
  async deletePreDefMoneyflow(id: number) {
    const usecase = "deletePreDefMoneyflow/" + id;

    const response = await super.delete(
      PreDefMoneyflowControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }
}

export default new PreDefMoneyflowControllerHandler();
