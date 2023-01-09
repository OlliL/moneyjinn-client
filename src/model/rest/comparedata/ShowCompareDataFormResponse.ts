import type { ErrorResponse } from "../ErrorResponse";
import type { CompareDataFormatTransport } from "./transport/CompareDataFormatTransport";

export type ShowCompareDataFormResponse = ErrorResponse & {
  compareDataFormatTransports: Array<CompareDataFormatTransport>;
  selectedCapitalsourceId: number;
  selectedDataFormat: number;
  selectedSourceIsFile: number;
};
