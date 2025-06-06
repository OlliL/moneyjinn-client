import AbstractService from "@/service/AbstractService";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import {
  mapContractpartnerToTransport,
  mapContractpartnerTransportToModel,
} from "./mapper/ContractpartnerTransportMapper";
import { CrudContractpartnerControllerApi } from "@/api";

class ContractpartnerService extends AbstractService {
  private readonly api: CrudContractpartnerControllerApi;

  public constructor() {
    super();

    this.api = super.createApi(CrudContractpartnerControllerApi);
  }

  async fetchAllContractpartner(): Promise<Array<Contractpartner>> {
    const response = await this.api.readAll();

    const contractpartnerArray = new Array<Contractpartner>();

    response.data?.forEach((value) => {
      contractpartnerArray.push(mapContractpartnerTransportToModel(value));
    });

    return contractpartnerArray;
  }

  async createContractpartner(mcs: Contractpartner): Promise<Contractpartner> {
    const response = await this.api.create(mapContractpartnerToTransport(mcs), [
      this.RET_REPRESENTATION,
    ]);

    return mapContractpartnerTransportToModel(response.data);
  }

  async updateContractpartner(mcs: Contractpartner) {
    await this.api.update(mapContractpartnerToTransport(mcs), [
      this.RET_MINIMAL,
    ]);
  }

  async deleteContractpartner(contractpartnerId: number) {
    await this.api._delete(contractpartnerId);
  }
}

export default new ContractpartnerService();
