import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import {
  mapEtfFlowModelToTransport,
  mapEtfFlowTransportToModel,
} from "./mapper/EtfFlowTransportMapper";
import { CrudEtfFlowControllerApi } from "@/api";

class EtfFlowControllerHandler extends AbstractControllerHandler {
  private api: CrudEtfFlowControllerApi;

  public constructor() {
    super();

    this.api = super.createApi(CrudEtfFlowControllerApi);
  }

  async createEtfFlow(met: EtfFlow): Promise<EtfFlow> {
    const response = await this.api.create(mapEtfFlowModelToTransport(met), [
      this.RET_REPRESENTATION,
    ]);

    return mapEtfFlowTransportToModel(response.data);
  }

  async updateEtfFlow(met: EtfFlow) {
    await this.api.update(mapEtfFlowModelToTransport(met), [this.RET_MINIMAL]);
  }

  async deleteEtfFlow(etfFlowId: number) {
    await this.api._delete(etfFlowId);
  }
}

export default new EtfFlowControllerHandler();
