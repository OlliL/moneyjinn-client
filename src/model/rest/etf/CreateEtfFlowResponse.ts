import type { ValidationItemTransport } from "../transport/ValidationItemTransport";

export type CreateEtfFlowResponse = {
  createEtfFlowResponse: {
    result: boolean;
    validationItemTransport: Array<ValidationItemTransport>;
    etfFlowId: number;
  };
};
