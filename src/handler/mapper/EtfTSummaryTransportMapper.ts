import type { EtfSummary } from "@/model/etf/EtfSummary";
import type { EtfSummaryTransport } from "@/model/rest/transport/EtfSummaryTransport";

export function mapEtfSummaryTransportToEtfSummary(
  transport: EtfSummaryTransport
): EtfSummary {
  const etfData: EtfSummary = {
    isin: transport.isin,
    name: transport.name,
    chartUrl: transport.chartUrl,
    amount: transport.amount,
    spentValue: transport.spentValue,
    buyPrice: transport.buyPrice,
    sellPrice: transport.sellPrice,
    pricesTimestamp: transport.pricesTimestamp
      ? new Date(transport.pricesTimestamp)
      : undefined,
  };
  return etfData;
}
