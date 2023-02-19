import {
  PreDefMoneyflowControllerApi,
  type CreatePreDefMoneyflowRequest,
  type UpdatePreDefMoneyflowRequest,
} from "@/api";
import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import type { PreDefMoneyflowValidation } from "@/model/moneyflow/PreDefMoneyflowValidation";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";
import {
  mapPreDefMoneyflowToTransport,
  mapPreDefMoneyflowTransportToModel,
} from "./mapper/PreDefMoneyflowTransportMapper";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";

class PreDefMoneyflowControllerHandler extends AbstractControllerHandler {
  private api: PreDefMoneyflowControllerApi;

  public constructor() {
    super();

    this.api = new PreDefMoneyflowControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance()
    );
  }

  async fetchAllPreDefMoneyflow(): Promise<Array<PreDefMoneyflow>> {
    const response = await this.api.showPreDefMoneyflowList();

    const showPreDefMoneyflowListResponse = response.data;

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
    const request = {} as CreatePreDefMoneyflowRequest;
    request.preDefMoneyflowTransport = mapPreDefMoneyflowToTransport(mpm);

    const response = await this.api.createPreDefMoneyflow(request);

    const createPreDefMoneyflowResponse = response.data;

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
    const request = {} as UpdatePreDefMoneyflowRequest;
    request.preDefMoneyflowTransport = mapPreDefMoneyflowToTransport(mpm);

    const response = await this.api.updatePreDefMoneyflow(request);

    if (response.status === 204) {
      return { result: true } as ValidationResult;
    }

    const validationResponse = response.data;

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
    await this.api.deletePreDefMoneyflowById(id);
  }
}

export default new PreDefMoneyflowControllerHandler();
