import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import type { CapitalsourceValidation } from "@/model/capitalsource/CapitalsourceValidation";
import type { ShowCapitalsourceListResponse } from "@/model/rest/capitalsource/ShowCapitalsourceListResponse";
import type { CreateCapitalsourceRequest } from "@/model/rest/capitalsource/CreateCapitalsourceRequest";
import type { CreateCapitalsourceResponse } from "@/model/rest/capitalsource/CreateCapitalsourceResponse";
import { throwError } from "@/tools/views/ThrowError";
import {
  mapCapitalsourceToTransport,
  mapCapitalsourceTransportToModel,
} from "./mapper/CapitalsourceTransportMapper";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { useUserSessionStore } from "@/stores/UserSessionStore";

class CapitalsourceControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "capitalsource";

  async fetchAllCapitalsource(): Promise<Array<Capitalsource>> {
    const usecase = "showCapitalsourceList/all/currentlyValid/false";
    const response = await super.get(
      CapitalsourceControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showCapitalsourceListResponse =
      (await response.json()) as ShowCapitalsourceListResponse;

    if (showCapitalsourceListResponse.error) {
      throwError(showCapitalsourceListResponse.error.code);
    }

    const capitalsourceArray = new Array<Capitalsource>();
    const transport = await showCapitalsourceListResponse
      .showCapitalsourceListResponse.capitalsourceTransport;
    transport?.forEach((value) => {
      capitalsourceArray.push(mapCapitalsourceTransportToModel(value));
    });

    return capitalsourceArray;
  }

  async createCapitalsource(
    mcs: Capitalsource
  ): Promise<CapitalsourceValidation> {
    const usecase = "createCapitalsource";
    const request = {
      createCapitalsourceRequest: {},
    } as CreateCapitalsourceRequest;
    const innerRequest = request.createCapitalsourceRequest;
    innerRequest.capitalsourceTransport = mapCapitalsourceToTransport(mcs);

    const response = await super.post(
      request,
      CapitalsourceControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const createCapitalsourceResponse =
      (await response.json()) as CreateCapitalsourceResponse;
    const innerResponse =
      createCapitalsourceResponse.createCapitalsourceResponse;
    const capitalsourceValidation = {} as CapitalsourceValidation;
    const validationResult: ValidationResult = {
      result: innerResponse.result,
      validationResultItems: innerResponse.validationItemTransport?.map(
        (vit) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    capitalsourceValidation.validationResult = validationResult;

    if (validationResult.result) {
      const userSessionStore = useUserSessionStore();
      const createdMcs: Capitalsource = mcs;
      createdMcs.id = innerResponse.capitalsourceId;
      createdMcs.userId = userSessionStore.getUserId;
      capitalsourceValidation.mcs = createdMcs;
    }
    return capitalsourceValidation;
  }
}

export default new CapitalsourceControllerHandler();
