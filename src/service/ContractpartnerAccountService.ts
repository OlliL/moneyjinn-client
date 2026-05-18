import { CrudContractpartnerAccountControllerApi } from "@/api";
import type { ContractpartnerAccount } from "@/model/contractpartneraccount/ContractpartnerAccount";
import AbstractService from "@/service/AbstractService";
import {
  mapContractpartnerAccountToTransport,
  mapContractpartnerAccountTransportToModel,
} from "./mapper/ContractpartnerAccountTransportMapper";

class ContractpartnerAccountService extends AbstractService {
  private readonly api: CrudContractpartnerAccountControllerApi;

  public constructor() {
    super();

    this.api = super.createApi(CrudContractpartnerAccountControllerApi);
  }

  async fetchAllContractpartnerAccount(
    contractpartnerId: number,
  ): Promise<Array<ContractpartnerAccount>> {
    const response = await this.api.readAll(contractpartnerId);

    const contractpartnerAccountArray = new Array<ContractpartnerAccount>();

    response.data?.forEach((value) => {
      contractpartnerAccountArray.push(
        mapContractpartnerAccountTransportToModel(value),
      );
    });

    return contractpartnerAccountArray;
  }

  async createContractpartnerAccount(
    mca: ContractpartnerAccount,
  ): Promise<ContractpartnerAccount> {
    const response = await this.api.create(
      mapContractpartnerAccountToTransport(mca),
      [this.RET_REPRESENTATION],
    );

    return mapContractpartnerAccountTransportToModel(response.data);
  }

  async updateContractpartnerAccount(mca: ContractpartnerAccount) {
    await this.api.update(mapContractpartnerAccountToTransport(mca), [
      this.RET_MINIMAL,
    ]);
  }

  async deleteContractpartnerAccount(id: number) {
    await this.api._delete(id);
  }
}

export default new ContractpartnerAccountService();
