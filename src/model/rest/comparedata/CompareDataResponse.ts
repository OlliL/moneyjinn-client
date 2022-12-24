import type { CompareDataMatchingTransport } from "./transport/CompareDataMatchingTransport";
import type { CompareDataNotInDatabaseTransport } from "./transport/CompareDataNotInDatabaseTransport";
import type { CompareDataNotInFileTransport } from "./transport/CompareDataNotInFileTransport";
import type { CompareDataWrongCapitalsourceTransport } from "./transport/CompareDataWrongCapitalsourceTransport";

export type CompareDataResponse = {
  compareDataResponse: {
    compareDataMatchingTransport: Array<CompareDataMatchingTransport>;
    compareDataWrongCapitalsourceTransport: Array<CompareDataWrongCapitalsourceTransport>;
    compareDataNotInFileTransport: Array<CompareDataNotInFileTransport>;
    compareDataNotInDatabaseTransport: Array<CompareDataNotInDatabaseTransport>;
  };
};
