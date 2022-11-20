import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { ListEtfOverviewResponse } from "@/model/rest/etf/ListEtfOverviewResponse";
import { throwError } from "@/tools/views/ThrowError";

class EtfControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "etf";

  async listEtfOverview(
    year: string,
    month: string
  ): Promise<ListEtfOverviewResponse> {
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
    return listEtfOverviewResponse;
  }
}

export default new EtfControllerHandler();
