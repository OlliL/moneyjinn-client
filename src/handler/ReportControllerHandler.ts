import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { GetAvailableMonthResponse } from "@/model/rest/report/GetAvailableMonthResponse";
import type { ListReportsResponse } from "@/model/rest/report/ListReportsResponse";
import type { AvailableMonth } from "@/model/report/AvailableMonth";
import { throwError } from "@/tools/views/ThrowError";
import type { Report } from "@/model/report/Report";
import { mapReportTurnoverCapitalsourceTransportToReportTurnoverCapitalsource } from "./mapper/ReportTurnoverCapitalsourceTransportMapper";

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

    //FIXME: make Transport-Mapper
    const report: Report = {
      year: data.year,
      month: data.month,
      amountBeginOfYear: data.amountBeginOfYear,
      moneyflows: data.moneyflowTransport,
      moneyflowSplitEntrys: data.moneyflowSplitEntryTransport,
      moneyflowsWithReceipt: data.moneyflowsWithReceipt,
      reportTurnoverCapitalsources:
        data.reportTurnoverCapitalsourceTransport.map((rtcp) => {
          return mapReportTurnoverCapitalsourceTransportToReportTurnoverCapitalsource(
            rtcp
          );
        }),
      turnoverEndOfYearCalculated: data.turnoverEndOfYearCalculated,
    };

    return report;
  }
}

export default new ReportControllerHandler();
