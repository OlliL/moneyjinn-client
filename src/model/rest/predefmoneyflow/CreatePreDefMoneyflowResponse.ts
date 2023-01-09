import type { ValidationResponse } from "../ValidationResponse";

export type CreatePreDefMoneyflowResponse = ValidationResponse & {
  preDefMoneyflowId: number;
};
