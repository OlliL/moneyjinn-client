import {
  EtfControllerApi,
  type CalcEtfSaleRequest,
  type CreateEtfFlowRequest,
  type UpdateEtfFlowRequest,
} from "@/api";
import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { EtfDepot } from "@/model/etf/EtfDepot";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import type { EtfSalesCalculation } from "@/model/etf/EtfSalesCalculation";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";
import { mapEtfEffectiveFlowTransportToModel } from "./mapper/EtfEffectiveFlowTransportMapper";
import {
  mapEtfFlowModelToTransport,
  mapEtfFlowTransportToModel,
} from "./mapper/EtfFlowTransportMapper";
import { mapEtfSummaryTransportToEtfSummary } from "./mapper/EtfTSummaryTransportMapper";

class EtfControllerHandler extends AbstractControllerHandler {
  private api: EtfControllerApi;

  public constructor() {
    super();

    this.api = new EtfControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance()
    );
  }

  async listEtfOverview(
    year: number,
    month: number
  ): Promise<Array<EtfSummary>> {
    const response = await this.api.listEtfOverview(year, month);

    const listEtfOverviewResponse = response.data;

    const etfSummaryArray = new Array<EtfSummary>();
    const transports = listEtfOverviewResponse.etfSummaryTransports;
    transports?.forEach((value) => {
      etfSummaryArray.push(mapEtfSummaryTransportToEtfSummary(value));
    });

    return etfSummaryArray;
  }

  async listEtfFlows(): Promise<EtfDepot> {
    const response = await this.api.listEtfFlows();

    const listEtfFlowsResponse = response.data;

    const etfListViewData = {} as EtfDepot;
    etfListViewData.calcEtfAskPrice = listEtfFlowsResponse.calcEtfAskPrice;
    etfListViewData.calcEtfBidPrice = listEtfFlowsResponse.calcEtfBidPrice;
    etfListViewData.calcEtfSaleIsin = listEtfFlowsResponse.calcEtfSaleIsin;
    etfListViewData.calcEtfSalePieces = listEtfFlowsResponse.calcEtfSalePieces;
    etfListViewData.calcEtfTransactionCosts =
      listEtfFlowsResponse.calcEtfTransactionCosts;
    etfListViewData.etfFlows = listEtfFlowsResponse.etfFlowTransports?.map(
      (flow) => {
        return mapEtfFlowTransportToModel(flow);
      }
    );
    etfListViewData.etfEffectiveFlows =
      listEtfFlowsResponse.etfEffectiveFlowTransports?.map((flow) => {
        return mapEtfEffectiveFlowTransportToModel(flow);
      });
    etfListViewData.etfs = listEtfFlowsResponse.etfTransports;

    return etfListViewData;
  }
  async calcEtfSale(
    isin: string,
    pieces: number,
    bidPrice: number,
    askPrice: number,
    transactionCosts: number
  ): Promise<EtfSalesCalculation> {
    const request = {} as CalcEtfSaleRequest;
    request.isin = isin;
    request.pieces = pieces;
    request.bidPrice = bidPrice;
    request.askPrice = askPrice;
    request.transactionCosts = transactionCosts;

    const response = await this.api.calcEtfSale(request);

    const calcEtfSaleResponse = response.data;

    const etfSalesCalculation = {} as EtfSalesCalculation;
    etfSalesCalculation.chargeable = calcEtfSaleResponse.chargeable;
    etfSalesCalculation.isin = calcEtfSaleResponse.isin;
    etfSalesCalculation.newBuyPrice = calcEtfSaleResponse.newBuyPrice;
    etfSalesCalculation.originalBuyPrice = calcEtfSaleResponse.originalBuyPrice;
    etfSalesCalculation.overallCosts = calcEtfSaleResponse.overallCosts;
    etfSalesCalculation.pieces = calcEtfSaleResponse.pieces;
    etfSalesCalculation.profit = calcEtfSaleResponse.profit;
    etfSalesCalculation.rebuyLosses = calcEtfSaleResponse.rebuyLosses;
    etfSalesCalculation.sellPrice = calcEtfSaleResponse.sellPrice;
    etfSalesCalculation.transactionCosts = calcEtfSaleResponse.transactionCosts;

    return etfSalesCalculation;
  }

  async createEtfFlow(etfFlow: EtfFlow): Promise<EtfFlow> {
    const request = {} as CreateEtfFlowRequest;
    request.etfFlowTransport = mapEtfFlowModelToTransport(etfFlow);

    const response = await this.api.createEtfFlow(request);

    const createEtfFlowResponse = response.data;

    const createdEtfFlow: EtfFlow = etfFlow;
    createdEtfFlow.etfflowid = createEtfFlowResponse.etfFlowId;

    return createdEtfFlow;
  }

  async updateEtfFlow(etfFlow: EtfFlow) {
    const request = {} as UpdateEtfFlowRequest;
    request.etfFlowTransport = mapEtfFlowModelToTransport(etfFlow);

    await this.api.updateEtfFlow(request);
  }

  async deleteEtfFlow(id: number) {
    await this.api.deleteEtfFlow(id);
  }
}

export default new EtfControllerHandler();
