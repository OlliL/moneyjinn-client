import type { CompareDataFormat } from "./CompareDataFormat";

export type CompareDataParameter = {
  startDate: Date;
  endDate: Date;
  compareDataFormats: Array<CompareDataFormat>;
  selectedCompareDataFormat: number;
  selectedCapitalSourceId: number;
  selectedSourceIsImport: boolean;
  fileContents: string;
};
