import type { AbstractResponse } from "../AbstractResponse";
import type { CompareDataFormatTransport } from "./transport/CompareDataFormatTransport";

export type ShowCompareDataFormResponse = AbstractResponse & {
  compareDataFormatTransports: Array<CompareDataFormatTransport>;
  selectedCapitalsourceId: number;
  selectedDataFormat: number;
  selectedSourceIsFile: number;
};
