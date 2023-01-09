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

    if (showCompareDataFormResponse.code) {
      throwError(showCompareDataFormResponse.code);
    }

    const compareDataParameter = {
      compareDataFormats:
        showCompareDataFormResponse.compareDataFormatTransports,
      selectedCapitalSourceId:
        showCompareDataFormResponse.selectedCapitalsourceId,
      selectedSourceIsImport:
        showCompareDataFormResponse.selectedSourceIsFile === 1 ? true : false,
      selectedCompareDataFormat: showCompareDataFormResponse.selectedDataFormat,
    } as CompareDataParameter;

    return compareDataParameter;
  }

  async compareData(
    compareDataParameter: CompareDataParameter
  ): Promise<CompareDataResult> {
    const usecase = "compareData";
    const request = {} as CompareDataRequest;

    request.startDate = compareDataParameter.startDate.toISOString();
    request.endDate = compareDataParameter.endDate.toISOString();
    request.capitalsourceId = compareDataParameter.selectedCapitalSourceId;
    request.fileContents = compareDataParameter.fileContents;
    request.formatId = compareDataParameter.selectedCompareDataFormat;
    request.useImportedData = compareDataParameter.selectedSourceIsImport
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
    if (compareDataResponse.code) {
      throwError(compareDataResponse.code);
    }

    const result = {} as CompareDataResult;

    result.compareDatasMatching =
      compareDataResponse.compareDataMatchingTransports.map((t) =>
        mapCompareDataTransportToModel(t)
      );
    result.compareDatasNotInDatabase =
      compareDataResponse.compareDataNotInDatabaseTransports.map((t) =>
        mapCompareDataTransportToModel(t)
      );
    result.compareDatasNotInFile =
      compareDataResponse.compareDataNotInFileTransports.map((t) =>
        mapCompareDataTransportToModel(t)
      );
    result.compareDatasWrongCapitalsource =
      compareDataResponse.compareDataWrongCapitalsourceTransports.map((t) =>
        mapCompareDataTransportToModel(t)
      );

    return result;
  }
}

export default new CompareDataControllerHandler();
