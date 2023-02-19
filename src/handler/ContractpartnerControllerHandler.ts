import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import {
  mapContractpartnerToTransport,
  mapContractpartnerTransportToModel,
} from "./mapper/ContractpartnerTransportMapper";
import { useUserSessionStore } from "@/stores/UserSessionStore";
import {
  ContractpartnerControllerApi,
  type CreateContractpartnerRequest,
  type UpdateContractpartnerRequest,
} from "@/api";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";

class ContractpartnerControllerHandler extends AbstractControllerHandler {
  private api: ContractpartnerControllerApi;

  public constructor() {
    super();

    this.api = new ContractpartnerControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance()
    );
  }

  async fetchAllContractpartner(): Promise<Array<Contractpartner>> {
    const response = await this.api.showContractpartnerList();

    const showContractpartnerListResponse = response.data;

    const contractpartnerArray = new Array<Contractpartner>();

    const transport = showContractpartnerListResponse.contractpartnerTransports;
    transport?.forEach((value) => {
      contractpartnerArray.push(mapContractpartnerTransportToModel(value));
    });

    return contractpartnerArray;
  }

  async createContractpartner(mcp: Contractpartner): Promise<Contractpartner> {
    const request = {} as CreateContractpartnerRequest;
    request.contractpartnerTransport = mapContractpartnerToTransport(mcp);

    const response = await this.api.createContractpartner(request);

    const createContractpartnerResponse = response.data;

    const userSessionStore = useUserSessionStore();

    const createdMcp: Contractpartner = mcp;
    createdMcp.id = createContractpartnerResponse.contractpartnerId;
    createdMcp.userId = userSessionStore.getUserId;

    return createdMcp;
  }

  async updateContractpartner(mcp: Contractpartner) {
    const request = {} as UpdateContractpartnerRequest;
    request.contractpartnerTransport = mapContractpartnerToTransport(mcp);

    await this.api.updateContractpartner(request);
  }

  async deleteContractpartner(id: number) {
    await this.api.deleteContractpartner(id);
  }
}

export default new ContractpartnerControllerHandler();
