import type { ValidationItemTransport } from "../transport/ValidationItemTransport";

export type CreateContractpartnerResponse = {
  createContractpartnerResponse: {
    result: boolean;
    validationItemTransport: Array<ValidationItemTransport>;
    contractpartnerId: number;
  };
};
