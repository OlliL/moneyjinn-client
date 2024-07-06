import type { ReportTurnoverCapitalsourceTransport } from "@/api";
import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsource";
import { mapCapitalsourceStateTransportToEnum } from "./CapitalsourceStateMapper";
import { mapCapitalsourceTypeTransportToEnum } from "./CapitalsourceTypeMapper";

export function mapReportTurnoverCapitalsourceTransportToModel(
  transport: ReportTurnoverCapitalsourceTransport,
): ReportTurnoverCapitalsource {
  const model: ReportTurnoverCapitalsource = {
    capitalsourceComment: transport.capitalsourceComment,
    capitalsourceState: mapCapitalsourceStateTransportToEnum(
      transport.capitalsourceState,
    ),
    capitalsourceType: mapCapitalsourceTypeTransportToEnum(
      transport.capitalsourceType,
    ),
    amountBeginOfMonthFixed: transport.amountBeginOfMonthFixed,
    amountEndOfMonthCalculated: transport.amountEndOfMonthCalculated,
    amountEndOfMonthFixed: transport.amountEndOfMonthFixed,
    amountCurrent: transport.amountCurrent,
    amountCurrentState: transport.amountCurrentState
      ? new Date(transport.amountCurrentState)
      : undefined,
  };
  return model;
}
