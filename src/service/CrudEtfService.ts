import AbstractService from "@/service/AbstractService";
import type { Etf } from "@/model/etf/Etf";
import {
  mapEtfModelToTransport,
  mapEtfTransportToModel,
} from "./mapper/EtfTransportMapper";
import { CrudEtfControllerApi } from "@/api";

class EtfService extends AbstractService {
  private readonly api: CrudEtfControllerApi;

  public constructor() {
    super();

    this.api = super.createApi(CrudEtfControllerApi);
  }

  async fetchAllEtf(): Promise<Array<Etf>> {
    const response = await this.api.readAll();

    const etfArray = new Array<Etf>();

    response.data?.forEach((value) => {
      etfArray.push(mapEtfTransportToModel(value));
    });

    return etfArray;
  }

  async fetchEtf(etfId: number): Promise<Etf> {
    const response = await this.api.readOne(etfId);
    return mapEtfTransportToModel(response.data);
  }

  async createEtf(met: Etf): Promise<Etf> {
    const response = await this.api.create(mapEtfModelToTransport(met), [
      this.RET_REPRESENTATION,
    ]);

    return mapEtfTransportToModel(response.data);
  }

  async updateEtf(met: Etf) {
    await this.api.update(mapEtfModelToTransport(met), [this.RET_MINIMAL]);
  }

  async deleteEtf(etfId: number) {
    await this.api._delete(etfId);
  }
}

export default new EtfService();
