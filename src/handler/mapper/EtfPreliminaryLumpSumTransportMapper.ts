import type { EtfPreliminaryLumpSumTransport } from "@/api";
import type { EtfPreliminaryLumpSum } from "@/model/etf/EtfPreliminaryLumpSum";
import {
  mapEtfPreliminaryLumpSumTypeEnumToTransport,
  mapEtfPreliminaryLumpSumTypeTransportToEnum,
} from "./EtfPreliminaryLumpSumTypeMapper";

export function mapEtfPreliminaryLumpSumTransportToModel(
  transport: EtfPreliminaryLumpSumTransport,
): EtfPreliminaryLumpSum {
  const model: EtfPreliminaryLumpSum = {
    id: transport.id,
    etfId: transport.etfId,
    year: transport.year,
    type: mapEtfPreliminaryLumpSumTypeTransportToEnum(transport.type),
    amountPerPiece: transport.amountPerPiece,
    amountJanuary: transport.amountJanuary,
    amountFebruary: transport.amountFebruary,
    amountMarch: transport.amountMarch,
    amountApril: transport.amountApril,
    amountMay: transport.amountMay,
    amountJune: transport.amountJune,
    amountJuly: transport.amountJuly,
    amountAugust: transport.amountAugust,
    amountSeptember: transport.amountSeptember,
    amountOctober: transport.amountOctober,
    amountNovember: transport.amountNovember,
    amountDecember: transport.amountDecember,
  };
  return model;
}

export function mapEtfPreliminaryLumpSumModelToTransport(
  model: EtfPreliminaryLumpSum,
): EtfPreliminaryLumpSumTransport {
  const transport: EtfPreliminaryLumpSumTransport = {
    id: model.id,
    etfId: model.etfId,
    year: model.year,
    type: mapEtfPreliminaryLumpSumTypeEnumToTransport(model.type),
    amountPerPiece: model.amountPerPiece,
    amountJanuary: model.amountJanuary,
    amountFebruary: model.amountFebruary,
    amountMarch: model.amountMarch,
    amountApril: model.amountApril,
    amountMay: model.amountMay,
    amountJune: model.amountJune,
    amountJuly: model.amountJuly,
    amountAugust: model.amountAugust,
    amountSeptember: model.amountSeptember,
    amountOctober: model.amountOctober,
    amountNovember: model.amountNovember,
    amountDecember: model.amountDecember,
  };
  return transport;
}
