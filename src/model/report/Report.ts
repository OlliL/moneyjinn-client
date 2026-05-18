import type { Moneyflow } from "../moneyflow/Moneyflow";
import type { ReportTurnoverCapitalsource } from "./ReportTurnoverCapitalsource";

export type Report = {
  year: number;
  month: number;
  moneyflows: Array<Moneyflow>;
  reportTurnoverCapitalsources?: Array<ReportTurnoverCapitalsource>;
  turnoverEndOfYearCalculated?: number;
  amountBeginOfYear?: number;
};
