import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { EtfDepot } from "@/model/etf/EtfDepot";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import type { ListEtfFlowsResponse } from "@/model/rest/etf/ListEtfFlowsResponse";
import type { ListEtfOverviewResponse } from "@/model/rest/etf/ListEtfOverviewResponse";
import { throwError } from "@/tools/views/ThrowError";
import { mapEtfEffectiveFlowTransportToModel } from "./mapper/EtfEffectiveFlowTransportMapper";
import { mapEtfFlowTransportToModel } from "./mapper/EtfFlowTransportMapper";
import { mapEtfSummaryTransportToEtfSummary } from "./mapper/EtfTSummaryTransportMapper";

class EtfControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "etf";

  async listEtfOverview(
    year: string,
    month: string
  ): Promise<Array<EtfSummary>> {
    let usecase = "listEtfOverview";
    usecase += "/" + year;
    usecase += "/" + month;
    const response = await super.get(EtfControllerHandler.CONTROLLER, usecase);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const listEtfOverviewResponse =
      (await response.json()) as ListEtfOverviewResponse;

    if (listEtfOverviewResponse.error) {
      throwError(listEtfOverviewResponse.error.code);
    }
    const etfSummaryArray = new Array<EtfSummary>();
    const transport =
      listEtfOverviewResponse.listEtfOverviewResponse.etfSummaryTransport;
    transport?.forEach((value) => {
      etfSummaryArray.push(mapEtfSummaryTransportToEtfSummary(value));
    });

    return etfSummaryArray;
  }
  async listEtfFlows(): Promise<EtfDepot> {
    const usecase = "listEtfFlows";

    const response = await super.get(EtfControllerHandler.CONTROLLER, usecase);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const listEtfFlowsResponse =
      (await response.json()) as ListEtfFlowsResponse;

    if (listEtfFlowsResponse.error) {
      throwError(listEtfFlowsResponse.error.code);
    }

    const innerResponse = listEtfFlowsResponse.listEtfFlowsResponse;
    const etfListViewData = {} as EtfDepot;
    etfListViewData.calcEtfAskPrice = innerResponse.calcEtfAskPrice;
    etfListViewData.calcEtfBidPrice = innerResponse.calcEtfBidPrice;
    etfListViewData.calcEtfSaleIsin = innerResponse.calcEtfSaleIsin;
    etfListViewData.calcEtfSalePieces = innerResponse.calcEtfSalePieces;
    etfListViewData.calcEtfTransactionCosts =
      innerResponse.calcEtfTransactionCosts;
    etfListViewData.etfFlows = innerResponse.etfFlowTransport?.map((flow) => {
      return mapEtfFlowTransportToModel(flow);
    });
    etfListViewData.etfEffectiveFlows =
      innerResponse.etfEffectiveFlowTransport?.map((flow) => {
        return mapEtfEffectiveFlowTransportToModel(flow);
      });
    etfListViewData.etfs = innerResponse.etfTransport;

    return etfListViewData;
  }
}

export default new EtfControllerHandler();
