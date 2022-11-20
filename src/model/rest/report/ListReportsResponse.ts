import type { ErrorResponse } from "../ErrorResponse";
import type { MoneyflowTransport } from "../transport/MoneyflowTransport";
import type { MoneyflowSplitEntryTransport } from "../transport/MoneyflowSplitEntryTransport";
import type { ReportTurnoverCapitalsourceTransport } from "./transport/ReportTurnoverCapitalsourceTransport";

export type ListReportsResponse = {
  error?: ErrorResponse;
  listReportsResponse: {
    year: number;
    month: number;
    moneyflowTransport: Array<MoneyflowTransport>;
    moneyflowSplitEntryTransport: Array<MoneyflowSplitEntryTransport>;
    reportTurnoverCapitalsourceTransport: Array<ReportTurnoverCapitalsourceTransport>;
    turnoverEndOfYearCalculated: number;
    amountBeginOfYear: number;
    moneyflowsWithReceipt: Array<number>;
  };
};
