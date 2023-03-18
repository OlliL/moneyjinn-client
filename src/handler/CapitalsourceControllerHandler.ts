import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { Capitalsource } from "@/model/capitalsource/Capitalsource";
import {
  mapCapitalsourceToTransport,
  mapCapitalsourceTransportToModel,
} from "./mapper/CapitalsourceTransportMapper";
import { CrudCapitalsourceControllerApi } from "@/api";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";

class CapitalsourceControllerHandler extends AbstractControllerHandler {
  private api: CrudCapitalsourceControllerApi;

  public constructor() {
    super();

    this.api = new CrudCapitalsourceControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance()
    );
  }

  async fetchAllCapitalsource(): Promise<Array<Capitalsource>> {
    const response = await this.api.readAll();

    const capitalsourceArray = new Array<Capitalsource>();

    response.data?.forEach((value) => {
      capitalsourceArray.push(mapCapitalsourceTransportToModel(value));
    });

    return capitalsourceArray;
  }

  async createCapitalsource(mcs: Capitalsource): Promise<Capitalsource> {
    const response = await this.api.create(mapCapitalsourceToTransport(mcs), [
      this.RET_REPRESENTATION,
    ]);

    return mapCapitalsourceTransportToModel(response.data);
  }

  async updateCapitalsource(mcs: Capitalsource) {
    await this.api.update(mapCapitalsourceToTransport(mcs), [this.RET_MINIMAL]);
  }

  async deleteCapitalsource(capitalsourceId: number) {
    await this.api._delete(capitalsourceId);
  }
}

export default new CapitalsourceControllerHandler();
