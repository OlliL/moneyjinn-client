export type CompareDataRequest = {
  compareDataRequest: {
    formatId: number;
    capitalSourceId: number;
    startDate: string;
    endDate: string;
    fileContents: string;
    useImportedData: number;
  };
};
