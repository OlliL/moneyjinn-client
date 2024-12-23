import AbstractService from "@/service/AbstractService";
import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";
import type { AvailableMonth } from "@/model/monthlysettlement/AvailableMonth";
import type { MonthlySettlementEditTransporter } from "@/model/monthlysettlement/MonthlySettlementEditTransporter";
import {
  mapMonthlySettlementToTransport,
  mapMonthlySettlementTransportToModel,
} from "./mapper/MonthlySettlementTransportMapper";
import {
  MonthlySettlementControllerApi,
  type GetAvailableMonthlySettlementMonthResponse,
  type ShowMonthlySettlementCreateResponse,
  type UpsertMonthlySettlementRequest,
} from "@/api";
import type { AxiosResponse } from "axios";

class MonthlySettlementService extends AbstractService {
  private readonly api: MonthlySettlementControllerApi;

  public constructor() {
    super();

    this.api = super.createApi(MonthlySettlementControllerApi);
  }

  async getAvailableMonth(
    year?: number,
    month?: number,
  ): Promise<AvailableMonth> {
    let response: AxiosResponse<GetAvailableMonthlySettlementMonthResponse>;
    if (year && month)
      response = await this.api.getAvailableMonthYearMonth(year, month);
    else if (year) response = await this.api.getAvailableMonthYear(year);
    else response = await this.api.getAvailableMonth();

    const getAvailableMonthResponse = response.data;

    // easy mapping for now - same attributes
    const availableMonth: AvailableMonth = getAvailableMonthResponse;

    return availableMonth;
  }

  async getMonthlySettlementList(
    year: number,
    month: number,
  ): Promise<Array<MonthlySettlement>> {
    const response = await this.api.showMonthlySettlementListV2(year, month);

    const showMonthlySettlementListResponse = response.data;

    const monthlySettlements: Array<MonthlySettlement> =
      showMonthlySettlementListResponse.monthlySettlementTransports?.map(
        (mms) => {
          return mapMonthlySettlementTransportToModel(mms);
        },
      );

    return monthlySettlements;
  }

  async getMonthlySettlementForEdit(
    year?: number,
    month?: number,
  ): Promise<MonthlySettlementEditTransporter> {
    let response: AxiosResponse<ShowMonthlySettlementCreateResponse>;
    if (year && month)
      response = await this.api.showMonthlySettlementCreateYearMonth(
        year,
        month,
      );
    else response = await this.api.showMonthlySettlementCreate();

    const showMonthlySettlementCreateResponse = response.data;

    const result = {} as MonthlySettlementEditTransporter;

    const monthlySettlements: Array<MonthlySettlement> =
      showMonthlySettlementCreateResponse.monthlySettlementTransports.map(
        (mms) => {
          return mapMonthlySettlementTransportToModel(mms);
        },
      );
    if (
      showMonthlySettlementCreateResponse.importedMonthlySettlementTransports
    ) {
      const importedMonthlySettlements: Array<MonthlySettlement> =
        showMonthlySettlementCreateResponse.importedMonthlySettlementTransports?.map(
          (mms) => {
            return mapMonthlySettlementTransportToModel(mms);
          },
        );
      result.importedMonthlySettlements = importedMonthlySettlements;
    }

    result.monthlySettlements = monthlySettlements;
    result.year = showMonthlySettlementCreateResponse.year;
    result.month = showMonthlySettlementCreateResponse.month;
    result.editMode = showMonthlySettlementCreateResponse.editMode == 1;

    return result;
  }

  async upsertMonthlySettlement(monthlySettlements: Array<MonthlySettlement>) {
    const request = {} as UpsertMonthlySettlementRequest;
    request.monthlySettlementTransports = monthlySettlements?.map((mms) =>
      mapMonthlySettlementToTransport(mms),
    );

    await this.api.upsertMonthlySettlement(request);
  }

  async deleteMonthlySettlement(year: number, month: number) {
    await this.api.deleteMonthlySettlement(year, month);
  }
}

export default new MonthlySettlementService();
