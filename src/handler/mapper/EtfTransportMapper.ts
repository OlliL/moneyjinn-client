import type { EtfTransport } from "@/api";
import type { Etf } from "@/model/etf/Etf";

export function mapEtfTransportToModel(transport: EtfTransport): Etf {
  const model: Etf = {
    id: transport.etfId,
    userId: transport.userid,
    isin: transport.isin,
    name: transport.name,
    wkn: transport.wkn,
    ticker: transport.ticker,
    chartUrl: transport.chartUrl,
    isFavorite: transport.isFavorite == 1,
  };
  return model;
}

export function mapEtfModelToTransport(model: Etf): EtfTransport {
  const transport: EtfTransport = {
    etfId: model.id,
    userid: model.userId,
    isin: model.isin,
    name: model.name,
    wkn: model.wkn,
    ticker: model.ticker,
    chartUrl: model.chartUrl,
    isFavorite: model.isFavorite ? 1 : undefined,
  };
  return transport;
}
