import type { ValidationResponse } from "../ValidationResponse";

export type CreateContractpartnerResponse = ValidationResponse & {
  contractpartnerId: number;
};
