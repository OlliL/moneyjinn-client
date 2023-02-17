import type { EtfSummaryTransport } from "@/api";
import type { EtfSummary } from "@/model/etf/EtfSummary";

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
