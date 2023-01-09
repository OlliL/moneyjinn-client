import type { ErrorResponse } from "../ErrorResponse";

export type ShowEventListResponse = ErrorResponse & {
  monthlySettlementMissing: boolean;
  monthlySettlementMonth: number;
  monthlySettlementYear: number;
  numberOfImportedMoneyflows: number;
};
