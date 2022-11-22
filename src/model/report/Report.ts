import type { ReportTurnoverCapitalsource } from "./ReportTurnoverCapitalsourceTransport";
import type { Moneyflow } from "../moneyflow/Moneyflow";

export type Report = {
  year: number;
  month: number;
  moneyflows: Array<Moneyflow>;
  reportTurnoverCapitalsources: Array<ReportTurnoverCapitalsource>;
  turnoverEndOfYearCalculated: number;
  amountBeginOfYear: number;
};
