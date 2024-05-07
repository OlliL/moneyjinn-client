import { EtfPreliminaryLumpSumType } from "@/model/etf/EtfPreliminaryLumpSumType";

export function mapEtfPreliminaryLumpSumTypeTransportToEnum(
  source: number,
): EtfPreliminaryLumpSumType {
  switch (source) {
    case 1: {
      return EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH;
    }
    default: {
      // 2
      return EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE;
    }
  }
}

export function mapEtfPreliminaryLumpSumTypeEnumToTransport(
  source: EtfPreliminaryLumpSumType,
): number {
  switch (source) {
    case EtfPreliminaryLumpSumType.AMOUNT_PER_MONTH: {
      return 1;
    }
    default: {
      // EtfPreliminaryLumpSumType.AMOUNT_PER_PIECE
      return 2;
    }
  }
}
