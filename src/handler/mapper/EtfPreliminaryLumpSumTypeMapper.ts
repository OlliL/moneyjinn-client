import { EtfPreliminaryLumpSumType } from "@/model/etf/EtfPreliminaryLumpSumType";

export function mapEtfPreliminaryLumpSumTypeTransportToEnum(
  source: number,
): EtfPreliminaryLumpSumType {
  if (source === 1) return EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH;
  return EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE;
}

export function mapEtfPreliminaryLumpSumTypeEnumToTransport(
  source: EtfPreliminaryLumpSumType,
): number {
  if (source === EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH) return 1;
  return 2;
}
