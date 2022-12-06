import type { ErrorResponse } from "../ErrorResponse";
import type { MonthlySettlementTransport } from "../transport/MonthlySettlementTransport";

export type ShowMonthlySettlementListResponse = {
  error?: ErrorResponse;
  showMonthlySettlementListResponse: {
    monthlySettlementTransport: Array<MonthlySettlementTransport>;
  };
};
