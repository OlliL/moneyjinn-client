import AbstractControllerHandler from "@/handler/AbstractControllerHandler";
import type { Contractpartner } from "@/model/contractpartner/Contractpartner";
import type { ShowContractpartnerListResponse } from "@/model/rest/contractpartner/ShowContractpartnerListResponse";
import { throwError } from "@/tools/views/ThrowError";
import { mapContractpartnerTransportToModel } from "./mapper/ContractpartnerTransportMapper";

class ContractpartnerControllerHandler extends AbstractControllerHandler {
  private static CONTROLLER = "contractpartner";

  async fetchAllContractpartner(): Promise<Array<Contractpartner>> {
    const usecase = "showContractpartnerList/all/currentlyValid/false";
    const response = await super.get(
      ContractpartnerControllerHandler.CONTROLLER,
      usecase
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const showContractpartnerListResponse =
      (await response.json()) as ShowContractpartnerListResponse;

    if (showContractpartnerListResponse.error) {
      throwError(showContractpartnerListResponse.error.code);
    }

    const contractpartnerArray = new Array<Contractpartner>();
    const transport = await showContractpartnerListResponse
      .showContractpartnerListResponse.contractpartnerTransport;
    transport?.forEach((value) => {
      contractpartnerArray.push(mapContractpartnerTransportToModel(value));
    });

    return contractpartnerArray;
  }
}

export default new ContractpartnerControllerHandler();
