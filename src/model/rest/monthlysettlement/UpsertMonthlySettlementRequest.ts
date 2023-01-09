import type { MonthlySettlementTransport } from "../transport/MonthlySettlementTransport";

export type UpsertMonthlySettlementRequest = {
  monthlySettlementTransports: Array<MonthlySettlementTransport>;
};
