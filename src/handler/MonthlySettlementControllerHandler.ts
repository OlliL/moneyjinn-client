import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { GetAvailableMonthResponse } from "@/model/rest/monthlysettlement/GetAvailableMonthResponse";
import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";
import type { AvailableMonth } from "@/model/monthlysettlement/AvailableMonth";
import type { MonthlySettlementEditTransporter } from "@/model/monthlysettlement/MonthlySettlementEditTransporter";
import {
  mapMonthlySettlementToTransport,
  mapMonthlySettlementTransportToModel,
} from "./mapper/MonthlySettlementTransportMapper";
import type { ShowMonthlySettlementListResponse } from "@/model/rest/monthlysettlement/ShowMonthlySettlementListResponse";
import type { ShowMonthlySettlementCreateResponse } from "@/model/rest/monthlysettlement/ShowMonthlySettlementCreateResponse";
import type { UpsertMonthlySettlementRequest } from "@/model/rest/monthlysettlement/UpsertMonthlySettlementRequest";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { throwError } from "@/tools/views/ThrowError";
import type { ValidationResponse } from "@/model/rest/ValidationResponse";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";

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

    if (getAvailableMonthResponse.code) {
      throwError(getAvailableMonthResponse.code);
    }

    // easy mapping for now - same attributes
    const availableMonth: AvailableMonth = getAvailableMonthResponse;

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

    if (showMonthlySettlementListResponse.code) {
      throwError(showMonthlySettlementListResponse.code);
    }

    const monthlySettlements: Array<MonthlySettlement> =
      showMonthlySettlementListResponse.monthlySettlementTransports?.map(
        (mms) => {
          return mapMonthlySettlementTransportToModel(mms);
        }
      );

    return monthlySettlements;
  }

  async getMonthlySettlementForEdit(
    year?: number,
    month?: number
  ): Promise<MonthlySettlementEditTransporter> {
    let usecase = "showMonthlySettlementCreate";
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

    const showMonthlySettlementCreateResponse =
      (await response.json()) as ShowMonthlySettlementCreateResponse;

    if (showMonthlySettlementCreateResponse.code) {
      throwError(showMonthlySettlementCreateResponse.code);
    }

    const result = {} as MonthlySettlementEditTransporter;

    const monthlySettlements: Array<MonthlySettlement> =
      showMonthlySettlementCreateResponse.monthlySettlementTransports?.map(
        (mms) => {
          return mapMonthlySettlementTransportToModel(mms);
        }
      );
    if (
      showMonthlySettlementCreateResponse.importedMonthlySettlementTransports
    ) {
      const importedMonthlySettlements: Array<MonthlySettlement> =
        showMonthlySettlementCreateResponse.importedMonthlySettlementTransports?.map(
          (mms) => {
            return mapMonthlySettlementTransportToModel(mms);
          }
        );
      result.importedMonthlySettlements = importedMonthlySettlements;
    }

    result.monthlySettlements = monthlySettlements;
    result.year = showMonthlySettlementCreateResponse.year;
    result.month = showMonthlySettlementCreateResponse.month;
    result.editMode =
      showMonthlySettlementCreateResponse.editMode == 1 ? true : false;

    return result;
  }

  async upsertMonthlySettlement(
    monthlySettlements: Array<MonthlySettlement>
  ): Promise<ValidationResult> {
    const usecase = "upsertMonthlySettlement";
    const request = {} as UpsertMonthlySettlementRequest;
    request.monthlySettlementTransports = monthlySettlements?.map((mms) =>
      mapMonthlySettlementToTransport(mms)
    );

    const response = await super.post(
      request,
      MonthlySettlementControllerHandler.CONTROLLER,
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

  async deleteMonthlySettlement(year: number, month: number) {
    let usecase = "deleteMonthlySettlement";
    usecase += "/" + year;
    usecase += "/" + month;

    const response = await super.delete(
      MonthlySettlementControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }
}

export default new MonthlySettlementControllerHandler();
