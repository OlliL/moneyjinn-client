import type { ErrorResponse } from "../ErrorResponse";
import type { MonthlySettlementTransport } from "../transport/MonthlySettlementTransport";

export type ShowMonthlySettlementCreateResponse = ErrorResponse & {
  year: number;
  month: number;
  editMode: number;
  monthlySettlementTransports: Array<MonthlySettlementTransport>;
  importedMonthlySettlementTransports?: Array<MonthlySettlementTransport>;
};
