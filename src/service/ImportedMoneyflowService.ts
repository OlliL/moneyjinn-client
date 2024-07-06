import AbstractService from "@/service/AbstractService";
import {
  mapImportedMoneyflowToTransport,
  mapImportedMoneyflowTransportToModel,
} from "./mapper/ImportedMoneyflowTransportMapper";
import type { ImportedMoneyflow } from "@/model/moneyflow/ImportedMoneyflow";
import { mapMoneyflowSplitEntryToTransport } from "./mapper/MoneyflowSplitEntryTransportMapper";
import {
  ImportedMoneyflowControllerApi,
  type ImportImportedMoneyflowRequest,
} from "@/api";

class ImportedMoneyflowService extends AbstractService {
  private api: ImportedMoneyflowControllerApi;

  public constructor() {
    super();

    this.api = super.createApi(ImportedMoneyflowControllerApi);
  }

  async showAddImportedMoneyflows(): Promise<Array<ImportedMoneyflow>> {
    const response = await this.api.showAddImportedMoneyflows();

    const showAddImportedMoneyflowsResponse = response.data;

    const result = new Array<ImportedMoneyflow>();
    if (showAddImportedMoneyflowsResponse.importedMoneyflowTransports) {
      for (const mim of showAddImportedMoneyflowsResponse.importedMoneyflowTransports) {
        result.push(mapImportedMoneyflowTransportToModel(mim));
      }
    }

    return result;
  }

  async importImportedMoneyflow(importedMoneyflow: ImportedMoneyflow) {
    const transport = mapImportedMoneyflowToTransport(importedMoneyflow);
    const request = {} as ImportImportedMoneyflowRequest;
    request.importedMoneyflowTransport = transport;
    if (importedMoneyflow.moneyflowSplitEntries) {
      request.insertMoneyflowSplitEntryTransports =
        importedMoneyflow.moneyflowSplitEntries.map((mse) => {
          return mapMoneyflowSplitEntryToTransport(mse);
        });
    }

    await this.api.importImportedMoneyflows(request);
  }

  async deleteImportedMoneyflow(id: number) {
    await this.api.deleteImportedMoneyflowById(id);
  }
}

export default new ImportedMoneyflowService();
