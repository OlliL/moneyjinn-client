import type { MonthlySettlementTransport } from "../transport/MonthlySettlementTransport";

export type UpsertMonthlySettlementRequest = {
  upsertMonthlySettlementRequest: {
    monthlySettlementTransport: Array<MonthlySettlementTransport>;
  };
};
