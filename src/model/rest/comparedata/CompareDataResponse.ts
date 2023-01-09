import type { ErrorResponse } from "../ErrorResponse";
import type { CompareDataTransport } from "./transport/CompareDataTransport";

export type CompareDataResponse = ErrorResponse & {
  compareDataMatchingTransports: Array<CompareDataTransport>;
  compareDataWrongCapitalsourceTransports: Array<CompareDataTransport>;
  compareDataNotInFileTransports: Array<CompareDataTransport>;
  compareDataNotInDatabaseTransports: Array<CompareDataTransport>;
};
