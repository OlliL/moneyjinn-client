import type { ErrorResponse } from "../ErrorResponse";

export type ShowEventListResponse = ErrorResponse & {
  showEventListResponse: {
    monthlySettlementMissing: boolean;
    monthlySettlementMonth: number;
    monthlySettlementYear: number;
    numberOfImportedMoneyflows: number;
  };
};
