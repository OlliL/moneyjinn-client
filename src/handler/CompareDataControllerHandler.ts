import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { CompareDataParameter } from "@/model/comparedata/CompareDataParameter";
import type { CompareDataResult } from "@/model/comparedata/CompareDataResult";
import { getISOStringDate } from "@/tools/views/FormatDate";
import { CompareDataControllerApi, type CompareDataRequest } from "@/api";
import { AxiosInstanceHolder } from "./AxiosInstanceHolder";
import type { CompareData } from "@/model/comparedata/CompareData";
import { mapMoneyflowTransportToModel } from "./mapper/MoneyflowTransportMapper";
import { mapCCompareDataDatasetTransportToModel } from "./mapper/CompareCompareDataDataset";

class CompareDataControllerHandler extends AbstractControllerHandler {
  private api: CompareDataControllerApi;

  public constructor() {
    super();

    this.api = new CompareDataControllerApi(
      undefined,
      "",
      AxiosInstanceHolder.getInstance().getAxiosInstance()
    );
  }

  async showCompareDataForm(): Promise<CompareDataParameter> {
    const response = await this.api.showCompareDataForm();

    const showCompareDataFormResponse = response.data;

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
    const request = {} as CompareDataRequest;

    request.startDate = getISOStringDate(compareDataParameter.startDate);
    request.endDate = getISOStringDate(compareDataParameter.endDate);
    request.capitalsourceId = compareDataParameter.selectedCapitalSourceId;
    request.fileContents = compareDataParameter.fileContents;
    request.formatId = compareDataParameter.selectedCompareDataFormat;
    request.useImportedData = compareDataParameter.selectedSourceIsImport
      ? 1
      : 0;

    const response = await this.api.compareData(request);

    const compareDataResponse = response.data;

    const result = {} as CompareDataResult;

    if (compareDataResponse.compareDataMatchingTransports) {
      const compareData = Array<CompareData>();
      for (const transport of compareDataResponse.compareDataMatchingTransports) {
        compareData.push({
          moneyflow: mapMoneyflowTransportToModel(
            transport.moneyflowTransport,
            false
          ),
          compareDataDataset: mapCCompareDataDatasetTransportToModel(
            transport.compareDataDatasetTransport
          ),
        });
      }
      result.compareDatasMatching = compareData;
    }

    if (compareDataResponse.compareDataNotInDatabaseTransports) {
      const compareData = Array<CompareData>();
      for (const transport of compareDataResponse.compareDataNotInDatabaseTransports) {
        compareData.push({
          compareDataDataset: mapCCompareDataDatasetTransportToModel(
            transport.compareDataDatasetTransport
          ),
        });
      }
      result.compareDatasNotInDatabase = compareData;
    }

    if (compareDataResponse.compareDataNotInFileTransports) {
      const compareData = Array<CompareData>();
      for (const transport of compareDataResponse.compareDataNotInFileTransports) {
        compareData.push({
          moneyflow: mapMoneyflowTransportToModel(
            transport.moneyflowTransport,
            false
          ),
        });
      }
      result.compareDatasNotInFile = compareData;
    }

    if (compareDataResponse.compareDataWrongCapitalsourceTransports) {
      const compareData = Array<CompareData>();
      for (const transport of compareDataResponse.compareDataWrongCapitalsourceTransports) {
        compareData.push({
          moneyflow: mapMoneyflowTransportToModel(
            transport.moneyflowTransport,
            false
          ),
          compareDataDataset: mapCCompareDataDatasetTransportToModel(
            transport.compareDataDatasetTransport
          ),
        });
      }
      result.compareDatasWrongCapitalsource = compareData;
    }
    return result;
  }
}

export default new CompareDataControllerHandler();
