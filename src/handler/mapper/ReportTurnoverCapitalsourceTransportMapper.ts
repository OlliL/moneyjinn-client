import type { ReportTurnoverCapitalsource } from "@/model/report/ReportTurnoverCapitalsourceTransport";
import type { ReportTurnoverCapitalsourceTransport } from "@/model/rest/report/transport/ReportTurnoverCapitalsourceTransport";

export function mapReportTurnoverCapitalsourceTransportToReportTurnoverCapitalsource(
  transport: ReportTurnoverCapitalsourceTransport
): ReportTurnoverCapitalsource {
  const etfData: ReportTurnoverCapitalsource = {
    capitalsourceComment: transport.capitalsourceComment,
    capitalsourceState: transport.capitalsourceState,
    capitalsourceType: transport.capitalsourceType,
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
