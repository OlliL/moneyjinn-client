export type MoneyflowSearchParamsTransport = {
  startDate: string;
  endDate: string;
  searchString?: string;
  featureEqual: number;
  featureRegexp: number;
  featureCaseSensitive: number;
  featureOnlyMinusAmounts: number;
  contractpartnerId?: number;
  postingAccountId?: number;
};
