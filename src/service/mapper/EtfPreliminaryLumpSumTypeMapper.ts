import { EtfPreliminaryLumpSumType } from "@/model/etf/EtfPreliminaryLumpSumType";

export function mapEtfPreliminaryLumpSumTypeTransportToEnum(
  source: number,
): EtfPreliminaryLumpSumType {
  if (source === 1) return EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH;
  if (source === 2) return EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE;
  if (source === 3) return EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR;
  return EtfPreliminaryLumpSumType.__PLACEHOLDER;
}

export function mapEtfPreliminaryLumpSumTypeEnumToTransport(
  source: EtfPreliminaryLumpSumType,
): number {
  if (source === EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH) return 1;
  if (source === EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE) return 2;
  if (source === EtfPreliminaryLumpSumType.AMOUNT_PER_YEAR) return 3;
  return 0;
}
