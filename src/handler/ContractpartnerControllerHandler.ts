import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { ContractpartnerValidation } from "@/model/contractpartner/ContractpartnerValidation";
import type { ShowContractpartnerListResponse } from "@/model/rest/contractpartner/ShowContractpartnerListResponse";
import type { CreateContractpartnerRequest } from "@/model/rest/contractpartner/CreateContractpartnerRequest";
import type { CreateContractpartnerResponse } from "@/model/rest/contractpartner/CreateContractpartnerResponse";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { throwError } from "@/tools/views/ThrowError";
import {
  mapContractpartnerTransportToModel,
  mapContractpartnerToTransport,
} from "./mapper/ContractpartnerTransportMapper";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import type { ValidationResponse } from "@/model/rest/ValidationResponse";
import type { UpdateContractpartnerRequest } from "@/model/rest/contractpartner/UpdateContractpartnerRequest";

class ContractpartnerControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "contractpartner";

  async fetchAllContractpartner(): Promise<Array<Contractpartner>> {
    const usecase = "showContractpartnerList";
    const response = await super.get(
      ContractpartnerControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showContractpartnerListResponse =
      (await response.json()) as ShowContractpartnerListResponse;

    if (showContractpartnerListResponse.errorResponse) {
      throwError(showContractpartnerListResponse.errorResponse.code);
    }

    const contractpartnerArray = new Array<Contractpartner>();
    const transports =
      await showContractpartnerListResponse.contractpartnerTransports;
    transports?.forEach((value) => {
      contractpartnerArray.push(mapContractpartnerTransportToModel(value));
    });

    return contractpartnerArray;
  }

  async createContractpartner(
    mcp: Contractpartner
  ): Promise<ContractpartnerValidation> {
    const usecase = "createContractpartner";
    const request = {} as CreateContractpartnerRequest;
    request.contractpartnerTransport = mapContractpartnerToTransport(mcp);

    const response = await super.post(
      request,
      ContractpartnerControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const createContractpartnerResponse =
      (await response.json()) as CreateContractpartnerResponse;
    const contractpartnerValidation = {} as ContractpartnerValidation;
    const validationResult: ValidationResult = {
      result: createContractpartnerResponse.result,
      validationResultItems:
        createContractpartnerResponse.validationItemTransports?.map((vit) => {
          return mapValidationItemTransportToModel(vit);
        }),
    };

    contractpartnerValidation.validationResult = validationResult;
    if (validationResult.result) {
      const userSessionStore = useUserSessionStore();
      const createdMcp: Contractpartner = mcp;
      createdMcp.id = createContractpartnerResponse.contractpartnerId;
      createdMcp.userId = userSessionStore.getUserId;
      contractpartnerValidation.mcp = createdMcp;
    }
    return contractpartnerValidation;
  }

  async updateContractpartner(mcp: Contractpartner): Promise<ValidationResult> {
    const usecase = "updateContractpartner";
    const request = {} as UpdateContractpartnerRequest;
    request.contractpartnerTransport = mapContractpartnerToTransport(mcp);

    const response = await super.put(
      request,
      ContractpartnerControllerHandler.CONTROLLER,
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

  async deleteContractpartner(contractpartnerId: number) {
    const usecase = "deleteContractpartner/" + contractpartnerId;

    const response = await super.delete(
      ContractpartnerControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }
}

export default new ContractpartnerControllerHandler();
