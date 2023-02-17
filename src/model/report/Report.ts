import type { ReportTurnoverCapitalsource } from "./ReportTurnoverCapitalsource";
import type { Moneyflow } from "../moneyflow/Moneyflow";

export type Report = {
  year: number;
  month: number;
  moneyflows: Array<Moneyflow>;
  reportTurnoverCapitalsources?: Array<ReportTurnoverCapitalsource>;
  turnoverEndOfYearCalculated?: number;
  amountBeginOfYear?: number;
};
