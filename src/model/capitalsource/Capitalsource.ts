import type { CapitalsourceState } from "./CapitalsourceState";
import type { CapitalsourceType } from "./CapitalsourceType";

export type Capitalsource = {
  id: number;
  userId: number;
  type: CapitalsourceType;
  state: CapitalsourceState;
  accountNumber: number;
  bankCode: number;
  comment: string;
  validTil: Date;
  validFrom: Date;
  groupUse: boolean;
  importAllowed: boolean;
};
