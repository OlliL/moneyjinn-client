import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { GetAvailableMonthResponse } from "@/model/rest/report/GetAvailableMonthResponse";
import type { AvailableMonth } from "@/model/report/AvailableMonth";
import { throwError } from "@/tools/views/ThrowError";

class ReportControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "report";

  async getAvailableMonth(
    year?: string,
    month?: string
  ): Promise<AvailableMonth> {
    let usecase = "getAvailableMonth";
    if (year) {
      usecase += "/" + year;
      if (month) {
        usecase += "/" + month;
      }
    }
    const response = await super.get(
      ReportControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const getAvailableMonthResponse =
      (await response.json()) as GetAvailableMonthResponse;

    if (getAvailableMonthResponse.error) {
      throwError(getAvailableMonthResponse.error.code);
    }

    // easy mapping for now - same attributes
    const availableMonth: AvailableMonth =
      getAvailableMonthResponse.getAvailableMonthResponse;

    return availableMonth;
  }
}

export default new ReportControllerHandler();
