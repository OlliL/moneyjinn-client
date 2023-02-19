import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { ContractpartnerValidation } from "@/model/contractpartner/ContractpartnerValidation";
import {
  mapContractpartnerToTransport,
  mapContractpartnerTransportToModel,
} from "./mapper/ContractpartnerTransportMapper";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import {
  ContractpartnerControllerApi,
  type CreateContractpartnerRequest,
  type UpdateContractpartnerRequest,
} from "@/api";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";

class ContractpartnerControllerHandler extends AbstractControllerHandler {
  private api: ContractpartnerControllerApi;

  public constructor() {
    super();

    this.api = new ContractpartnerControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance()
    );
  }

  async fetchAllContractpartner(): Promise<Array<Contractpartner>> {
    const response = await this.api.showContractpartnerList();

    const showContractpartnerListResponse = response.data;

    const contractpartnerArray = new Array<Contractpartner>();

    const transport = showContractpartnerListResponse.contractpartnerTransports;
    transport?.forEach((value) => {
      contractpartnerArray.push(mapContractpartnerTransportToModel(value));
    });

    return contractpartnerArray;
  }

  async createContractpartner(
    mcp: Contractpartner
  ): Promise<ContractpartnerValidation> {
    const request = {} as CreateContractpartnerRequest;
    request.contractpartnerTransport = mapContractpartnerToTransport(mcp);

    const response = await this.api.createContractpartner(request);

    const createContractpartnerResponse = response.data;
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
    const request = {} as UpdateContractpartnerRequest;
    request.contractpartnerTransport = mapContractpartnerToTransport(mcp);

    const response = await this.api.updateContractpartner(request);

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

  async deleteContractpartner(id: number) {
    await this.api.deleteContractpartner(id);
  }
}

export default new ContractpartnerControllerHandler();
