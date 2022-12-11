import type { ValidationItemTransport } from "../transport/ValidationItemTransport";

export type CreatePreDefMoneyflowResponse = {
  createPreDefMoneyflowResponse: {
    result: boolean;
    validationItemTransport: Array<ValidationItemTransport>;
    preDefMoneyflowId: number;
  };
};
