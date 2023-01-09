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
import type { UpdateCapitalsourceRequest } from "@/model/rest/capitalsource/UpdateCapitalsourceRequest";
import type { ValidationResponse } from "@/model/rest/ValidationResponse";

class CapitalsourceControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "capitalsource";

  async fetchAllCapitalsource(): Promise<Array<Capitalsource>> {
    const usecase = "showCapitalsourceList";
    const response = await super.get(
      CapitalsourceControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showCapitalsourceListResponse =
      (await response.json()) as ShowCapitalsourceListResponse;

    if (showCapitalsourceListResponse.code) {
      throwError(showCapitalsourceListResponse.code);
    }

    const capitalsourceArray = new Array<Capitalsource>();
    const transport =
      await showCapitalsourceListResponse.capitalsourceTransports;
    transport?.forEach((value) => {
      capitalsourceArray.push(mapCapitalsourceTransportToModel(value));
    });

    return capitalsourceArray;
  }

  async createCapitalsource(
    mcs: Capitalsource
  ): Promise<CapitalsourceValidation> {
    const usecase = "createCapitalsource";
    const request = {} as CreateCapitalsourceRequest;
    request.capitalsourceTransport = mapCapitalsourceToTransport(mcs);

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
    const usecase = "updateCapitalsource";
    const request = {} as UpdateCapitalsourceRequest;
    request.capitalsourceTransport = mapCapitalsourceToTransport(mcs);

    const response = await super.put(
      request,
      CapitalsourceControllerHandler.CONTROLLER,
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

  async deleteCapitalsource(capitalsourceId: number) {
    const usecase = "deleteCapitalsourceById/" + capitalsourceId;

    const response = await super.delete(
      CapitalsourceControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }
}

export default new CapitalsourceControllerHandler();
