import type { ErrorResponse } from "../ErrorResponse";
import type { MonthlySettlementTransport } from "../transport/MonthlySettlementTransport";

export type ShowMonthlySettlementListResponse = ErrorResponse & {
  monthlySettlementTransports: Array<MonthlySettlementTransport>;
};
