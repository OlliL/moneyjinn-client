import type { AbstractResponse } from "../AbstractResponse";
import type { MonthlySettlementTransport } from "../transport/MonthlySettlementTransport";

export type ShowMonthlySettlementCreateResponse = AbstractResponse & {
  year: number;
  month: number;
  editMode: number;
  monthlySettlementTransports: Array<MonthlySettlementTransport>;
  importedMonthlySettlementTransports?: Array<MonthlySettlementTransport>;
};
