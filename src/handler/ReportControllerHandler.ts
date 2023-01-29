import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { GetAvailableMonthResponse } from "@/model/rest/report/GetAvailableMonthResponse";
import type { ListReportsResponse } from "@/model/rest/report/ListReportsResponse";
import type { AvailableMonth } from "@/model/report/AvailableMonth";
import { throwError } from "@/tools/views/ThrowError";
import type { Report } from "@/model/report/Report";
import { mapReportTurnoverCapitalsourceTransportToModel } from "./mapper/ReportTurnoverCapitalsourceTransportMapper";
import { mapMoneyflowTransportToModel } from "./mapper/MoneyflowTransportMapper";
import type { MoneyflowSplitEntryTransport } from "@/model/rest/transport/MoneyflowSplitEntryTransport";
import type { TrendsParameter } from "@/model/report/TrendsParameter";
import type { ShowTrendsFormResponse } from "@/model/rest/report/ShowTrendsFormResponse";
import type { Trends } from "@/model/report/Trends";
import type { ShowTrendsGraphRequest } from "@/model/rest/report/ShowTrendsGraphRequest";
import type { ShowTrendsGraphResponse } from "@/model/rest/report/ShowTrendsGraphResponse";
import type { ReportingParameter } from "@/model/report/ReportingParameter";
import type { ShowReportingFormResponse } from "@/model/rest/report/ShowReportingFormResponse";
import { usePostingAccountStore } from "@/stores/PostingAccountStore";
import type { ReportingMonthAmount } from "@/model/report/ReportingMonthAmount";
import type { ShowMonthlyReportGraphRequest } from "@/model/rest/report/ShowMonthlyReportGraphRequest";
import type { ShowMonthlyReportGraphResponse } from "@/model/rest/report/ShowMonthlyReportGraphResponse";
import type { ShowYearlyReportGraphRequest } from "@/model/rest/report/ShowYearlyReportGraphRequest";
import type { ShowYearlyReportGraphResponse } from "@/model/rest/report/ShowYearlyReportGraphResponse";
import { mapPostingAccountAmountTransportToModel } from "./mapper/PostingAccountAmountTransportMapper";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { getISOStringDate } from "@/tools/views/FormatDate";

class ReportControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "report";

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
      ReportControllerHandler.CONTROLLER,
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

    if (listReportsResponse.code) {
      throwError(listReportsResponse.code);
    }

    const mseMap = new Map<number, Array<MoneyflowSplitEntryTransport>>();

    if (listReportsResponse.moneyflowSplitEntryTransports !== undefined) {
      for (const mse of listReportsResponse.moneyflowSplitEntryTransports) {
        let mseMapArray = mseMap.get(mse.moneyflowid);
        if (mseMapArray == null) {
          mseMapArray = new Array<MoneyflowSplitEntryTransport>();
        }
        mseMapArray.push(mse);
        mseMap.set(mse.moneyflowid, mseMapArray);
      }
    }

    const report: Report = {
      year: listReportsResponse.year,
      month: listReportsResponse.month,
      amountBeginOfYear: listReportsResponse.amountBeginOfYear,
      turnoverEndOfYearCalculated:
        listReportsResponse.turnoverEndOfYearCalculated,
      reportTurnoverCapitalsources:
        listReportsResponse.reportTurnoverCapitalsourceTransports?.map(
          (rtcp) => {
            return mapReportTurnoverCapitalsourceTransportToModel(rtcp);
          }
        ),
      moneyflows: listReportsResponse.moneyflowTransports?.map((mmf) => {
        return mapMoneyflowTransportToModel(
          mmf,
          listReportsResponse.moneyflowsWithReceipt?.includes(mmf.id),
          mseMap.get(mmf.id)
        );
      }),
    };

    return report;
  }

  async showTrendsForm(): Promise<TrendsParameter> {
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

    if (showTrendsFormResponse.code) {
      throwError(showTrendsFormResponse.code);
    }

    const trendsTransporter: TrendsParameter = {
      startDate: new Date(showTrendsFormResponse.minDate),
      endDate: new Date(showTrendsFormResponse.maxDate),
      selectedCapitalsourceIds:
        showTrendsFormResponse.settingTrendCapitalsourceIds,
    };

    return trendsTransporter;
  }

  async showTrendsGraph(trendsParameter: TrendsParameter): Promise<Trends> {
    const usecase = "showTrendsGraph";
    const request = {} as ShowTrendsGraphRequest;

    request.startDate = getISOStringDate(trendsParameter.startDate);
    request.endDate = getISOStringDate(trendsParameter.endDate);
    request.capitalSourceIds = trendsParameter.selectedCapitalsourceIds;

    const response = await super.put(
      request,
      ReportControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showTrendsGraphResponse =
      (await response.json()) as ShowTrendsGraphResponse;
    const result: Trends = {
      trendsCalculated: showTrendsGraphResponse.trendsCalculatedTransports,
      trendsSettled: showTrendsGraphResponse.trendsSettledTransports,
    };

    return result;
  }

  async showReportingForm(): Promise<ReportingParameter> {
    const usecase = "showReportingForm";

    const response = await super.get(
      ReportControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showReportingFormResponse =
      (await response.json()) as ShowReportingFormResponse;

    if (showReportingFormResponse.code) {
      throwError(showReportingFormResponse.code);
    }

    const postingAccountStore = usePostingAccountStore();
    const postingAccounts = postingAccountStore.getPostingAccount;

    let postingAccountsYes: Array<PostingAccount> | undefined;
    let postingAccountsNo: Array<PostingAccount> | undefined;
    if (showReportingFormResponse.postingAccountIds) {
      postingAccountsYes = postingAccounts.filter((pa) => {
        return !showReportingFormResponse.postingAccountIds.includes(pa.id);
      });
      postingAccountsNo = postingAccounts.filter((pa) => {
        return showReportingFormResponse.postingAccountIds.includes(pa.id);
      });
    } else {
      postingAccountsYes = postingAccounts;
    }

    const reportingParameter: ReportingParameter = {
      startDate: new Date(showReportingFormResponse.minDate),
      endDate: new Date(showReportingFormResponse.maxDate),
      selectedPostingAccounts: postingAccountsYes,
      unselectedPostingAccounts: postingAccountsNo,
    };

    return reportingParameter;
  }

  async showMonthlyReportGraph(
    reportingParameter: ReportingParameter
  ): Promise<Array<ReportingMonthAmount>> {
    const usecase = "showMonthlyReportGraph";
    const request = {} as ShowMonthlyReportGraphRequest;

    request.startDate = getISOStringDate(reportingParameter.startDate);
    request.endDate = getISOStringDate(reportingParameter.endDate);
    request.postingAccountIdsYes =
      reportingParameter.selectedPostingAccounts.map((mpa) => mpa.id);
    if (reportingParameter.unselectedPostingAccounts)
      request.postingAccountIdsNo =
        reportingParameter.unselectedPostingAccounts.map((mpa) => mpa.id);

    const response = await super.put(
      request,
      ReportControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showMonthlyReportGraphResponse =
      (await response.json()) as ShowMonthlyReportGraphResponse;

    const result: Array<ReportingMonthAmount> =
      showMonthlyReportGraphResponse.postingAccountAmountTransports.map(
        (paat) => mapPostingAccountAmountTransportToModel(paat)
      );

    return result;
  }

  async showYearlyReportGraph(
    reportingParameter: ReportingParameter
  ): Promise<Array<ReportingMonthAmount>> {
    const usecase = "showYearlyReportGraph";
    const request = {} as ShowYearlyReportGraphRequest;

    request.startDate = getISOStringDate(reportingParameter.startDate);
    request.endDate = getISOStringDate(reportingParameter.endDate);
    request.postingAccountIdsYes =
      reportingParameter.selectedPostingAccounts.map((mpa) => mpa.id);
    if (reportingParameter.unselectedPostingAccounts)
      request.postingAccountIdsNo =
        reportingParameter.unselectedPostingAccounts.map((mpa) => mpa.id);

    const response = await super.put(
      request,
      ReportControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showYearlyReportGraphResponse =
      (await response.json()) as ShowYearlyReportGraphResponse;

    const result: Array<ReportingMonthAmount> =
      showYearlyReportGraphResponse.postingAccountAmountTransports.map((paat) =>
        mapPostingAccountAmountTransportToModel(paat)
      );

    return result;
  }
}

export default new ReportControllerHandler();
