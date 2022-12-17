import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { EtfDepot } from "@/model/etf/EtfDepot";
import type { EtfSalesCalculation } from "@/model/etf/EtfSalesCalculation";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import type { CalcEtfSaleRequest } from "@/model/rest/etf/CalcEtfSaleRequest";
import type { CalcEtfSaleResponse } from "@/model/rest/etf/CalcEtfSaleResponse";
import type { ListEtfFlowsResponse } from "@/model/rest/etf/ListEtfFlowsResponse";
import type { ListEtfOverviewResponse } from "@/model/rest/etf/ListEtfOverviewResponse";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { throwError } from "@/tools/views/ThrowError";
import { mapEtfEffectiveFlowTransportToModel } from "./mapper/EtfEffectiveFlowTransportMapper";
import { mapEtfFlowTransportToModel } from "./mapper/EtfFlowTransportMapper";
import { mapEtfSummaryTransportToEtfSummary } from "./mapper/EtfTSummaryTransportMapper";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";

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
  async calcEtfSale(
    isin: string,
    pieces: number,
    bidPrice: number,
    askPrice: number,
    transactionCosts: number
  ): Promise<EtfSalesCalculation> {
    const usecase = "calcEtfSale";
    const request = {
      calcEtfSaleRequest: {},
    } as CalcEtfSaleRequest;
    const innerRequest = request.calcEtfSaleRequest;
    innerRequest.isin = isin;
    innerRequest.pieces = pieces;
    innerRequest.bidPrice = bidPrice;
    innerRequest.askPrice = askPrice;
    innerRequest.transactionCosts = transactionCosts;

    const response = await super.put(
      request,
      EtfControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const calcEtfSaleResponse = (await response.json()) as CalcEtfSaleResponse;
    const innerResponse = calcEtfSaleResponse.calcEtfSaleResponse;
    const etfSalesCalculation = {} as EtfSalesCalculation;
    const validationResult: ValidationResult = {
      result: innerResponse.result,
      validationResultItems: innerResponse.validationItemTransport?.map(
        (vit) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    etfSalesCalculation.validationResult = validationResult;
    if (innerResponse.result) {
      etfSalesCalculation.chargeable = innerResponse.chargeable;
      etfSalesCalculation.isin = innerResponse.isin;
      etfSalesCalculation.newBuyPrice = innerResponse.newBuyPrice;
      etfSalesCalculation.originalBuyPrice = innerResponse.originalBuyPrice;
      etfSalesCalculation.overallCosts = innerResponse.overallCosts;
      etfSalesCalculation.pieces = innerResponse.pieces;
      etfSalesCalculation.profit = innerResponse.profit;
      etfSalesCalculation.rebuyLosses = innerResponse.rebuyLosses;
      etfSalesCalculation.sellPrice = innerResponse.sellPrice;
      etfSalesCalculation.transactionCosts = innerResponse.transactionCosts;
    }
    return etfSalesCalculation;
  }
  async deleteEtfFlow(etfFlowId: number) {
    const usecase = "deleteEtfFlow/" + etfFlowId;

    const response = await super.delete(
      EtfControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }
}

export default new EtfControllerHandler();
