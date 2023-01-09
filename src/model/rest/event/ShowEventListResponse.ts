import type { AbstractResponse } from "../AbstractResponse";

export type ShowEventListResponse = AbstractResponse & {
  monthlySettlementMissing: boolean;
  monthlySettlementMonth: number;
  monthlySettlementYear: number;
  numberOfImportedMoneyflows: number;
};
