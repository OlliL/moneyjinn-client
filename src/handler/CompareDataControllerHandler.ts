import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import { throwError } from "@/tools/views/ThrowError";
import type { CompareDataParameter } from "@/model/comparedata/CompareDataParameter";
import type { CompareDataResult } from "@/model/comparedata/CompareDataResult";
import type { ShowCompareDataFormResponse } from "@/model/rest/comparedata/ShowCompareDataFormResponse";
import type { CompareDataRequest } from "@/model/rest/comparedata/CompareDataRequest";
import type { CompareDataResponse } from "@/model/rest/comparedata/CompareDataResponse";
import { mapCompareDataTransportToModel } from "./mapper/CompareDataMapper";

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

  async compareData(
    compareDataParameter: CompareDataParameter
  ): Promise<CompareDataResult> {
    const usecase = "compareData";
    const request = {
      compareDataRequest: {},
    } as CompareDataRequest;
    const innerRequest = request.compareDataRequest;

    innerRequest.startDate = compareDataParameter.startDate.toISOString();
    innerRequest.endDate = compareDataParameter.endDate.toISOString();
    innerRequest.capitalSourceId = compareDataParameter.selectedCapitalSourceId;
    innerRequest.fileContents = compareDataParameter.fileContents;
    innerRequest.formatId = compareDataParameter.selectedCompareDataFormat;
    innerRequest.useImportedData = compareDataParameter.selectedSourceIsImport
      ? 1
      : 0;

    const response = await super.put(
      request,
      CompareDataControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const compareDataResponse = (await response.json()) as CompareDataResponse;
    if (compareDataResponse.error) {
      throwError(compareDataResponse.error.code);
    }
    const innerResponse = compareDataResponse.compareDataResponse;

    const result = {} as CompareDataResult;

    result.compareDatasMatching =
      innerResponse.compareDataMatchingTransport.map((t) =>
        mapCompareDataTransportToModel(t)
      );
    result.compareDatasNotInDatabase =
      innerResponse.compareDataNotInDatabaseTransport.map((t) =>
        mapCompareDataTransportToModel(t)
      );
    result.compareDatasNotInFile =
      innerResponse.compareDataNotInFileTransport.map((t) =>
        mapCompareDataTransportToModel(t)
      );
    result.compareDatasWrongCapitalsource =
      innerResponse.compareDataWrongCapitalsourceTransport.map((t) =>
        mapCompareDataTransportToModel(t)
      );

    return result;
  }
}

export default new CompareDataControllerHandler();
