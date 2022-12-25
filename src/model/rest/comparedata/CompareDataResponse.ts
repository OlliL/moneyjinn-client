import type { ErrorResponse } from "../ErrorResponse";
import type { CompareDataTransport } from "./transport/CompareDataTransport";

export type CompareDataResponse = ErrorResponse & {
  compareDataResponse: {
    compareDataMatchingTransport: Array<CompareDataTransport>;
    compareDataWrongCapitalsourceTransport: Array<CompareDataTransport>;
    compareDataNotInFileTransport: Array<CompareDataTransport>;
    compareDataNotInDatabaseTransport: Array<CompareDataTransport>;
  };
};
