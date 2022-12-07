import type { MonthlySettlement } from "./MonthlySettlement";

export type MonthlySettlementEditTransporter = {
  year: number;
  month: number;
  editMode: boolean;
  monthlySettlements: Array<MonthlySettlement>;
  importedMonthlySettlements: Array<MonthlySettlement>;
};
