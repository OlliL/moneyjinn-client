import type { MoneyflowTransport } from "../transport/MoneyflowTransport";
import type { MoneyflowSplitEntryTransport } from "../transport/MoneyflowSplitEntryTransport";
import type { ReportTurnoverCapitalsourceTransport } from "./transport/ReportTurnoverCapitalsourceTransport";
import type { ErrorResponse } from "../ErrorResponse";

export type ListReportsResponse = ErrorResponse & {
  year: number;
  month: number;
  moneyflowTransports: Array<MoneyflowTransport>;
  moneyflowSplitEntryTransports: Array<MoneyflowSplitEntryTransport>;
  reportTurnoverCapitalsourceTransports: Array<ReportTurnoverCapitalsourceTransport>;
  turnoverEndOfYearCalculated: number;
  amountBeginOfYear: number;
  moneyflowsWithReceipt: Array<number>;
};
