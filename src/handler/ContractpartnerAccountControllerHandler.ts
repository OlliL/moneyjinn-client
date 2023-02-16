import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import type { ContractpartnerAccountValidation } from "@/model/contractpartneraccount/ContractpartnerAccountValidation";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import {
  mapContractpartnerAccountTransportToModel,
  mapContractpartnerAccountToTransport,
} from "./mapper/ContractpartnerAccountTransportMapper";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";
import type { UpdateContractpartnerAccountRequest } from "@/model/rest/contractpartneraccount/UpdateContractpartnerAccountRequest";
import {
  ContractpartnerAccountControllerApi,
  type CreateContractpartnerAccountRequest,
} from "@/api";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";

class ContractpartnerAccountControllerHandler extends AbstractControllerHandler {
  private api: ContractpartnerAccountControllerApi;

  public constructor() {
    super();

    this.api = new ContractpartnerAccountControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance()
    );
  }

  async fetchAllContractpartnerAccount(
    contractpartnerId: number
  ): Promise<Array<ContractpartnerAccount>> {
    const response = await this.api.showContractpartnerAccountList(
      contractpartnerId
    );

    super.handleResponseError(response);

    const showContractpartnerAccountListResponse = response.data;

    const contractpartnerAccountArray = new Array<ContractpartnerAccount>();

    const transport =
      showContractpartnerAccountListResponse.contractpartnerAccountTransports;
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
    const request = {} as CreateContractpartnerAccountRequest;
    request.contractpartnerAccountTransport =
      mapContractpartnerAccountToTransport(mca);

    const response = await this.api.createContractpartnerAccount(request);

    super.handleResponseError(response);

    const createContractpartnerAccountResponse = response.data;
    const contractpartnerAccountValidation =
      {} as ContractpartnerAccountValidation;
    const validationResult: ValidationResult = {
      result: createContractpartnerAccountResponse.result,
      validationResultItems:
        createContractpartnerAccountResponse.validationItemTransports?.map(
          (vit) => {
            return mapValidationItemTransportToModel(vit);
          }
        ),
    };

    contractpartnerAccountValidation.validationResult = validationResult;

    if (validationResult.result) {
      const createdMca: ContractpartnerAccount = mca;
      createdMca.id =
        createContractpartnerAccountResponse.contractpartnerAccountId;
      contractpartnerAccountValidation.mca = createdMca;
    }
    return contractpartnerAccountValidation;
  }

  async updateContractpartnerAccount(
    mca: ContractpartnerAccount
  ): Promise<ValidationResult> {
    const request = {} as UpdateContractpartnerAccountRequest;
    request.contractpartnerAccountTransport =
      mapContractpartnerAccountToTransport(mca);

    const response = await this.api.updateContractpartnerAccount(request);

    super.handleResponseError(response);

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

  async deleteContractpartnerAccount(contractpartnerAccountId: number) {
    const response = await this.api.deleteContractpartnerAccount(
      contractpartnerAccountId
    );
    return super.handleResponseError(response);
  }
}

export default new ContractpartnerAccountControllerHandler();
