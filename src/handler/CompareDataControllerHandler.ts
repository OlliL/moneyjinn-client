import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import { throwError } from "@/tools/views/ThrowError";
import type { CompareDataParameter } from "@/model/comparedata/CompareDataParameter";
import type { ShowCompareDataFormResponse } from "@/model/rest/comparedata/ShowCompareDataFormResponse";

class CompareDataControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "comparedata";

  async showCompareDataForm(): Promise<CompareDataParameter> {
    const usecase = "showCompareDataForm";

    const response = await super.get(
      CompareDataControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showCompareDataFormResponse =
      (await response.json()) as ShowCompareDataFormResponse;

    if (showCompareDataFormResponse.error) {
      throwError(showCompareDataFormResponse.error.code);
    }

    const innerResponse =
      showCompareDataFormResponse.showCompareDataFormResponse;

    const compareDataParameter = {
      compareDataFormats: innerResponse.compareDataFormatTransport,
      selectedCapitalSourceId: innerResponse.selectedCapitalsourceId,
      selectedSourceIsImport:
        innerResponse.selectedSourceIsFile === 1 ? true : false,
      selectedCompareDataFormat: innerResponse.selectedDataFormat,
    } as CompareDataParameter;

    return compareDataParameter;
  }
}

export default new CompareDataControllerHandler();
