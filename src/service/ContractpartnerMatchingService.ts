import AbstractService from "@/service/AbstractService";
import type { ContractpartnerMatching } from "@/model/contractpartnermatching/ContractpartnerMatching";
import {
  mapContractpartnerMatchingTransportToModel,
  mapContractpartnerMatchingToTransport,
} from "./mapper/ContractpartnerMatchingTransportMapper";
import { CrudContractpartnerMatchingControllerApi } from "@/api";

class ContractpartnerMatchingService extends AbstractService {
  private readonly api: CrudContractpartnerMatchingControllerApi;

  public constructor() {
    super();

    this.api = super.createApi(CrudContractpartnerMatchingControllerApi);
  }

  async fetchAllContractpartnerMatching(): Promise<
    Array<ContractpartnerMatching>
  > {
    const response = await this.api.readAll();

    const contractpartnerMatchingArray = new Array<ContractpartnerMatching>();

    response.data?.forEach((value) => {
      contractpartnerMatchingArray.push(
        mapContractpartnerMatchingTransportToModel(value),
      );
    });

    return contractpartnerMatchingArray;
  }

  async createContractpartnerMatching(
    mca: ContractpartnerMatching,
  ): Promise<ContractpartnerMatching> {
    const response = await this.api.create(
      mapContractpartnerMatchingToTransport(mca),
      [this.RET_REPRESENTATION],
    );

    return mapContractpartnerMatchingTransportToModel(response.data);
  }

  async updateContractpartnerMatching(mca: ContractpartnerMatching) {
    await this.api.update(mapContractpartnerMatchingToTransport(mca), [
      this.RET_MINIMAL,
    ]);
  }

  async deleteContractpartnerMatching(id: number) {
    await this.api._delete(id);
  }
}

export default new ContractpartnerMatchingService();
