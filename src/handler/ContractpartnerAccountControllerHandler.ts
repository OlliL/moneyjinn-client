import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import {
  mapContractpartnerAccountTransportToModel,
  mapContractpartnerAccountToTransport,
} from "./mapper/ContractpartnerAccountTransportMapper";
import {
  ContractpartnerAccountControllerApi,
  type CreateContractpartnerAccountRequest,
  type UpdateContractpartnerAccountRequest,
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
  ): Promise<ContractpartnerAccount> {
    const request = {} as CreateContractpartnerAccountRequest;
    request.contractpartnerAccountTransport =
      mapContractpartnerAccountToTransport(mca);

    const response = await this.api.createContractpartnerAccount(request);

    const createContractpartnerAccountResponse = response.data;

    const createdMca: ContractpartnerAccount = mca;
    createdMca.id =
      createContractpartnerAccountResponse.contractpartnerAccountId;

    return createdMca;
  }

  async updateContractpartnerAccount(mca: ContractpartnerAccount) {
    const request = {} as UpdateContractpartnerAccountRequest;
    request.contractpartnerAccountTransport =
      mapContractpartnerAccountToTransport(mca);

    await this.api.updateContractpartnerAccount(request);
  }

  async deleteContractpartnerAccount(id: number) {
    await this.api.deleteContractpartnerAccount(id);
  }
}

export default new ContractpartnerAccountControllerHandler();
