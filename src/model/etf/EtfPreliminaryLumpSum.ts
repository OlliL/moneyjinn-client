import type { EtfPreliminaryLumpSumType } from "./EtfPreliminaryLumpSumType";

export type EtfPreliminaryLumpSum = {
  id: number;
  etfId: number;
  year: number;
  type: EtfPreliminaryLumpSumType;
  amountPerPiece: number | undefined;
  amountJanuary: number | undefined;
  amountFebruary: number | undefined;
  amountMarch: number | undefined;
  amountApril: number | undefined;
  amountMay: number | undefined;
  amountJune: number | undefined;
  amountJuly: number | undefined;
  amountAugust: number | undefined;
  amountSeptember: number | undefined;
  amountOctober: number | undefined;
  amountNovember: number | undefined;
  amountDecember: number | undefined;
};
