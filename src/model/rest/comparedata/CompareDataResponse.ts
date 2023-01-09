import type { AbstractResponse } from "../AbstractResponse";
import type { CompareDataTransport } from "./transport/CompareDataTransport";

export type CompareDataResponse = AbstractResponse & {
  compareDataMatchingTransports: Array<CompareDataTransport>;
  compareDataWrongCapitalsourceTransports: Array<CompareDataTransport>;
  compareDataNotInFileTransports: Array<CompareDataTransport>;
  compareDataNotInDatabaseTransports: Array<CompareDataTransport>;
};
