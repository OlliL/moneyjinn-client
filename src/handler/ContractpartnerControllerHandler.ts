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

    if (showContractpartnerListResponse.error) {
      throwError(showContractpartnerListResponse.error.code);
    }

    const contractpartnerArray = new Array<Contractpartner>();
    const transport = await showContractpartnerListResponse
      .showContractpartnerListResponse.contractpartnerTransport;
    transport?.forEach((value) => {
      contractpartnerArray.push(mapContractpartnerTransportToModel(value));
    });

    return contractpartnerArray;
  }

  async createContractpartner(
    mcp: Contractpartner
  ): Promise<ContractpartnerValidation> {
    const usecase = "createContractpartner";
    const request = {
      createContractpartnerRequest: {},
    } as CreateContractpartnerRequest;
    const innerRequest = request.createContractpartnerRequest;
    innerRequest.contractpartnerTransport = mapContractpartnerToTransport(mcp);

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
    const innerResponse =
      createContractpartnerResponse.createContractpartnerResponse;
    const contractpartnerValidation = {} as ContractpartnerValidation;
    const validationResult: ValidationResult = {
      result: innerResponse.result,
      validationResultItems: innerResponse.validationItemTransport?.map(
        (vit) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    contractpartnerValidation.validationResult = validationResult;
    if (validationResult.result) {
      const userSessionStore = useUserSessionStore();
      const createdMcp: Contractpartner = mcp;
      createdMcp.id = innerResponse.contractpartnerId;
      createdMcp.userId = userSessionStore.getUserId;
      contractpartnerValidation.mcp = createdMcp;
    }
    return contractpartnerValidation;
  }

  async updateContractpartner(mcp: Contractpartner): Promise<ValidationResult> {
    const usecase = "updateContractpartner";
    const request = {
      updateContractpartnerRequest: {},
    } as UpdateContractpartnerRequest;
    const innerRequest = request.updateContractpartnerRequest;
    innerRequest.contractpartnerTransport = mapContractpartnerToTransport(mcp);

    const response = await super.put(
      request,
      ContractpartnerControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
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

  async deleteContractpartner(contractpartnerId: number) {
    const usecase = "deleteContractpartnerById/" + contractpartnerId;

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
