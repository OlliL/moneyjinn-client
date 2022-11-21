import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsourceTransport";
import type { ReportTurnoverCapitalsourceTransport } from "@/model/rest/report/transport/ReportTurnoverCapitalsourceTransport";
import { mapCapitalsourceStateTransportToEnum } from "./CapitalsourceStateMapper";
import { mapCapitalsourceTypeTransportToEnum } from "./CapitalsourceTypeMapper";

export function mapReportTurnoverCapitalsourceTransportToReportTurnoverCapitalsource(
  transport: ReportTurnoverCapitalsourceTransport
): ReportTurnoverCapitalsource {
  const etfData: ReportTurnoverCapitalsource = {
    capitalsourceComment: transport.capitalsourceComment,
    capitalsourceState: mapCapitalsourceStateTransportToEnum(
      transport.capitalsourceState
    ),
    capitalsourceType: mapCapitalsourceTypeTransportToEnum(
      transport.capitalsourceType
    ),
    amountBeginOfMonthFixed: transport.amountBeginOfMonthFixed,
    amountEndOfMonthCalculated: transport.amountEndOfMonthCalculated,
    amountEndOfMonthFixed: transport.amountEndOfMonthFixed,
    amountCurrent: transport.amountCurrent,
    amountCurrentState: transport.amountCurrentState
      ? new Date(transport.amountCurrentState)
      : undefined,
  };
  return etfData;
}
