import type { CapitalsourceType } from "../capitalsource/CapitalsourceType";

export type MonthlySettlement = {
  id: number;
  userId: number;
  year: number;
  month: number;
  amount: number;
  capitalsourceId: number;
  capitalsourceComment?: string;
  capitalsourceGroupUse?: boolean;
  capitalsourceType?: CapitalsourceType;
};
