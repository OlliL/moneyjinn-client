import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import type { ContractpartnerAccountValidation } from "@/model/contractpartneraccount/ContractpartnerAccountValidation";
import type { ShowContractpartnerAccountListResponse } from "@/model/rest/contractpartneraccount/ShowContractpartnerAccountListResponse";
import type { CreateContractpartnerAccountRequest } from "@/model/rest/contractpartneraccount/CreateContractpartnerAccountRequest";
import type { CreateContractpartnerAccountResponse } from "@/model/rest/contractpartneraccount/CreateContractpartnerAccountResponse";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { throwError } from "@/tools/views/ThrowError";
import {
  mapContractpartnerAccountTransportToModel,
  mapContractpartnerAccountToTransport,
} from "./mapper/ContractpartnerAccountTransportMapper";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";
import type { ValidationResponse } from "@/model/rest/ValidationResponse";
import type { UpdateContractpartnerAccountRequest } from "@/model/rest/contractpartneraccount/UpdateContractpartnerAccountRequest";

class ContractpartnerAccountControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "contractpartneraccount";

  async fetchAllContractpartnerAccount(
    contractpartnerId: number
  ): Promise<Array<ContractpartnerAccount>> {
    const usecase = "showContractpartnerAccountList/" + contractpartnerId;
    const response = await super.get(
      ContractpartnerAccountControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showContractpartnerAccountListResponse =
      (await response.json()) as ShowContractpartnerAccountListResponse;

    if (showContractpartnerAccountListResponse.error) {
      throwError(showContractpartnerAccountListResponse.error.code);
    }

    const contractpartnerAccountArray = new Array<ContractpartnerAccount>();
    const transport = await showContractpartnerAccountListResponse
      .showContractpartnerAccountListResponse.contractpartnerAccountTransport;
    transport?.forEach((value) => {
      contractpartnerAccountArray.push(
        mapContractpartnerAccountTransportToModel(value)
      );
    });

    return contractpartnerAccountArray;
  }

  async createContractpartnerAccount(
    mca: ContractpartnerAccount
  ): Promise<ContractpartnerAccountValidation> {
    const usecase = "createContractpartnerAccount";
    const request = {
      createContractpartnerAccountRequest: {},
    } as CreateContractpartnerAccountRequest;
    const innerRequest = request.createContractpartnerAccountRequest;
    innerRequest.contractpartnerAccountTransport =
      mapContractpartnerAccountToTransport(mca);

    const response = await super.post(
      request,
      ContractpartnerAccountControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const createContractpartnerAccountResponse =
      (await response.json()) as CreateContractpartnerAccountResponse;
    const innerResponse =
      createContractpartnerAccountResponse.createContractpartnerAccountResponse;
    const contractpartnerAccountValidation =
      {} as ContractpartnerAccountValidation;
    const validationResult: ValidationResult = {
      result: innerResponse.result,
      validationResultItems: innerResponse.validationItemTransport?.map(
        (vit) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    contractpartnerAccountValidation.validationResult = validationResult;
    if (validationResult.result) {
      const createdMca: ContractpartnerAccount = mca;
      createdMca.id = innerResponse.contractpartnerAccountId;
      contractpartnerAccountValidation.mca = createdMca;
    }
    return contractpartnerAccountValidation;
  }

  async updateContractpartnerAccount(
    mca: ContractpartnerAccount
  ): Promise<ValidationResult> {
    const usecase = "updateContractpartnerAccount";
    const request = {
      updateContractpartnerAccountRequest: {},
    } as UpdateContractpartnerAccountRequest;
    const innerRequest = request.updateContractpartnerAccountRequest;
    innerRequest.contractpartnerAccountTransport =
      mapContractpartnerAccountToTransport(mca);

    const response = await super.put(
      request,
      ContractpartnerAccountControllerHandler.CONTROLLER,
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

  async deleteContractpartnerAccount(contractpartnerAccountId: number) {
    const usecase = "deleteContractpartnerAccount/" + contractpartnerAccountId;

    const response = await super.delete(
      ContractpartnerAccountControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }
}

export default new ContractpartnerAccountControllerHandler();