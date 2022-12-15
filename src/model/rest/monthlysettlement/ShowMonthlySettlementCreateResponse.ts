import type { ErrorResponse } from "../ErrorResponse";
import type { MonthlySettlementTransport } from "../transport/MonthlySettlementTransport";

export type ShowMonthlySettlementCreateResponse = ErrorResponse & {
  showMonthlySettlementCreateResponse: {
    year: number;
    month: number;
    editMode: number;
    monthlySettlementTransport: Array<MonthlySettlementTransport>;
    importedMonthlySettlementTransport?: Array<MonthlySettlementTransport>;
  };
};
