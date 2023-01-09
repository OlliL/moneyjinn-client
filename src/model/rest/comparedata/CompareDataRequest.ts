export type CompareDataRequest = {
  formatId: number;
  capitalsourceId: number;
  startDate: string;
  endDate: string;
  fileContents: string;
  useImportedData: number;
};
