export type EtfSummary = {
  isin: string;
  name: string;
  chartUrl: string;
  amount: number;
  spentValue: number;
  buyPrice?: number;
  sellPrice?: number;
  pricesTimestamp?: Date;
};
