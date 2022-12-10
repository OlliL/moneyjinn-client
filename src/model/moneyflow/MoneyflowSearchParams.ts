export type MoneyflowSearchParams = {
  startDate: Date;
  endDate: Date;
  searchString?: string;
  featureEqual: boolean;
  featureRegexp: boolean;
  featureCaseSensitive: boolean;
  featureOnlyMinusAmounts: boolean;
  contractpartnerId?: number;
  postingAccountId?: number;
};
