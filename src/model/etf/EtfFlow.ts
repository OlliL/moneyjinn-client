export type EtfFlow = {
  etfflowid: number;
  etfId: number;
  timestamp: Date;
  nanoseconds: number;
  amount: number;
  price: number;
  accumulatedPreliminaryLumpSum: number;
  preliminaryLumpSumPerYear: Map<string, number>;
};
