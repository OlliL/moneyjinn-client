import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { GetAvailableMonthResponse } from "@/model/rest/report/GetAvailableMonthResponse";
import type { ListReportsResponse } from "@/model/rest/report/ListReportsResponse";
import type { AvailableMonth } from "@/model/report/AvailableMonth";
import { throwError } from "@/tools/views/ThrowError";
import type { Report } from "@/model/report/Report";
import { mapReportTurnoverCapitalsourceTransportToModel } from "./mapper/ReportTurnoverCapitalsourceTransportMapper";
import { mapMoneyflowTransportToModel } from "./mapper/MoneyflowTransportMapper";
import type { MoneyflowSplitEntryTransport } from "@/model/rest/transport/MoneyflowSplitEntryTransport";
import type { TrendsTransporter } from "@/model/report/TrendsTransporter";
import type { ShowTrendsFormResponse } from "@/model/rest/report/ShowTrendsFormResponse";

class ReportControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "report";

  async getAvailableMonth(
    year?: string,
    month?: string
  ): Promise<AvailableMonth> {
    let usecase = "getAvailableMonth";
    if (year) {
      usecase += "/" + year;
      if (month) {
        usecase += "/" + month;
      }
    }
    const response = await super.get(
      ReportControllerHandler.CONTROLLER,
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

  async listReports(year: string, month: string): Promise<Report> {
    let usecase = "listReportsV2";
    usecase += "/" + year;
    usecase += "/" + month;

    const response = await super.get(
      ReportControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const listReportsResponse = (await response.json()) as ListReportsResponse;

    if (listReportsResponse.error) {
      throwError(listReportsResponse.error.code);
    }

    const data = listReportsResponse.listReportsResponse;

    const mseMap = new Map<number, Array<MoneyflowSplitEntryTransport>>();

    if (data.moneyflowSplitEntryTransport !== undefined) {
      for (const mse of data.moneyflowSplitEntryTransport) {
        let mseMapArray = mseMap.get(mse.moneyflowid);
        if (mseMapArray == null) {
          mseMapArray = new Array<MoneyflowSplitEntryTransport>();
        }
        mseMapArray.push(mse);
        mseMap.set(mse.moneyflowid, mseMapArray);
      }
    }

    const report: Report = {
      year: data.year,
      month: data.month,
      amountBeginOfYear: data.amountBeginOfYear,
      turnoverEndOfYearCalculated: data.turnoverEndOfYearCalculated,
      reportTurnoverCapitalsources:
        data.reportTurnoverCapitalsourceTransport?.map((rtcp) => {
          return mapReportTurnoverCapitalsourceTransportToModel(rtcp);
        }),
      moneyflows: data.moneyflowTransport?.map((mmf) => {
        return mapMoneyflowTransportToModel(
          mmf,
          data.moneyflowsWithReceipt?.includes(mmf.id),
          mseMap.get(mmf.id)
        );
      }),
    };

    return report;
  }

  async showTrendsForm(): Promise<TrendsTransporter> {
    const usecase = "showTrendsForm";

    const response = await super.get(
      ReportControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showTrendsFormResponse =
      (await response.json()) as ShowTrendsFormResponse;

    if (showTrendsFormResponse.error) {
      throwError(showTrendsFormResponse.error.code);
    }

    const innerResponse = showTrendsFormResponse.showTrendsFormResponse;
    console.log(innerResponse);
    const trendsTransporter: TrendsTransporter = {
      minDate: new Date(innerResponse.minDate),
      maxDate: new Date(innerResponse.maxDate),
      selectedCapitalsourceIds: innerResponse.settingTrendCapitalsourceId,
    };

    return trendsTransporter;
  }
}

export default new ReportControllerHandler();
