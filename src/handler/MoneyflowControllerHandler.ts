import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { MoneyflowSearchParams } from "@/model/moneyflow/MoneyflowSearchParams";
import type { MoneyflowSplitEntry } from "@/model/moneyflow/MoneyflowSplitEntry";
import { mapMoneyflowSearchParamsToTransport } from "./mapper/MoneyflowSearchParamsTransportMapper";
import { mapMoneyflowSplitEntryToTransport } from "./mapper/MoneyflowSplitEntryTransportMapper";
import {
  mapMoneyflowToTransport,
  mapMoneyflowTransportToModel,
} from "./mapper/MoneyflowTransportMapper";
import { getISOStringDate } from "@/tools/views/FormatDate";
import {
  MoneyflowControllerApi,
  type CreateMoneyflowRequest,
  type MoneyflowSplitEntryTransport,
  type SearchMoneyflowsRequest,
  type UpdateMoneyflowRequest,
} from "@/api";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";

class MoneyflowControllerHandler extends AbstractControllerHandler {
  private api: MoneyflowControllerApi;

  public constructor() {
    super();

    this.api = new MoneyflowControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance(),
    );
  }

  async createMoneyflow(
    moneyflow: Moneyflow,
    usedPreDefMoneyflowId: number,
    saveAsPreDefMoneyflow: boolean,
  ) {
    const request = {} as CreateMoneyflowRequest;
    request.moneyflowTransport = mapMoneyflowToTransport(moneyflow);
    request.saveAsPreDefMoneyflow = saveAsPreDefMoneyflow ? 1 : 0;

    if (usedPreDefMoneyflowId != 0) {
      request.usedPreDefMoneyflowId = usedPreDefMoneyflowId;
      request.saveAsPreDefMoneyflow = 1;
    }

    if (moneyflow.moneyflowSplitEntries) {
      request.insertMoneyflowSplitEntryTransports =
        moneyflow.moneyflowSplitEntries.map((mse) => {
          return mapMoneyflowSplitEntryToTransport(mse);
        });
    }

    await this.api.createMoneyflows(request);
  }

  async updateMoneyflow(
    moneyflow: Moneyflow,
    createMoneyflowSplitEntries: Array<MoneyflowSplitEntry>,
    updateMoneyflowSplitEntries: Array<MoneyflowSplitEntry>,
    deleteMoneyflowSplitEntryIds: Array<number>,
  ): Promise<Moneyflow> {
    const request = {} as UpdateMoneyflowRequest;
    request.moneyflowTransport = mapMoneyflowToTransport(moneyflow);
    request.insertMoneyflowSplitEntryTransports =
      createMoneyflowSplitEntries.map((mse) => {
        return mapMoneyflowSplitEntryToTransport(mse);
      });
    request.updateMoneyflowSplitEntryTransports =
      updateMoneyflowSplitEntries.map((mse) => {
        return mapMoneyflowSplitEntryToTransport(mse);
      });
    request.deleteMoneyflowSplitEntryIds = deleteMoneyflowSplitEntryIds;

    const response = await this.api.updateMoneyflowV2(request);

    const updateMoneyflowResponse = response.data;
    const mmf: Moneyflow = mapMoneyflowTransportToModel(
      updateMoneyflowResponse.moneyflowTransport,
      updateMoneyflowResponse.hasReceipt,
      updateMoneyflowResponse.moneyflowSplitEntryTransports,
    );

    return mmf;
  }

  async deleteMoneyflow(id: number) {
    await this.api.deleteMoneyflowById(id);
  }

  async searchMoneyflows(
    searchParams: MoneyflowSearchParams,
  ): Promise<Array<Moneyflow>> {
    const request = {} as SearchMoneyflowsRequest;
    request.moneyflowSearchParamsTransport =
      mapMoneyflowSearchParamsToTransport(searchParams);

    const response = await this.api.searchMoneyflows(request);

    const searchMoneyflowsResponse = response.data;

    if (searchMoneyflowsResponse.moneyflowTransports) {
      const moneyflows: Array<Moneyflow> =
        searchMoneyflowsResponse.moneyflowTransports?.map((mmf) => {
          return mapMoneyflowTransportToModel(mmf, false);
        });
      return moneyflows;
    }

    return new Array<Moneyflow>();
  }

  async fetchMoneyflow(id: number): Promise<Moneyflow> {
    const response = await this.api.showEditMoneyflow(id);

    const showEditMoneyflowResponse = response.data;

    const moneyflow = mapMoneyflowTransportToModel(
      showEditMoneyflowResponse.moneyflowTransport,
      showEditMoneyflowResponse.hasReceipt,
      showEditMoneyflowResponse.moneyflowSplitEntryTransports,
    );

    return moneyflow;
  }

  async searchMoneyflowsByAmount(
    amount: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Array<Moneyflow>> {
    const response = await this.api.searchMoneyflowsByAmount(
      amount,
      getISOStringDate(startDate).replace(/-/gi, ""),
      getISOStringDate(endDate).replace(/-/gi, ""),
    );

    if (response.status === 204) return new Array<Moneyflow>();

    const searchMoneyflowsByAmountResponse = response.data;

    const mseMap = new Map<number, Array<MoneyflowSplitEntryTransport>>();

    if (
      searchMoneyflowsByAmountResponse.moneyflowSplitEntryTransports !==
      undefined
    ) {
      for (const mse of searchMoneyflowsByAmountResponse.moneyflowSplitEntryTransports) {
        let mseMapArray = mseMap.get(mse.moneyflowid);
        if (mseMapArray == null) {
          mseMapArray = new Array<MoneyflowSplitEntryTransport>();
        }
        mseMapArray.push(mse);
        mseMap.set(mse.moneyflowid, mseMapArray);
      }
    }

    if (searchMoneyflowsByAmountResponse.moneyflowTransports) {
      const moneyflows: Array<Moneyflow> =
        searchMoneyflowsByAmountResponse.moneyflowTransports?.map((mmf) => {
          return mapMoneyflowTransportToModel(mmf, false, mseMap.get(mmf.id));
        });

      return moneyflows;
    }
    return new Array<Moneyflow>();
  }
}

export default new MoneyflowControllerHandler();
