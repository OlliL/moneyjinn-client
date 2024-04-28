export type EtfSummary = {
  etfId: number;
  name: string;
  chartUrl: string;
  amount: number;
  spentValue: number;
  buyPrice?: number;
  sellPrice?: number;
  pricesTimestamp?: Date;
};
