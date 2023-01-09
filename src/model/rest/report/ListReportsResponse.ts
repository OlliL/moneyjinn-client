import type { MoneyflowTransport } from "../transport/MoneyflowTransport";
import type { MoneyflowSplitEntryTransport } from "../transport/MoneyflowSplitEntryTransport";
import type { ReportTurnoverCapitalsourceTransport } from "./transport/ReportTurnoverCapitalsourceTransport";
import type { AbstractResponse } from "../AbstractResponse";

export type ListReportsResponse = AbstractResponse & {
  year: number;
  month: number;
  moneyflowTransports: Array<MoneyflowTransport>;
  moneyflowSplitEntryTransports: Array<MoneyflowSplitEntryTransport>;
  reportTurnoverCapitalsourceTransports: Array<ReportTurnoverCapitalsourceTransport>;
  turnoverEndOfYearCalculated: number;
  amountBeginOfYear: number;
  moneyflowsWithReceipt: Array<number>;
};
