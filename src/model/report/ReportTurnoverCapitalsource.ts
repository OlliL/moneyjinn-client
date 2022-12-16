import type { CapitalsourceState } from "../capitalsource/CapitalsourceState";
import type { CapitalsourceType } from "../capitalsource/CapitalsourceType";

export type ReportTurnoverCapitalsource = {
  capitalsourceType: CapitalsourceType;
  capitalsourceState: CapitalsourceState;
  capitalsourceComment: string;
  amountBeginOfMonthFixed: number;
  amountEndOfMonthFixed?: number;
  amountEndOfMonthCalculated: number;
  amountCurrent?: number;
  amountCurrentState?: Date;
};
