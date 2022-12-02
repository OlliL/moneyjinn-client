import type { ValidationItemTransport } from "../transport/ValidationItemTransport";

export type CreateCapitalsourceResponse = {
  createCapitalsourceResponse: {
    result: boolean;
    validationItemTransport: Array<ValidationItemTransport>;
    capitalsourceId: number;
  };
};
