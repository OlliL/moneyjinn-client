import type { ValidationResponse } from "../ValidationResponse";

export type CreateEtfFlowResponse = ValidationResponse & {
  etfFlowId: number;
};
