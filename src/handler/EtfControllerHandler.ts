import {
  EtfControllerApi,
  type CalcEtfSaleRequest,
  type ListEtfFlowsResponse,
} from "@/api";
import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { EtfDepot } from "@/model/etf/EtfDepot";
import type { EtfSalesCalculation } from "@/model/etf/EtfSalesCalculation";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import { mapEtfEffectiveFlowTransportToModel } from "./mapper/EtfEffectiveFlowTransportMapper";
import { mapEtfFlowTransportToModel } from "./mapper/EtfFlowTransportMapper";
import { mapEtfSummaryTransportToEtfSummary } from "./mapper/EtfTSummaryTransportMapper";
import type { AxiosResponse } from "axios";

class EtfControllerHandler extends AbstractControllerHandler {
  private api: EtfControllerApi;

  public constructor() {
    super();

    this.api = super.createApi(EtfControllerApi);
  }

  async listEtfOverview(
    year: number,
    month: number,
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

  async listEtfFlowsById(etfId: number): Promise<EtfDepot> {
    const response = await this.api.listEtfFlowsById(etfId);
    return this.handleListEtfFlowsResponse(response);
  }

  async handleListEtfFlowsResponse(
    response: AxiosResponse<ListEtfFlowsResponse, any>,
  ): Promise<EtfDepot> {
    const listEtfFlowsResponse = response.data;

    const etfDepot = {} as EtfDepot;
    etfDepot.calcEtfAskPrice = listEtfFlowsResponse.calcEtfAskPrice;
    etfDepot.calcEtfBidPrice = listEtfFlowsResponse.calcEtfBidPrice;
    etfDepot.calcEtfSalePieces = listEtfFlowsResponse.calcEtfSalePieces;
    etfDepot.calcEtfTransactionCosts =
      listEtfFlowsResponse.calcEtfTransactionCosts;
    etfDepot.etfFlows = listEtfFlowsResponse.etfFlowTransports?.map((flow) => {
      return mapEtfFlowTransportToModel(flow);
    });
    etfDepot.etfEffectiveFlows =
      listEtfFlowsResponse.etfEffectiveFlowTransports?.map((flow) => {
        return mapEtfEffectiveFlowTransportToModel(flow);
      });

    if (listEtfFlowsResponse.etfSummaryTransport)
      etfDepot.etfSummary = mapEtfSummaryTransportToEtfSummary(
        listEtfFlowsResponse.etfSummaryTransport,
      );

    return etfDepot;
  }

  async calcEtfSale(
    etfId: number,
    pieces: number,
    bidPrice: number,
    askPrice: number,
    transactionCosts: number,
  ): Promise<EtfSalesCalculation> {
    const request = {} as CalcEtfSaleRequest;
    request.etfId = etfId;
    request.pieces = pieces;
    request.bidPrice = bidPrice;
    request.askPrice = askPrice;
    request.transactionCosts = transactionCosts;

    const response = await this.api.calcEtfSale(request);

    const calcEtfSaleResponse = response.data;

    const etfSalesCalculation = {} as EtfSalesCalculation;
    etfSalesCalculation.chargeable = calcEtfSaleResponse.chargeable;
    etfSalesCalculation.etfId = calcEtfSaleResponse.etfId;
    etfSalesCalculation.newBuyPrice = calcEtfSaleResponse.newBuyPrice;
    etfSalesCalculation.originalBuyPrice = calcEtfSaleResponse.originalBuyPrice;
    etfSalesCalculation.overallCosts = calcEtfSaleResponse.overallCosts;
    etfSalesCalculation.pieces = calcEtfSaleResponse.pieces;
    etfSalesCalculation.accumulatedPreliminaryLumpSum =
      calcEtfSaleResponse.accumulatedPreliminaryLumpSum;
    etfSalesCalculation.profit = calcEtfSaleResponse.profit;
    etfSalesCalculation.rebuyLosses = calcEtfSaleResponse.rebuyLosses;
    etfSalesCalculation.sellPrice = calcEtfSaleResponse.sellPrice;
    etfSalesCalculation.transactionCosts = calcEtfSaleResponse.transactionCosts;

    return etfSalesCalculation;
  }
}

export default new EtfControllerHandler();
