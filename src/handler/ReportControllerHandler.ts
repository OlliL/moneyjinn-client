import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { AvailableMonth } from "@/model/report/AvailableMonth";
import type { Report } from "@/model/report/Report";
import { mapReportTurnoverCapitalsourceTransportToModel } from "./mapper/ReportTurnoverCapitalsourceTransportMapper";
import { mapMoneyflowTransportToModel } from "./mapper/MoneyflowTransportMapper";
import type { TrendsParameter } from "@/model/report/TrendsParameter";
import type { Trends } from "@/model/report/Trends";
import type { ReportingParameter } from "@/model/report/ReportingParameter";
import { usePostingAccountStore } from "@/stores/PostingAccountStore";
import type { ReportingMonthAmount } from "@/model/report/ReportingMonthAmount";
import { mapPostingAccountAmountTransportToModel } from "./mapper/PostingAccountAmountTransportMapper";
import type { PostingAccount } from "@/model/postingaccount/PostingAccount";
import { getISOStringDate } from "@/tools/views/FormatDate";
import {
  ReportControllerApi,
  type GetAvailableReportMonthResponse,
  type MoneyflowSplitEntryTransport,
  type ShowMonthlyReportGraphRequest,
  type ShowTrendsGraphRequest,
  type ShowYearlyReportGraphRequest,
} from "@/api";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";
import type { AxiosResponse } from "axios";

class ReportControllerHandler extends AbstractControllerHandler {
  private api: ReportControllerApi;

  public constructor() {
    super();

    this.api = new ReportControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance(),
    );
  }

  private static CONTROLLER = "report";

  async getAvailableMonth(
    year?: number,
    month?: number,
  ): Promise<AvailableMonth> {
    let response: AxiosResponse<GetAvailableReportMonthResponse>;
    if (year) {
      if (month) {
        response = await this.api.getAvailableMonthYearMonth(year, month);
      } else {
        response = await this.api.getAvailableMonthYear(year);
      }
    } else {
      response = await this.api.getAvailableMonth();
    }
    const getAvailableMonthResponse = response.data;

    // easy mapping for now - same attributes
    const availableMonth: AvailableMonth = getAvailableMonthResponse;

    return availableMonth;
  }

  async listReports(year: number, month: number): Promise<Report> {
    const response = await this.api.listReportsV2(year, month);

    const listReportsResponse = response.data;

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
          },
        ),
      moneyflows: listReportsResponse.moneyflowTransports?.map((mmf) => {
        return mapMoneyflowTransportToModel(
          mmf,
          listReportsResponse.moneyflowsWithReceipt
            ? listReportsResponse.moneyflowsWithReceipt.includes(mmf.id)
            : false,
          mseMap.get(mmf.id),
        );
      }),
    };

    return report;
  }

  async showTrendsForm(): Promise<TrendsParameter> {
    const response = await this.api.showTrendsForm();

    const showTrendsFormResponse = response.data;

    const trendsTransporter: TrendsParameter = {
      startDate: new Date(showTrendsFormResponse.minDate),
      endDate: new Date(showTrendsFormResponse.maxDate),
      selectedCapitalsourceIds:
        showTrendsFormResponse.settingTrendCapitalsourceIds,
    };

    return trendsTransporter;
  }

  async showTrendsGraph(trendsParameter: TrendsParameter): Promise<Trends> {
    const request = {} as ShowTrendsGraphRequest;

    request.startDate = getISOStringDate(trendsParameter.startDate);
    request.endDate = getISOStringDate(trendsParameter.endDate);
    request.capitalSourceIds = trendsParameter.selectedCapitalsourceIds;

    const response = await this.api.showTrendsGraph(request);

    const showTrendsGraphResponse = response.data;

    const result: Trends = {
      trendsCalculated: showTrendsGraphResponse.trendsCalculatedTransports,
      trendsSettled: showTrendsGraphResponse.trendsSettledTransports,
    };

    return result;
  }

  async showReportingForm(): Promise<ReportingParameter> {
    const response = await this.api.showReportingForm();

    const showReportingFormResponse = response.data;

    const postingAccountStore = usePostingAccountStore();
    const postingAccounts = postingAccountStore.getPostingAccount;

    let postingAccountsYes: Array<PostingAccount> | undefined;
    let postingAccountsNo: Array<PostingAccount> | undefined;
    const mpas = showReportingFormResponse.postingAccountIds;
    if (mpas) {
      postingAccountsYes = postingAccounts.filter((pa) => {
        return !mpas.includes(pa.id);
      });
      postingAccountsNo = postingAccounts.filter((pa) => {
        return mpas.includes(pa.id);
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
    reportingParameter: ReportingParameter,
  ): Promise<Array<ReportingMonthAmount>> {
    const request = {} as ShowMonthlyReportGraphRequest;

    request.startDate = getISOStringDate(reportingParameter.startDate);
    request.endDate = getISOStringDate(reportingParameter.endDate);
    request.postingAccountIdsYes =
      reportingParameter.selectedPostingAccounts.map((mpa) => mpa.id);
    if (reportingParameter.unselectedPostingAccounts)
      request.postingAccountIdsNo =
        reportingParameter.unselectedPostingAccounts.map((mpa) => mpa.id);

    const response = await this.api.showMonthlyReportGraph(request);

    const showMonthlyReportGraphResponse = response.data;

    if (showMonthlyReportGraphResponse.postingAccountAmountTransports) {
      const result: Array<ReportingMonthAmount> =
        showMonthlyReportGraphResponse.postingAccountAmountTransports.map(
          (paat) => mapPostingAccountAmountTransportToModel(paat),
        );

      return result;
    }
    return new Array<ReportingMonthAmount>();
  }

  async showYearlyReportGraph(
    reportingParameter: ReportingParameter,
  ): Promise<Array<ReportingMonthAmount>> {
    const request = {} as ShowYearlyReportGraphRequest;

    request.startDate = getISOStringDate(reportingParameter.startDate);
    request.endDate = getISOStringDate(reportingParameter.endDate);
    request.postingAccountIdsYes =
      reportingParameter.selectedPostingAccounts.map((mpa) => mpa.id);
    if (reportingParameter.unselectedPostingAccounts)
      request.postingAccountIdsNo =
        reportingParameter.unselectedPostingAccounts.map((mpa) => mpa.id);

    const response = await this.api.showYearlyReportGraph(request);

    const showYearlyReportGraphResponse = response.data;

    if (showYearlyReportGraphResponse.postingAccountAmountTransports) {
      const result: Array<ReportingMonthAmount> =
        showYearlyReportGraphResponse.postingAccountAmountTransports.map(
          (paat) => mapPostingAccountAmountTransportToModel(paat),
        );

      return result;
    }
    return new Array<ReportingMonthAmount>();
  }
}

export default new ReportControllerHandler();
