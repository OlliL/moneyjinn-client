import type { AbstractResponse } from "../AbstractResponse";
import type { MonthlySettlementTransport } from "../transport/MonthlySettlementTransport";

export type ShowMonthlySettlementListResponse = AbstractResponse & {
  monthlySettlementTransports: Array<MonthlySettlementTransport>;
};
