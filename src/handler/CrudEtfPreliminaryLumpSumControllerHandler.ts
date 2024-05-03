import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import {
  mapEtfPreliminaryLumpSumModelToTransport,
  mapEtfPreliminaryLumpSumTransportToModel,
} from "./mapper/EtfPreliminaryLumpSumTransportMapper";
import { CrudEtfPreliminaryLumpSumControllerApi } from "@/api";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";

class EtfPreliminaryLumpSumControllerHandler extends AbstractControllerHandler {
  private api: CrudEtfPreliminaryLumpSumControllerApi;

  public constructor() {
    super();

    this.api = new CrudEtfPreliminaryLumpSumControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance(),
    );
  }

  async fetchEtfPreliminaryLumpSumYears(etfId: number): Promise<Array<number>> {
    const response = await this.api.readAllYears(etfId);

    const allYears = new Array<number>();
    response.data?.forEach((value) => {
      allYears.push(value);
    });

    return allYears;
  }

  async fetchEtfPreliminaryLumpSum(
    etfId: number,
    year: number,
  ): Promise<EtfPreliminaryLumpSum> {
    const response = await this.api.readOne(etfId, year);
    return mapEtfPreliminaryLumpSumTransportToModel(response.data);
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

  async deleteEtfPreliminaryLumpSum(etfId: number, year: number) {
    await this.api._delete(etfId, year);
  }
}

export default new EtfPreliminaryLumpSumControllerHandler();
