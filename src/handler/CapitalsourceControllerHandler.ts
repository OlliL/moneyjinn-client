import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import type { CapitalsourceValidation } from "@/model/capitalsource/CapitalsourceValidation";
import {
  mapCapitalsourceToTransport,
  mapCapitalsourceTransportToModel,
} from "./mapper/CapitalsourceTransportMapper";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import {
  CapitalsourceControllerApi,
  type CreateCapitalsourceRequest,
  type UpdateCapitalsourceRequest,
} from "@/api";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";

class CapitalsourceControllerHandler extends AbstractControllerHandler {
  private api: CapitalsourceControllerApi;

  public constructor() {
    super();

    this.api = new CapitalsourceControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance()
    );
  }

  async fetchAllCapitalsource(): Promise<Array<Capitalsource>> {
    const response = await this.api.showCapitalsourceList();

    const showCapitalsourceListResponse = response.data;

    const capitalsourceArray = new Array<Capitalsource>();

    const transport = showCapitalsourceListResponse.capitalsourceTransports;
    transport?.forEach((value) => {
      capitalsourceArray.push(mapCapitalsourceTransportToModel(value));
    });

    return capitalsourceArray;
  }

  async createCapitalsource(
    mcs: Capitalsource
  ): Promise<CapitalsourceValidation> {
    const request = {} as CreateCapitalsourceRequest;
    request.capitalsourceTransport = mapCapitalsourceToTransport(mcs);

    const response = await this.api.createCapitalsource(request);

    const createCapitalsourceResponse = response.data;
    const capitalsourceValidation = {} as CapitalsourceValidation;
    const validationResult: ValidationResult = {
      result: createCapitalsourceResponse.result,
      validationResultItems:
        createCapitalsourceResponse.validationItemTransports?.map((vit) => {
          return mapValidationItemTransportToModel(vit);
        }),
    };

    capitalsourceValidation.validationResult = validationResult;

    if (validationResult.result) {
      const userSessionStore = useUserSessionStore();
      const createdMcs: Capitalsource = mcs;
      createdMcs.id = createCapitalsourceResponse.capitalsourceId;
      createdMcs.userId = userSessionStore.getUserId;
      capitalsourceValidation.mcs = createdMcs;
    }
    return capitalsourceValidation;
  }

  async updateCapitalsource(mcs: Capitalsource): Promise<ValidationResult> {
    const request = {} as UpdateCapitalsourceRequest;
    request.capitalsourceTransport = mapCapitalsourceToTransport(mcs);

    const response = await this.api.updateCapitalsource(request);

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

  async deleteCapitalsource(capitalsourceId: number) {
    await this.api.deleteCapitalsourceById(capitalsourceId);
  }
}

export default new CapitalsourceControllerHandler();
