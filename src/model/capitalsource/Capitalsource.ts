import type { CapitalsourceImport } from "./CapitalsourceImport";
import type { CapitalsourceState } from "./CapitalsourceState";
import type { CapitalsourceType } from "./CapitalsourceType";

export type Capitalsource = {
  id: number;
  userId: number;
  type: CapitalsourceType;
  state: CapitalsourceState;
  accountNumber: string;
  bankCode: string;
  comment: string;
  validTil: Date;
  validFrom: Date;
  groupUse: boolean;
  importAllowed: CapitalsourceImport;
};
