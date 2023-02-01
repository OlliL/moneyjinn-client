import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { Moneyflow } from "@/model/moneyflow/Moneyflow";
import type { MoneyflowSearchParams } from "@/model/moneyflow/MoneyflowSearchParams";
import type { MoneyflowSplitEntry } from "@/model/moneyflow/MoneyflowSplitEntry";
import type { MoneyflowValidation } from "@/model/moneyflow/MoneyflowValidation";
import type { MoneyflowsValidation } from "@/model/moneyflow/MoneyflowsValidation";
import type { CreateMoneyflowRequest } from "@/model/rest/moneyflow/CreateMoneyflowRequest";
import type { SearchMoneyflowsRequest } from "@/model/rest/moneyflow/SearchMoneyflowsRequest";
import type { SearchMoneyflowsResponse } from "@/model/rest/moneyflow/SearchMoneyflowsResponse";
import type { UpdateMoneyflowRequest } from "@/model/rest/moneyflow/UpdateMoneyflowRequest";
import type { UpdateMoneyflowResponse } from "@/model/rest/moneyflow/UpdateMoneyflowResponse";
import type { ValidationResponse } from "@/model/rest/ValidationResponse";
import type { ValidationResult } from "@/model/validation/ValidationResult";
import { throwError } from "@/tools/views/ThrowError";
import { mapMoneyflowSearchParamsToTransport } from "./mapper/MoneyflowSearchParamsTransportMapper";
import { mapMoneyflowSplitEntryToTransport } from "./mapper/MoneyflowSplitEntryTransportMapper";
import {
  mapMoneyflowToTransport,
  mapMoneyflowTransportToModel,
} from "./mapper/MoneyflowTransportMapper";
import { mapValidationItemTransportToModel } from "./mapper/ValidationItemTransportMapper";
import type { ShowEditMoneyflowResponse } from "@/model/rest/moneyflow/ShowEditMoneyflowResponse";
import { getISOStringDate } from "@/tools/views/FormatDate";
import type { SearchMoneyflowsByAmountResponse } from "@/model/rest/moneyflow/SearchMoneyflowsByAmountResponse";
import type { MoneyflowSplitEntryTransport } from "@/model/rest/transport/MoneyflowSplitEntryTransport";

class MoneyflowControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "moneyflow";

  async createMoneyflow(
    moneyflow: Moneyflow,
    usedPreDefMoneyflowId: number,
    saveAsPreDefMoneyflow: boolean
  ): Promise<ValidationResult> {
    const usecase = "createMoneyflow";

    const request = {} as CreateMoneyflowRequest;
    request.moneyflowTransport = mapMoneyflowToTransport(moneyflow);
    request.saveAsPreDefMoneyflow = saveAsPreDefMoneyflow ? 1 : 0;

    if (usedPreDefMoneyflowId != 0) {
      request.usedPreDefMoneyflowId = usedPreDefMoneyflowId;
      request.saveAsPreDefMoneyflow = 1;
    }

    if (moneyflow.moneyflowSplitEntries) {
      request.insertMoneyflowSplitEntryTransports =
        moneyflow.moneyflowSplitEntries.map((mse) => {
          return mapMoneyflowSplitEntryToTransport(mse);
        });
    }

    const response = await super.post(
      request,
      MoneyflowControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    if (response.status === 204) {
      return { result: true } as ValidationResult;
    }

    const validationResponse = (await response.json()) as ValidationResponse;
    const validationResult: ValidationResult = {
      result: validationResponse.result,
      validationResultItems: validationResponse.validationItemTransports?.map(
        (vit) => {
          return mapValidationItemTransportToModel(vit);
        }
      ),
    };

    return validationResult;
  }
  async updateMoneyflow(
    moneyflow: Moneyflow,
    createMoneyflowSplitEntries: Array<MoneyflowSplitEntry>,
    updateMoneyflowSplitEntries: Array<MoneyflowSplitEntry>,
    deleteMoneyflowSplitEntryIds: Array<number>
  ): Promise<MoneyflowValidation> {
    const usecase = "updateMoneyflowV2";

    const request = {} as UpdateMoneyflowRequest;
    request.moneyflowTransport = mapMoneyflowToTransport(moneyflow);
    request.insertMoneyflowSplitEntryTransports =
      createMoneyflowSplitEntries.map((mse) => {
        return mapMoneyflowSplitEntryToTransport(mse);
      });
    request.updateMoneyflowSplitEntryTransports =
      updateMoneyflowSplitEntries.map((mse) => {
        return mapMoneyflowSplitEntryToTransport(mse);
      });
    request.deleteMoneyflowSplitEntryIds = deleteMoneyflowSplitEntryIds;

    const response = await super.put(
      request,
      MoneyflowControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const updateMoneyflowResponse =
      (await response.json()) as UpdateMoneyflowResponse;
    const moneyflowValidation = {} as MoneyflowValidation;
    const validationResult: ValidationResult = {
      result: updateMoneyflowResponse.result,
      validationResultItems:
        updateMoneyflowResponse.validationItemTransports?.map((vit) => {
          return mapValidationItemTransportToModel(vit);
        }),
    };

    moneyflowValidation.validationResult = validationResult;

    if (validationResult.result) {
      const mmf: Moneyflow = mapMoneyflowTransportToModel(
        updateMoneyflowResponse.moneyflowTransport,
        updateMoneyflowResponse.hasReceipt,
        updateMoneyflowResponse.moneyflowSplitEntryTransports
      );
      moneyflowValidation.mmf = mmf;
    }
    return moneyflowValidation;
  }
  async deleteMoneyflow(moneyflowId: number) {
    const usecase = "deleteMoneyflowById/" + moneyflowId;

    const response = await super.delete(
      MoneyflowControllerHandler.CONTROLLER,
      usecase
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }
  }

  async searchMoneyflows(
    searchParams: MoneyflowSearchParams
  ): Promise<MoneyflowsValidation> {
    const usecase = "searchMoneyflows";

    const request = {} as SearchMoneyflowsRequest;
    request.moneyflowSearchParamsTransport =
      mapMoneyflowSearchParamsToTransport(searchParams);

    const moneyflowsValidation = {} as MoneyflowsValidation;

    const response = await super.put(
      request,
      MoneyflowControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const searchMoneyflowsResponse =
      (await response.json()) as SearchMoneyflowsResponse;

    if (searchMoneyflowsResponse.code) {
      throwError(searchMoneyflowsResponse.code);
    }

    const validationResult: ValidationResult = {
      result: searchMoneyflowsResponse.result,
      validationResultItems:
        searchMoneyflowsResponse.validationItemTransports?.map((vit) => {
          return mapValidationItemTransportToModel(vit);
        }),
    };
    moneyflowsValidation.validationResult = validationResult;

    if (validationResult.result) {
      const moneyflows: Array<Moneyflow> =
        searchMoneyflowsResponse.moneyflowTransports?.map((mmf) => {
          return mapMoneyflowTransportToModel(mmf, false);
        });
      moneyflowsValidation.moneyflows = moneyflows;
    }

    return moneyflowsValidation;
  }
  async fetchMoneyflow(id: number): Promise<Moneyflow> {
    const usecase = "showEditMoneyflow/" + id;

    const response = await super.get(
      MoneyflowControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showEditMoneyflowResponse =
      (await response.json()) as ShowEditMoneyflowResponse;

    if (showEditMoneyflowResponse.code) {
      throwError(showEditMoneyflowResponse.code);
    }

    const moneyflow = mapMoneyflowTransportToModel(
      showEditMoneyflowResponse.moneyflowTransport,
      showEditMoneyflowResponse.hasReceipt,
      showEditMoneyflowResponse.moneyflowSplitEntryTransports
    );

    return moneyflow;
  }

  async searchMoneyflowsByAmount(
    amount: number,
    startDate: Date,
    endDate: Date
  ): Promise<Array<Moneyflow>> {
    let usecase = "searchMoneyflowsByAmount";
    usecase += "/" + amount;
    usecase += "/" + getISOStringDate(startDate).replace(/[-]/gi, "");
    usecase += "/" + getISOStringDate(endDate).replace(/[-]/gi, "");

    const response = await super.get(
      MoneyflowControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    if (response.status === 204) return new Array<Moneyflow>();

    const searchMoneyflowsByAmountResponse =
      (await response.json()) as SearchMoneyflowsByAmountResponse;

    const mseMap = new Map<number, Array<MoneyflowSplitEntryTransport>>();

    if (
      searchMoneyflowsByAmountResponse.moneyflowSplitEntryTransports !==
      undefined
    ) {
      for (const mse of searchMoneyflowsByAmountResponse.moneyflowSplitEntryTransports) {
        let mseMapArray = mseMap.get(mse.moneyflowid);
        if (mseMapArray == null) {
          mseMapArray = new Array<MoneyflowSplitEntryTransport>();
        }
        mseMapArray.push(mse);
        mseMap.set(mse.moneyflowid, mseMapArray);
      }
    }

    const moneyflows: Array<Moneyflow> =
      searchMoneyflowsByAmountResponse.moneyflowTransports?.map((mmf) => {
        return mapMoneyflowTransportToModel(mmf, false, mseMap.get(mmf.id));
      });

    return moneyflows;
  }
}

export default new MoneyflowControllerHandler();
