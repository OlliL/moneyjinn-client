import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import {
  mapCapitalsourceToTransport,
  mapCapitalsourceTransportToModel,
} from "./mapper/CapitalsourceTransportMapper";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import {
  CapitalsourceControllerApi,
  type CreateCapitalsourceRequest,
  type UpdateCapitalsourceRequest,
} from "@/api";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";

class CapitalsourceControllerHandler extends AbstractControllerHandler {
  private api: CapitalsourceControllerApi;

  public constructor() {
    super();

    this.api = new CapitalsourceControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance()
    );
  }

  async fetchAllCapitalsource(): Promise<Array<Capitalsource>> {
    const response = await this.api.showCapitalsourceList();

    const showCapitalsourceListResponse = response.data;
    const transport = showCapitalsourceListResponse.capitalsourceTransports;

    const capitalsourceArray = new Array<Capitalsource>();
    transport?.forEach((value) => {
      capitalsourceArray.push(mapCapitalsourceTransportToModel(value));
    });

    return capitalsourceArray;
  }

  async createCapitalsource(mcs: Capitalsource): Promise<Capitalsource> {
    const request = {} as CreateCapitalsourceRequest;
    request.capitalsourceTransport = mapCapitalsourceToTransport(mcs);

    const response = await this.api.createCapitalsource(request);

    const createCapitalsourceResponse = response.data;

    const userSessionStore = useUserSessionStore();

    const createdMcs: Capitalsource = mcs;
    createdMcs.id = createCapitalsourceResponse.capitalsourceId;
    createdMcs.userId = userSessionStore.getUserId;

    return createdMcs;
  }

  async updateCapitalsource(mcs: Capitalsource) {
    const request = {} as UpdateCapitalsourceRequest;
    request.capitalsourceTransport = mapCapitalsourceToTransport(mcs);

    await this.api.updateCapitalsource(request);
  }

  async deleteCapitalsource(capitalsourceId: number) {
    await this.api.deleteCapitalsourceById(capitalsourceId);
  }
}

export default new CapitalsourceControllerHandler();
