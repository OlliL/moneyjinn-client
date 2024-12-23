import AbstractService from "@/service/AbstractService";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import {
  mapEtfPreliminaryLumpSumModelToTransport,
  mapEtfPreliminaryLumpSumTransportToModel,
} from "./mapper/EtfPreliminaryLumpSumTransportMapper";
import { CrudEtfPreliminaryLumpSumControllerApi } from "@/api";

class EtfPreliminaryLumpSumService extends AbstractService {
  private readonly api: CrudEtfPreliminaryLumpSumControllerApi;

  public constructor() {
    super();

    this.api = super.createApi(CrudEtfPreliminaryLumpSumControllerApi);
  }

  async fetchAllEtfPreliminaryLumpSum(
    etfId: number,
  ): Promise<Array<EtfPreliminaryLumpSum>> {
    const response = await this.api.getAllForEtf(etfId);

    const dataArray = new Array<EtfPreliminaryLumpSum>();

    response.data?.forEach((value) => {
      dataArray.push(mapEtfPreliminaryLumpSumTransportToModel(value));
    });

    return dataArray;
  }

  async createEtfPreliminaryLumpSum(
    met: EtfPreliminaryLumpSum,
  ): Promise<EtfPreliminaryLumpSum> {
    const response = await this.api.create(
      mapEtfPreliminaryLumpSumModelToTransport(met),
      [this.RET_REPRESENTATION],
    );

    return mapEtfPreliminaryLumpSumTransportToModel(response.data);
  }

  async updateEtfPreliminaryLumpSum(met: EtfPreliminaryLumpSum) {
    await this.api.update(mapEtfPreliminaryLumpSumModelToTransport(met), [
      this.RET_MINIMAL,
    ]);
  }

  async deleteEtfPreliminaryLumpSum(id: number) {
    await this.api._delete(id);
  }
}

export default new EtfPreliminaryLumpSumService();
