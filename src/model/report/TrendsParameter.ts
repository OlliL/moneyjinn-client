export type TrendsParameter = {
  startDate: Date;
  endDate: Date;
  selectedCapitalsourceIds?: Array<number>;
  selectedEtfIds?: Array<number>;
  capitalsourcesActive: boolean;
  etfsActive: boolean;
};
