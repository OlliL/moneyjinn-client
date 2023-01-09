import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { EtfDepot } from "@/model/etf/EtfDepot";
import type { EtfFlow } from "@/model/etf/EtfFlow";
import type { EtfFlowValidation } from "@/model/etf/EtfFlowValidation";
import type { EtfSalesCalculation } from "@/model/etf/EtfSalesCalculation";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import type { CalcEtfSaleRequest } from "@/model/rest/etf/CalcEtfSaleRequest";
import type { CalcEtfSaleResponse } from "@/model/rest/etf/CalcEtfSaleResponse";
import type { CreateEtfFlowRequest } from "@/model/rest/etf/CreateEtfFlowRequest";
import type { CreateEtfFlowResponse } from "@/model/rest/etf/CreateEtfFlowResponse";
import type { ListEtfFlowsResponse } from "@/model/rest/etf/ListEtfFlowsResponse";
import type { ListEtfOverviewResponse } from "@/model/rest/etf/ListEtfOverviewResponse";
import type { UpdateEtfFlowRequest } from "@/model/rest/etf/UpdateEtfFlowRequest";
import type { ValidationResponse } from "@/model/rest/ValidationResponse";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { throwError } from "@/tools/views/ThrowError";
import { mapEtfEffectiveFlowTransportToModel } from "./mapper/EtfEffectiveFlowTransportMapper";
import {
  mapEtfFlowModelToTransport,
  mapEtfFlowTransportToModel,
} from "./mapper/EtfFlowTransportMapper";
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

    if (listEtfOverviewResponse.code) {
      throwError(listEtfOverviewResponse.code);
    }
    const etfSummaryArray = new Array<EtfSummary>();
    const transports = listEtfOverviewResponse.etfSummaryTransports;
    transports?.forEach((value) => {
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

    if (listEtfFlowsResponse.code) {
      throwError(listEtfFlowsResponse.code);
    }

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
    const usecase = "calcEtfSale";
    const request = {} as CalcEtfSaleRequest;
    request.isin = isin;
    request.pieces = pieces;
    request.bidPrice = bidPrice;
    request.askPrice = askPrice;
    request.transactionCosts = transactionCosts;

    const response = await super.put(
      request,
      EtfControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const calcEtfSaleResponse = (await response.json()) as CalcEtfSaleResponse;
    const etfSalesCalculation = {} as EtfSalesCalculation;
    const validationResult: ValidationResult = {
      result: calcEtfSaleResponse.result,
      validationResultItems: calcEtfSaleResponse.validationItemTransports?.map(
        (vit) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    etfSalesCalculation.validationResult = validationResult;
    if (calcEtfSaleResponse.result) {
      etfSalesCalculation.chargeable = calcEtfSaleResponse.chargeable;
      etfSalesCalculation.isin = calcEtfSaleResponse.isin;
      etfSalesCalculation.newBuyPrice = calcEtfSaleResponse.newBuyPrice;
      etfSalesCalculation.originalBuyPrice =
        calcEtfSaleResponse.originalBuyPrice;
      etfSalesCalculation.overallCosts = calcEtfSaleResponse.overallCosts;
      etfSalesCalculation.pieces = calcEtfSaleResponse.pieces;
      etfSalesCalculation.profit = calcEtfSaleResponse.profit;
      etfSalesCalculation.rebuyLosses = calcEtfSaleResponse.rebuyLosses;
      etfSalesCalculation.sellPrice = calcEtfSaleResponse.sellPrice;
      etfSalesCalculation.transactionCosts =
        calcEtfSaleResponse.transactionCosts;
    }
    return etfSalesCalculation;
  }

  async createEtfFlow(etfFlow: EtfFlow): Promise<EtfFlowValidation> {
    const usecase = "createEtfFlow";
    const request = {} as CreateEtfFlowRequest;
    request.etfFlowTransport = mapEtfFlowModelToTransport(etfFlow);

    const response = await super.post(
      request,
      EtfControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const createEtfFlowResponse =
      (await response.json()) as CreateEtfFlowResponse;
    const etfFlowValidation = {} as EtfFlowValidation;
    const validationResult: ValidationResult = {
      result: createEtfFlowResponse.result,
      validationResultItems:
        createEtfFlowResponse.validationItemTransports?.map((vit) => {
          return mapValidationItemTransportToModel(vit);
        }),
    };

    etfFlowValidation.validationResult = validationResult;

    if (validationResult.result) {
      const createdEtfFlow: EtfFlow = etfFlow;
      etfFlowValidation.etfFlow = createdEtfFlow;
    }
    return etfFlowValidation;
  }

  async updateEtfFlow(etfFlow: EtfFlow): Promise<ValidationResult> {
    const usecase = "updateEtfFlow";
    const request = {} as UpdateEtfFlowRequest;
    request.etfFlowTransport = mapEtfFlowModelToTransport(etfFlow);

    const response = await super.put(
      request,
      EtfControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const validationResponse = (await response.json()) as ValidationResponse;
    const validationResult: ValidationResult = {
      result: validationResponse.result,
      validationResultItems: validationResponse.validationItemTransports?.map(
        (vit) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    return validationResult;
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
