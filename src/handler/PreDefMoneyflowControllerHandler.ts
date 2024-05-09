import {
  PreDefMoneyflowControllerApi,
  type CreatePreDefMoneyflowRequest,
  type UpdatePreDefMoneyflowRequest,
} from "@/api";
import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { PreDefMoneyflow } from "@/model/moneyflow/PreDefMoneyflow";
import {
  mapPreDefMoneyflowToTransport,
  mapPreDefMoneyflowTransportToModel,
} from "./mapper/PreDefMoneyflowTransportMapper";

class PreDefMoneyflowControllerHandler extends AbstractControllerHandler {
  private api: PreDefMoneyflowControllerApi;

  public constructor() {
    super();

    this.api = super.createApi(PreDefMoneyflowControllerApi);
  }

  async fetchAllPreDefMoneyflow(): Promise<Array<PreDefMoneyflow>> {
    const response = await this.api.showPreDefMoneyflowList();

    const showPreDefMoneyflowListResponse = response.data;

    const PreDefMoneyflowArray = new Array<PreDefMoneyflow>();
    const transports =
      await showPreDefMoneyflowListResponse.preDefMoneyflowTransports;
    transports?.forEach((value) => {
      PreDefMoneyflowArray.push(mapPreDefMoneyflowTransportToModel(value));
    });

    return PreDefMoneyflowArray;
  }

  async createPreDefMoneyflow(mpm: PreDefMoneyflow): Promise<PreDefMoneyflow> {
    const request = {} as CreatePreDefMoneyflowRequest;
    request.preDefMoneyflowTransport = mapPreDefMoneyflowToTransport(mpm);

    const response = await this.api.createPreDefMoneyflow(request);

    const createPreDefMoneyflowResponse = response.data;
    const createMpm: PreDefMoneyflow = mpm;
    createMpm.id = createPreDefMoneyflowResponse.preDefMoneyflowId;

    return createMpm;
  }

  async updatePreDefMoneyflow(mpm: PreDefMoneyflow) {
    const request = {} as UpdatePreDefMoneyflowRequest;
    request.preDefMoneyflowTransport = mapPreDefMoneyflowToTransport(mpm);

    await this.api.updatePreDefMoneyflow(request);
  }

  async deletePreDefMoneyflow(id: number) {
    await this.api.deletePreDefMoneyflowById(id);
  }
}

export default new PreDefMoneyflowControllerHandler();
