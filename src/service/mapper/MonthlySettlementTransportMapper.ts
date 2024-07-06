import type { MonthlySettlementTransport } from "@/api";
import type { MonthlySettlement } from "@/model/monthlysettlement/MonthlySettlement";
import {
  mapCapitalsourceTypeEnumToTransport,
  mapCapitalsourceTypeTransportToEnum,
} from "./CapitalsourceTypeMapper";

export function mapMonthlySettlementTransportToModel(
  transport: MonthlySettlementTransport,
): MonthlySettlement {
  const model: MonthlySettlement = {
    id: transport.id,
    userId: transport.userid,
    year: transport.year,
    month: transport.month,
    amount: transport.amount,
    capitalsourceId: transport.capitalsourceid,
    capitalsourceComment: transport.capitalsourcecomment,
    capitalsourceGroupUse: transport.capitalsourcegroupuse === 1,
    capitalsourceType: transport.capitalsourcetype
      ? mapCapitalsourceTypeTransportToEnum(transport.capitalsourcetype)
      : undefined,
  };
  return model;
}

export function mapMonthlySettlementToTransport(
  model: MonthlySettlement,
): MonthlySettlementTransport {
  const transport: MonthlySettlementTransport = {
    id: model.id,
    userid: model.userId,
    year: model.year,
    month: model.month,
    amount: model.amount,
    capitalsourceid: model.capitalsourceId,
    capitalsourcecomment: model.capitalsourceComment,
    capitalsourcegroupuse: model.capitalsourceGroupUse ? 1 : 0,
    capitalsourcetype: model.capitalsourceType
      ? mapCapitalsourceTypeEnumToTransport(model.capitalsourceType)
      : undefined,
  };
  return transport;
}
