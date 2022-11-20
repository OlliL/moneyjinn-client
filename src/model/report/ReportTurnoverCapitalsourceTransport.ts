//FIXME: amountCurrentState --> Date
export type ReportTurnoverCapitalsource = {
  capitalsourceType: number;
  capitalsourceState: number;
  capitalsourceComment: string;
  amountBeginOfMonthFixed: number;
  amountEndOfMonthFixed: number;
  amountEndOfMonthCalculated: number;
  amountCurrent: number;
  amountCurrentState: string;
};
