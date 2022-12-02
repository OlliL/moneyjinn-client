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

class ContractpartnerControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "contractpartner";

  async fetchAllContractpartner(): Promise<Array<Contractpartner>> {
    const usecase = "showContractpartnerList/all/currentlyValid/false";
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
      const createdMcp: Contractpartner = mcp;
      createdMcp.id = innerResponse.contractpartnerId;
      contractpartnerValidation.mcp = createdMcp;
    }
    return contractpartnerValidation;
  }
}

export default new ContractpartnerControllerHandler();
