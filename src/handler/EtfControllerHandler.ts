import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { EtfSummary } from "@/model/etf/EtfSummary";
import type { ListEtfOverviewResponse } from "@/model/rest/etf/ListEtfOverviewResponse";
import { throwError } from "@/tools/views/ThrowError";
import { mapEtfSummaryTransportToEtfSummary } from "./mapper/EtfTSummaryTransportMapper";

class EtfControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "etf";

  async listEtfOverview(
    year: string,
    month: string
  ): Promise<Array<EtfSummary>> {
    let usecase = "listEtfOverview";
    usecase += "/" + year;
    usecase += "/" + month;
    const response = await super.get(EtfControllerHandler.CONTROLLER, usecase);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const listEtfOverviewResponse =
      (await response.json()) as ListEtfOverviewResponse;

    if (listEtfOverviewResponse.error) {
      throwError(listEtfOverviewResponse.error.code);
    }
    const etfSummaryArray = new Array<EtfSummary>();
    const transport =
      listEtfOverviewResponse.listEtfOverviewResponse.etfSummaryTransport;
    transport?.forEach((value) => {
      etfSummaryArray.push(mapEtfSummaryTransportToEtfSummary(value));
    });

    return etfSummaryArray;
  }
}

export default new EtfControllerHandler();
