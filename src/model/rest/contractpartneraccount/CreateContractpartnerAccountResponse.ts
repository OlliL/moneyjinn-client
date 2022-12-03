import type { ValidationItemTransport } from "../transport/ValidationItemTransport";

export type CreateContractpartnerAccountResponse = {
  createContractpartnerAccountResponse: {
    result: boolean;
    validationItemTransport: Array<ValidationItemTransport>;
    contractpartnerAccountId: number;
  };
};
