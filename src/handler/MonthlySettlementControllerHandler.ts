import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { GetAvailableMonthResponse } from "@/model/rest/monthlysettlement/GetAvailableMonthResponse";
import type { AvailableMonth } from "@/model/monthlysettlement/AvailableMonth";
import { throwError } from "@/tools/views/ThrowError";
import type { ShowMonthlySettlementListResponse } from "@/model/rest/monthlysettlement/ShowMonthlySettlementListResponse";
import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";
import { mapMonthlySettlementTransportToModel } from "./mapper/MonthlySettlementTransportMapper";

class MonthlySettlementControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "monthlysettlement";

  async getAvailableMonth(
    year?: number,
    month?: number
  ): Promise<AvailableMonth> {
    let usecase = "getAvailableMonth";
    if (year) {
      usecase += "/" + year;
      if (month) {
        usecase += "/" + month;
      }
    }
    const response = await super.get(
      MonthlySettlementControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const getAvailableMonthResponse =
      (await response.json()) as GetAvailableMonthResponse;

    if (getAvailableMonthResponse.error) {
      throwError(getAvailableMonthResponse.error.code);
    }

    // easy mapping for now - same attributes
    const availableMonth: AvailableMonth =
      getAvailableMonthResponse.getAvailableMonthResponse;

    return availableMonth;
  }

  async getMonthlySettlementList(
    year: number,
    month: number
  ): Promise<Array<MonthlySettlement>> {
    let usecase = "showMonthlySettlementListV2";
    usecase += "/" + year;
    usecase += "/" + month;

    const response = await super.get(
      MonthlySettlementControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showMonthlySettlementListResponse =
      (await response.json()) as ShowMonthlySettlementListResponse;

    if (showMonthlySettlementListResponse.error) {
      throwError(showMonthlySettlementListResponse.error.code);
    }

    const innerRequest =
      showMonthlySettlementListResponse.showMonthlySettlementListResponse;

    const monthlySettlements: Array<MonthlySettlement> =
      innerRequest.monthlySettlementTransport?.map((mms) => {
        return mapMonthlySettlementTransportToModel(mms);
      });

    return monthlySettlements;
  }
}

export default new MonthlySettlementControllerHandler();
