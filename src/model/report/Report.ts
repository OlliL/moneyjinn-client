import type { ReportTurnoverCapitalsource } from "./ReportTurnoverCapitalsourceTransport";
import type { MoneyflowSplitEntry } from "../moneyflow/MoneyflowSplitEntry";
import type { Moneyflow } from "../moneyflow/Moneyflow";

export type Report = {
  year: number;
  month: number;
  moneyflows: Array<Moneyflow>;
  moneyflowSplitEntrys: Array<MoneyflowSplitEntry>;
  reportTurnoverCapitalsources: Array<ReportTurnoverCapitalsource>;
  turnoverEndOfYearCalculated: number;
  amountBeginOfYear: number;
  moneyflowsWithReceipt: Array<number>;
};
